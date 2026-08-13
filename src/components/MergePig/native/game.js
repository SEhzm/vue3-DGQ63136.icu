import Matter from 'matter-js';
import {
  LEVEL_COUNT,
  LEVELS,
  getMergeScore,
  getRadius,
} from './config.js';

const {
  Engine,
  Render,
  Runner,
  Bodies,
  Body,
  Composite,
  Events,
} = Matter;

export class MergeMilkFrogGame {
  constructor(root, callbacks) {
    this.root = root;
    this.callbacks = callbacks;
    this.score = 0;
    this.bestScore = 0;
    this.isFinished = false;
    this.canDrop = true;
    this.ballQueue = [];
    this.aimX = 0;
    this.currentLevel = null;
    this.nextLevel = null;
    this.highestLevel = 0;
    this.mergeQueue = [];
    this.mergingBodyIds = new Set();
    this.dangerSince = null;
    this.imageCache = new Map();
    this.dropTimer = null;
    this.wsClient = null;
    this.isOnline = true;
    this.onNetworkStatusChange = null;
    this.pendingBall = null; // 等待服务器响应的球
  }

  start() {
    this.renderShell();
    this.cacheElements();
    this.bindUi();
    this.createPhysics();
    this.resize();
    this.aimX = this.width / 2;
    this.updateScore();
    this.updatePreview();
  }

  onServerInit(queue, bestScore) {
    this.bestScore = bestScore;
    this.ballQueue = [...queue];
    this.currentLevel = this.ballQueue.shift();
    this.nextLevel = this.ballQueue.length > 0 ? this.ballQueue.shift() : 0;
    this.updateScore();
    this.updatePreview();
  }

  onServerNextBall(level) {
    this.ballQueue.push(level);
    if (this.nextLevel === null || this.nextLevel === undefined) {
      this.nextLevel = this.ballQueue.shift();
    }

    // 服务端下发和离线补球都代表本次落球已确认，统一推进预告队列。
    if (this.pendingBall) {
      this.currentLevel = this.nextLevel;
      this.nextLevel = this.ballQueue.length > 0 ? this.ballQueue.shift() : null;
      this.pendingBall = null;
    }
    this.updatePreview();
  }

  /**
   * 设置网络状态（在线/离线）
   */
  setNetworkStatus(online) {
    this.isOnline = online;
    // 显示/隐藏网络状态提示
    if (this.networkStatusEl) {
      this.networkStatusEl.style.display = online ? 'none' : 'flex';
    }
    if (this.onNetworkStatusChange) {
      this.onNetworkStatusChange(online);
    }
  }

  /**
   * 渲染 HTML 外壳（在 renderShell 中添加网络状态提示元素）
   */
  // 在 renderShell 中 control-bar 后添加：
  // <div id="network-status" class="network-status hidden">网络状况不佳，已切换离线模式</div>
  // 并在 CSS 中添加 .network-status 样式

  renderShell() {
    this.root.innerHTML = `
      <main class="page-shell">
        <a
          class="github-link"
          href="https://github.com/Arch-Tempered-mortis/merge-big-milk-frog"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="在新标签页查看 GitHub 源码"
          title="查看 GitHub 源码"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 .7C5.7.7.7 5.8.7 12.2c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.3.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.5-.3-5.2-1.3-5.2-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3 0 0 1-.3 3.2 1.2a10.8 10.8 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.5.2 2.7.1 3 .8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.2 5.7.4.4.8 1.1.8 2.1v3.1c0 .4.2.7.8.6a11.6 11.6 0 0 0 7.8-10.9C23.3 5.8 18.3.7 12 .7Z" />
          </svg>
        </a>
        <section class="game-card" aria-label="合成大猪头游戏">
          <header class="hero-bar">
            <div class="brand-block">
              <p class="eyebrow">十级合成挑战</p>
              <h1>合成大猪头</h1>
              <p class="tagline">把相同的小猪头碰到一起，合成第 10 级即可通关。</p>
            </div>
            <div class="score-board" aria-label="分数信息">
              <div class="score-item">
                <span>本局分数</span>
                <strong id="score-value">0</strong>
              </div>
              <div class="score-item best">
                <span>历史最高</span>
                <strong id="best-score-value">0</strong>
              </div>
              <div class="network-status" id="network-status" style="display: none;">
                <span class="network-indicator"></span>
                <span class="network-text">网络状况不佳，已切换至离线模式</span>
              </div>
              <button class="mobile-leaderboard-btn" id="mobile-leaderboard-btn" type="button" aria-label="排行榜">排行榜</button>
            </div>
          </header>

          <div class="control-bar">
            <div class="preview-group" aria-label="球体预览">
              <div class="preview-item">
                <span>当前</span>
                <div class="mini-ball" id="current-preview"></div>
              </div>
              <div class="preview-arrow" aria-hidden="true">→</div>
              <div class="preview-item">
                <span>下一个</span>
                <div class="mini-ball" id="next-preview"></div>
              </div>
            </div>

            <button class="soft-button restart-button" id="restart-game" type="button">重新开始</button>
          </div>

          <!-- 网络状态提示 -->
          <div id="network-status" class="network-status hidden">网络状况不佳，已切换离线模式</div>

          <div class="game-stage" id="canvas-host">
            <div class="danger-label">警戒线</div>
            <div class="eat-toast" id="eat-toast">过年啦~🐖被吃了</div>
            <div class="pacman-host" id="pacman-host">
              <svg class="pacman-svg" viewBox="0 0 60 60" aria-hidden="true">
                <path d="M30,30 L60,15 A30,30 0 1,0 60,45 Z" fill="#f4d03f" />
                <circle cx="22" cy="22" r="3" fill="#000" />
              </svg>
            </div>
            <div class="chopstick-host" id="chopstick-host">
              <svg class="chopstick-svg" viewBox="0 0 200 40" aria-hidden="true">
                <!-- 两根筷子平行，筷子头略尖 -->
                <g class="chopstick-stick" fill="#8b4513">
                  <!-- 上筷子 -->
                  <polygon points="10,2 190,2 188,12 12,12" />
                  <!-- 下筷子 -->
                  <polygon points="12,28 188,28 190,38 10,38" />
                </g>
                <!-- 筷子顶部装饰（金色） -->
                <g fill="#f4d03f">
                  <rect x="8" y="0" width="184" height="3" rx="1" />
                  <rect x="8" y="37" width="184" height="3" rx="1" />
                </g>
              </svg>
            </div>
            <div class="game-overlay hidden" id="game-overlay">
              <div class="overlay-panel">
                <p class="overlay-kicker" id="overlay-kicker"></p>
                <h2 id="overlay-title"></h2>
                <p class="overlay-message" id="overlay-message"></p>
                <div class="result-score">
                  <span>本局得分</span>
                  <strong id="final-score">0</strong>
                </div>
                <p class="result-best" id="result-best"></p>
                <button class="primary-button" id="play-again" type="button">再玩一次</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    `;
  }

  cacheElements() {
    this.canvasHost = this.root.querySelector('#canvas-host');
    this.scoreElement = this.root.querySelector('#score-value');
    this.bestScoreElement = this.root.querySelector('#best-score-value');
    this.currentPreview = this.root.querySelector('#current-preview');
    this.nextPreview = this.root.querySelector('#next-preview');
    this.overlay = this.root.querySelector('#game-overlay');
    this.eatToast = this.root.querySelector('#eat-toast');
    this.pacmanHost = this.root.querySelector('#pacman-host');
    this.pacmanSvg = this.pacmanHost?.querySelector('.pacman-svg');
    this.chopstickHost = this.root.querySelector('#chopstick-host');
    this.chopstickSvg = this.chopstickHost?.querySelector('.chopstick-svg');
    this.mobileLeaderboardBtn = this.root.querySelector('#mobile-leaderboard-btn');
    this.networkStatusEl = this.root.querySelector('#network-status');
  }

  bindUi() {
    this.onPointerMove = (event) => {
      if (this.isFinished || !this.width) return;
      const rect = this.canvasHost.getBoundingClientRect();
      const radius = getRadius(this.currentLevel);
      this.aimX = clamp(event.clientX - rect.left, radius + 8, this.width - radius - 8);
    };

    this.onPointerDown = (event) => {
      if (this.isFinished) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      event.preventDefault();
      this.onPointerMove(event);
      this.canvasHost.setPointerCapture?.(event.pointerId);
    };

    this.onPointerUp = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      event.preventDefault();
      this.onPointerMove(event);
      this.canvasHost.releasePointerCapture?.(event.pointerId);
      this.dropBall();
    };

    this.onPointerCancel = (event) => {
      this.canvasHost.releasePointerCapture?.(event.pointerId);
    };

    this.canvasHost.addEventListener('pointermove', this.onPointerMove);
    this.canvasHost.addEventListener('pointerdown', this.onPointerDown);
    this.canvasHost.addEventListener('pointerup', this.onPointerUp);
    this.canvasHost.addEventListener('pointercancel', this.onPointerCancel);

    this.root.querySelector('#restart-game').addEventListener('click', this.callbacks.onRestartRequest);
    this.root.querySelector('#play-again').addEventListener('click', this.callbacks.onPlayAgain);
    this.mobileLeaderboardBtn?.addEventListener('click', () => {
      this.callbacks.onLeaderboardOpen?.();
    });

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvasHost);
  }

  createPhysics() {
    this.engine = Engine.create({ enableSleeping: false });
    this.engine.gravity.y = 1.18;
    this.engine.positionIterations = 8;
    this.engine.velocityIterations = 6;
    this.engine.constraintIterations = 3;
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);

    this.render = Render.create({
      element: this.canvasHost,
      engine: this.engine,
      options: {
        width: 400,
        height: 650,
        wireframes: false,
        background: 'transparent',
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      },
    });
    Render.run(this.render);

    Events.on(this.engine, 'collisionStart', (event) => this.handleCollisions(event.pairs));
    Events.on(this.engine, 'afterUpdate', () => {
      this.processMergeQueue();
      this.checkDangerLine();
    });
    Events.on(this.render, 'afterRender', () => this.drawGame());
  }

  resize() {
    const rect = this.canvasHost.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.round(rect.width));
    const nextHeight = Math.max(1, Math.round(rect.height));
    if (nextWidth === this.width && nextHeight === this.height) return;

    const previousWidth = this.width;
    const previousHeight = this.height;
    this.width = nextWidth;
    this.height = nextHeight;
    this.dangerY = Math.max(110, Math.round(this.height * 0.21));

    if (!this.render) return;

    this.render.options.width = this.width;
    this.render.options.height = this.height;
    this.render.canvas.style.width = `${this.width}px`;
    this.render.canvas.style.height = `${this.height}px`;
    Render.setPixelRatio(this.render, this.render.options.pixelRatio);

    if (previousWidth && previousHeight) {
      const scaleX = this.width / previousWidth;
      const scaleY = this.height / previousHeight;
      for (const body of Composite.allBodies(this.engine.world)) {
        if (!body.isGameBall) continue;
        Body.setPosition(body, {
          x: clamp(body.position.x * scaleX, body.circleRadius, this.width - body.circleRadius),
          y: Math.min(body.position.y * scaleY, this.height - body.circleRadius),
        });
      }
    }

    this.createWalls();
    this.aimX = clamp(this.aimX || this.width / 2, 30, this.width - 30);
  }

  createWalls() {
    if (this.walls) {
      for (const wall of this.walls) Composite.remove(this.engine.world, wall);
    }

    const thickness = 72;
    this.walls = [
      Bodies.rectangle(-thickness / 2, this.height / 2, thickness, this.height * 2, wallOptions()),
      Bodies.rectangle(this.width + thickness / 2, this.height / 2, thickness, this.height * 2, wallOptions()),
      Bodies.rectangle(this.width / 2, this.height + thickness / 2, this.width + thickness * 2, thickness, wallOptions()),
    ];
    Composite.add(this.engine.world, this.walls);
  }

  dropBall() {
    if (!this.canDrop || this.isFinished || this.pendingBall || this.currentLevel == null) return;

    const level = this.currentLevel;
    const radius = getRadius(level);
    const x = clamp(this.aimX, radius + 4, this.width - radius - 4);
    const y = Math.max(radius + 12, this.dangerY - radius - 18);
    const newBall = this.createBall(x, y, level);
    Composite.add(this.engine.world, newBall);

    // 球落下后每隔一段时间轮询：若已落到下方 20% 区域，2% 概率触发吃球
    if (level >= 1 && level <= 4) {
        this.scheduleEatPoll(newBall);
    }

    // 记录待确认的球，不立即推进 currentLevel/nextLevel
    this.pendingBall = { ball: newBall, level };

    this.canDrop = false;
    this.wsClient?.sendDrop(this.score, this.currentLevel);

    window.clearTimeout(this.dropTimer);
    this.dropTimer = window.setTimeout(() => {
      if (!this.isFinished) this.canDrop = true;
    }, 420);
  }

  /**
   * 轮询检测：球落到下方 50% 区域，且已落下超过 2 秒
   * 总触发率 6%，三种彩蛋各 2%
   */
  scheduleEatPoll(ball) {
    if (this.isFinished || !ball || !ball.id) return;
    const POLL_INTERVAL = 120; // ms
    const MAX_TICKS = 250; // 最多轮询 30 秒，防止内存泄漏
    let ticks = 0;

    const tick = () => {
      ticks++;
      // 已被移除/合并/事件运行中则停止轮询
      if (this.isFinished || this.eatEventRunning) return;
      if (!Composite.allBodies(this.engine.world).includes(ball)) return;

      // 检查：球落到下方 50% 区域，且已落下超过 2 秒
      const bottomThreshold = this.height * 0.5;
      const elapsed = performance.now() - ball.spawnedAt;
      if (ball.position.y >= bottomThreshold && elapsed >= 2000 && Math.random() < 0.02) {
        // 6% 概率触发彩蛋，三种各 1/3
        const rand = Math.random();
        if (rand < 1/3) {
          this.scheduleEatEvent(ball, 'pacman');
        } else if (rand < 2/3) {
          this.scheduleEatEvent(ball, 'chopstick');
        } else {
          this.triggerSuperBounce(ball);
        }
        return;
      }

      if (ticks < MAX_TICKS) {
        setTimeout(tick, POLL_INTERVAL);
      }
    };

    setTimeout(tick, POLL_INTERVAL);
  }

  /**
   * 彩蛋：超弹跳 - restitution 设为 0.9，球自己弹出画面外
   */
  triggerSuperBounce(ball) {
    if (!ball || !ball.id) return;
    ball.restitution = 0.9;
    const bouncePower = 32 + Math.random() * 12; // 32-44
    Body.setVelocity(ball, {
      x: (Math.random() - 0.5) * 10,
      y: -bouncePower
    });
    ball.isSuperBounce = true;
    // 提示：飞猪~
    if (this.eatToast) {
      this.eatToast.textContent = '飞猪~';
      this.eatToast.classList.add('show');
      setTimeout(() => this.eatToast?.classList.remove('show'), 1500);
    }
  }

  /**
   * 触发吃球事件：指定模式 (pacman/chopstick)
   */
  scheduleEatEvent(ball, mode) {
    if (this.isFinished) return;
    if (this.eatEventRunning) return;
    this.eatEventRunning = true;

    const ballPos = { x: ball.position.x, y: ball.position.y };
    const ballRadius = ball.circleRadius || 25;

    // 立刻从物理世界移除球（不留痕迹）
    Composite.remove(this.engine.world, ball);

    // 1. 选取入口方向：从左侧或右侧边缘
    const fromLeft = Math.random() < 0.5;
    const size = mode === 'pacman' ? 50 : 80;
    const startX = fromLeft ? -size : this.width + size;
    const endX = fromLeft ? -size : this.width + size;

    const host = mode === 'pacman' ? this.pacmanHost : this.chopstickHost;
    const svg = mode === 'pacman' ? this.pacmanSvg : this.chopstickSvg;
    if (!host) {
      this.eatEventRunning = false;
      return;
    }

    // 2. 显示动画元素
    host.style.display = 'block';
    host.style.width = `${size}px`;
    host.style.height = `${size}px`;
    host.style.left = `${startX}px`;
    host.style.top = `${ballPos.y - size / 2}px`;
    host.style.transform = '';
    // 朝向：朝左时翻转
    if (svg) svg.style.transform = fromLeft ? 'scaleX(1)' : 'scaleX(-1)';

    // 动画参数
    const SPEED = 0.35; // px/ms
    const duration = Math.abs(startX - ballPos.x) / SPEED;

    // 3. 移动到球位置
    host.style.transition = `left ${duration}ms linear`;
    host.style.left = `${ballPos.x - size / 2}px`;

    if (mode === 'pacman') {
      // 吃豆人：直接移动到球位置，张嘴吞掉
      setTimeout(() => {
        if (this.eatToast) {
          this.eatToast.textContent = '过年啦~';
          this.eatToast.classList.add('show');
          setTimeout(() => this.eatToast?.classList.remove('show'), 1500);
        }
        host.style.transition = `left ${duration}ms linear`;
        host.style.left = `${endX - size / 2}px`;
        setTimeout(() => {
          host.style.display = 'none';
          host.style.transition = '';
          this.eatEventRunning = false;
        }, duration);
      }, duration);
    } else {
      // 筷子：先张开 → 夹住球 → 夹走
      this.animateChopsticks(host, svg, ballPos, size, fromLeft, duration, endX, size, () => {
        this.eatEventRunning = false;
      });
    }
  }

  /**
   * 筷子动画：张开 → 合上夹球 → 夹走
   */
  animateChopsticks(host, svg, ballPos, size, fromLeft, duration, endX, chopstickSize, onComplete) {
    const upper = svg?.querySelector('.chopstick-stick polygon:first-of-type');
    const lower = svg?.querySelector('.chopstick-stick polygon:last-of-type');
    if (!upper || !lower) {
      // 回退：直接移动
      host.style.transition = `left ${duration}ms linear`;
      host.style.left = `${endX - chopstickSize / 2}px`;
      setTimeout(() => {
        host.style.display = 'none';
        host.style.transition = '';
        this.eatEventRunning = false;
      }, duration);
      return;
    }

    const centerY = chopstickSize / 2;
    const gap = 24; // 张开时筷子间距
    const clampGap = 4; // 合上时筷子间距（夹住球）

    // 1. 张开动画
    upper.style.transformOrigin = 'center';
    lower.style.transformOrigin = 'center';
    upper.style.transition = 'transform 200ms ease-out';
    lower.style.transition = 'transform 200ms ease-out';
    upper.style.transform = `translateY(-${gap / 2}px)`;
    lower.style.transform = `translateY(${gap / 2}px)`;

    setTimeout(() => {
      // 到达球位置：合上筷子，提示"让我夹一筷子"
      upper.style.transition = 'transform 150ms ease-in';
      lower.style.transition = 'transform 150ms ease-in';
      upper.style.transform = `translateY(-${clampGap / 2}px)`;
      lower.style.transform = `translateY(${clampGap / 2}px)`;

      // 提示：让我夹一筷子
      if (this.eatToast) {
        this.eatToast.textContent = '让我夹一筷子';
        this.eatToast.classList.add('show');
      }

      // 夹住球后，向外移动（用跟球一样的速度）
      setTimeout(() => {
        const SPEED = 0.35; // 跟球一样的速度
        const carryDistance = Math.abs(endX - chopstickSize - (fromLeft ? -chopstickSize : this.width + chopstickSize)) + chopstickSize;
        const carryDuration = carryDistance / SPEED; // 跟球一样的速度
        host.style.transition = `left ${carryDuration}ms linear`;
        host.style.left = `${endX - chopstickSize}px`;

        setTimeout(() => {
          // 筷子张开放下球，然后离场
          upper.style.transition = 'transform 200ms ease-out';
          lower.style.transition = 'transform 200ms ease-out';
          upper.style.transform = `translateY(-${gap / 2}px)`;
          lower.style.transform = `translateY(${gap / 2}px)`;

          setTimeout(() => {
            host.style.display = 'none';
            host.style.transition = '';
            if (this.eatToast) {
              this.eatToast.classList.remove('show');
            }
            if (typeof onComplete === 'function') onComplete();
          }, carryDuration + 200);
        }, 200); // 稍微停顿夹住球的感觉
      }, 200); // 合上持续 200ms
    }, 100); // 到达后 100ms 开始合上
  } 

  createBall(x, y, level) {
    const radius = getRadius(level);
    const ball = Bodies.circle(x, y, radius, {
      restitution: 0.075,
      friction: 1,
      frictionStatic: 1,
      frictionAir: 0.008,
      density: 1 + level * 0.1,
      slop: 0.02,
      render: { visible: false },
    });
    ball.gameLevel = level;
    ball.isGameBall = true;
    ball.spawnedAt = performance.now();
    return ball;
  }

  handleCollisions(pairs) {
    if (this.isFinished) return;

    for (const pair of pairs) {
      const a = pair.bodyA;
      const b = pair.bodyB;
      if (!a.isGameBall || !b.isGameBall) continue;
      if (a.gameLevel !== b.gameLevel) continue;
      if (a.gameLevel >= LEVEL_COUNT - 1) continue;
      if (this.mergingBodyIds.has(a.id) || this.mergingBodyIds.has(b.id)) continue;

      this.mergingBodyIds.add(a.id);
      this.mergingBodyIds.add(b.id);
      this.mergeQueue.push({ a, b, level: a.gameLevel + 1 });
    }
  }

  processMergeQueue() {
    if (this.isFinished) {
      this.mergeQueue.length = 0;
      this.mergingBodyIds.clear();
      return;
    }

    while (this.mergeQueue.length) {
      const { a, b, level } = this.mergeQueue.shift();
      const bodies = Composite.allBodies(this.engine.world);
      if (!bodies.includes(a) || !bodies.includes(b)) continue;

      const x = (a.position.x + b.position.x) / 2;
      const y = (a.position.y + b.position.y) / 2;
      const velocity = {
        x: (a.velocity.x + b.velocity.x) / 2,
        y: (a.velocity.y + b.velocity.y) / 2,
      };

      Composite.remove(this.engine.world, [a, b]);
      const merged = this.createBall(x, y, level);
      Body.setVelocity(merged, {
        x: velocity.x + (Math.random() - 0.5) * 1.5,
        y: Math.min(velocity.y, -1.35),
      });
      Body.setAngularVelocity(merged, (Math.random() - 0.5) * 0.01);
      Composite.add(this.engine.world, merged);
      this.wakeAllBalls();

      this.score += getMergeScore(level);
      this.updateScore();

      // 更新最高等级
      if (level > this.highestLevel) {
        this.highestLevel = level;
      }

      if (level === LEVEL_COUNT - 1) {
        this.finishGame('win');
        break;
      }
    }

    this.mergingBodyIds.clear();
  }

  updateScore() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
    }
    this.scoreElement.textContent = String(this.score);
    this.bestScoreElement.textContent = String(this.bestScore);
    this.wsClient?.updateScore(this.score, this.highestLevel);
  }

  checkDangerLine() {
    if (this.isFinished) return;

    const now = performance.now();
    const dangerous = Composite.allBodies(this.engine.world).some((body) => {
      if (!body.isGameBall) return false;
      if (now - body.spawnedAt < 1200) return false;
      const top = body.position.y - (body.circleRadius || 0);
      return top < this.dangerY && body.speed < 0.8;
    });

    if (dangerous) {
      if (!this.dangerSince) this.dangerSince = now;
      if (now - this.dangerSince >= 1700) this.finishGame('lose');
    } else {
      this.dangerSince = null;
    }
  }

  drawGame() {
    const context = this.render.context;
    const pixelRatio = this.render.options.pixelRatio;
    context.save();
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    context.strokeStyle = this.dangerSince ? '#e85d75' : 'rgba(232, 93, 117, 0.62)';
    context.lineWidth = this.dangerSince ? 3 : 2;
    context.setLineDash([10, 8]);
    context.beginPath();
    context.moveTo(0, this.dangerY);
    context.lineTo(this.width, this.dangerY);
    context.stroke();
    context.setLineDash([]);

    // 离线模式下在警戒线上方显示提示
    if (!this.isOnline) {
      context.font = '12px "Microsoft YaHei", sans-serif';
      context.fillStyle = 'rgba(232, 93, 117, 0.9)';
      context.textAlign = 'center';
      context.fillText('网络状况不佳，已切换离线模式', this.width / 2, this.dangerY - 8);
    }

    if (!this.isFinished && this.currentLevel != null) {
      const radius = getRadius(this.currentLevel);
      const y = Math.max(radius + 12, this.dangerY - radius - 18);
      context.strokeStyle = 'rgba(45, 106, 79, 0.26)';
      context.lineWidth = 1.5;
      context.beginPath();
      context.moveTo(this.aimX, 0);
      context.lineTo(this.aimX, y - radius - 5);
      context.stroke();
      this.drawBall(context, {
        position: { x: this.aimX, y },
        circleRadius: radius,
        gameLevel: this.currentLevel,
        angle: 0,
      }, 0.76);
    }

    for (const body of Composite.allBodies(this.engine.world)) {
      if (body.isGameBall) this.drawBall(context, body, 1);
    }

    context.restore();
  }

  drawBall(context, body, alpha) {
    const level = LEVELS[body.gameLevel];
    // 防御性检查：如果 level 为 undefined，使用默认值
    if (!level) {
      console.warn('[MergePig] drawBall: invalid gameLevel', body.gameLevel);
      return;
    }
    const radius = body.circleRadius;
    const { x, y } = body.position;

    context.save();
    context.globalAlpha = alpha;
    context.translate(x, y);
    context.rotate(body.angle || 0);
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.clip();

    const gradient = context.createRadialGradient(-radius * 0.28, -radius * 0.35, radius * 0.08, 0, 0, radius);
    gradient.addColorStop(0, lighten(level.color, 0.23));
    gradient.addColorStop(1, level.color);
    context.fillStyle = gradient;
    context.fillRect(-radius, -radius, radius * 2, radius * 2);

    const imageState = this.getImage(level.image);
    if (imageState.loaded) {
      drawCoverImage(context, imageState.image, radius);
    } else {
      context.fillStyle = body.gameLevel >= 7 ? '#fff9db' : '#24452f';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.font = `900 ${Math.max(15, Math.round(radius * 0.72))}px system-ui, sans-serif`;
      context.fillText(level.label, 0, 1, radius * 1.4);
    }

    context.beginPath();
    context.arc(0, 0, radius - 1.5, 0, Math.PI * 2);
    context.strokeStyle = 'rgba(255,255,255,0.68)';
    context.lineWidth = Math.max(2, radius * 0.055);
    context.stroke();
    context.restore();
  }

  getImage(source) {
    if (this.imageCache.has(source)) return this.imageCache.get(source);

    const state = { image: new Image(), loaded: false, failed: false };
    state.image.addEventListener('load', () => {
      state.loaded = true;
    }, { once: true });
    state.image.addEventListener('error', () => {
      state.failed = true;
    }, { once: true });
    state.image.src = source;
    this.imageCache.set(source, state);
    return state;
  }

  updatePreview() {
    if (this.currentLevel != null) this.paintMiniBall(this.currentPreview, this.currentLevel);
    if (this.nextLevel != null) this.paintMiniBall(this.nextPreview, this.nextLevel);
  }

  paintMiniBall(element, levelIndex) {
    // 防御性检查：levelIndex 可能为 null/undefined 或超出范围
    if (levelIndex == null || levelIndex < 0 || levelIndex >= LEVELS.length) {
      element.replaceChildren();
      element.style.removeProperty('--ball-color');
      return;
    }
    const level = LEVELS[levelIndex];
    if (!level) {
      element.replaceChildren();
      element.style.removeProperty('--ball-color');
      return;
    }
    element.replaceChildren();
    element.style.setProperty('--ball-color', level.color);

    const label = document.createElement('span');
    label.textContent = level.label;
    element.append(label);

    const image = new Image();
    image.alt = `第 ${level.label} 级`;
    image.addEventListener('load', () => element.append(image), { once: true });
    image.src = level.image;
  }

  playMergeSound(levelIndex) {
    const source = levelIndex === LEVEL_COUNT - 1
      ? WIN_SOUND
      : MERGE_SOUND_POOL[Math.floor(Math.random() * MERGE_SOUND_POOL.length)];
    if (!source || this.failedSounds.has(source)) return;
    if (!this.audioPreferences.enabled || this.audioPreferences.volume <= 0) return;

    const audio = new Audio(source);
    audio.preload = 'auto';
    audio.volume = this.audioPreferences.volume;
    this.activeAudio.add(audio);

    const release = (failed = false) => {
      if (failed) this.failedSounds.add(source);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      this.activeAudio.delete(audio);
    };

    audio.addEventListener('ended', () => release(false), { once: true });
    audio.addEventListener('error', () => release(true), { once: true });
    audio.play().catch(() => release(false));
  }

  wakeAllBalls() {
    for (const body of Composite.allBodies(this.engine.world)) {
      if (!body.isGameBall || !body.isSleeping) continue;
      Body.set(body, 'isSleeping', false);
    }
  }

  finishGame(result) {
    if (this.isFinished) return;
    this.isFinished = true;
    this.canDrop = false;
    window.clearTimeout(this.dropTimer);
    Runner.stop(this.runner);

    const isWin = result === 'win';
    const finalHighestLevel = isWin ? 10 : this.highestLevel;

    // 通知后端
    this.wsClient?.sendGameOver(isWin, this.score, finalHighestLevel);

    this.root.querySelector('#overlay-kicker').textContent = isWin ? '第 10 级达成' : '猪头堆得太高啦';
    this.root.querySelector('#overlay-title').textContent = isWin ? '恭喜通关！' : '游戏结束';
    this.root.querySelector('#overlay-message').textContent = isWin
      ? '你成功合成了标准大猪头。'
      : '球体稳定超过警戒线 1.7 秒，本局结束。';
    this.root.querySelector('#final-score').textContent = String(this.score);
    this.root.querySelector('#result-best').textContent = this.score >= this.bestScore
      ? `历史最高分：${this.bestScore}`
      : `历史最高分：${this.bestScore}`;
    this.overlay.dataset.result = result;
    this.overlay.classList.remove('hidden');
  }

  destroy() {
    window.clearTimeout(this.dropTimer);
    this.resizeObserver?.disconnect();
    // stopAllAudio 已移除（移除所有音效）
    // this.stopAllAudio();

    if (this.canvasHost) {
      this.canvasHost.removeEventListener('pointermove', this.onPointerMove);
      this.canvasHost.removeEventListener('pointerdown', this.onPointerDown);
      this.canvasHost.removeEventListener('pointerup', this.onPointerUp);
      this.canvasHost.removeEventListener('pointercancel', this.onPointerCancel);
    }

    if (this.render) {
      Render.stop(this.render);
      this.render.canvas.remove();
      this.render.textures = {};
    }
    if (this.runner) Runner.stop(this.runner);
    if (this.engine) {
      Events.off(this.engine);
      Composite.clear(this.engine.world, false);
      Engine.clear(this.engine);
    }
  }
}

function wallOptions() {
  return {
    isStatic: true,
    friction: 0.18,
    render: { visible: false },
  };
}

function drawCoverImage(context, image, radius) {
  const size = radius * 2;
  const scale = Math.max(size / image.naturalWidth, size / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  context.drawImage(image, -width / 2, -height / 2, width, height);
}

function lighten(hex, amount) {
  const value = Number.parseInt(hex.slice(1), 16);
  const red = Math.min(255, (value >> 16) + Math.round(255 * amount));
  const green = Math.min(255, ((value >> 8) & 255) + Math.round(255 * amount));
  const blue = Math.min(255, (value & 255) + Math.round(255 * amount));
  return `rgb(${red}, ${green}, ${blue})`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
