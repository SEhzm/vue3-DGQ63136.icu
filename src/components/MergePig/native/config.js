export const LEVEL_COUNT = 10;
export const AUDIO_PREFERENCES_KEY = 'merge-big-milk-frog-audio-v1';
export const BEST_SCORE_KEY = 'merge-big-milk-frog-best-score-v1';

// 资源基础路径：作为 frontend 子项目部署时为 /merge-pig/，独立部署时为 /
const BASE_URL = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : import.meta.env.BASE_URL + '/';
const ASSET_BASE = `${BASE_URL}merge-pig/`;

const COLORS = [
  '#fff1a8',
  '#f9df7b',
  '#d9ed92',
  '#b5e48c',
  '#99d98c',
  '#76c893',
  '#52b788',
  '#40916c',
  '#2d6a4f',
  '#1b4332',
];

export const LEVELS = Array.from({ length: LEVEL_COUNT }, (_, index) => ({
  index,
  label: String(index + 1),
  color: COLORS[index],
  image: `${ASSET_BASE}assets/balls/level-${index + 1}.png`,
}));

export const MERGE_SOUND_POOL = [5, 6, 7, 8, 9, 10].map(
  (level) => `${ASSET_BASE}assets/sounds/level-${level}.mp3`
);

export const WIN_SOUND = `${ASSET_BASE}assets/sounds/level-10.mp3`;

const SPAWN_TABLE = [
  { level: 0, cumulative: 0.4 },
  { level: 1, cumulative: 0.7 },
  { level: 2, cumulative: 0.9 },
  { level: 3, cumulative: 1 },
];

export function randomSpawnLevel() {
  const value = Math.random();
  return SPAWN_TABLE.find((item) => value < item.cumulative)?.level ?? 0;
}

export function getRadius(level) {
  const minRadius = 25;
  const maxRadius = 90;
  const ratio = level / (LEVEL_COUNT - 1);
  return Math.round(minRadius + (maxRadius - minRadius) * ratio);
}

export function getMergeScore(level) {
  return 2 ** level;
}

export function loadBestScore() {
  try {
    const value = Number(localStorage.getItem(BEST_SCORE_KEY));
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
  } catch {
    return 0;
  }
}

export function saveBestScore(score) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(Math.max(0, Math.floor(score))));
  } catch {
    // 浏览器禁用本地存储时，最高分仅在当前页面内有效。
  }
}

export function loadAudioPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(AUDIO_PREFERENCES_KEY) || '{}');
    const volume = Number(saved.volume);
    return {
      enabled: saved.enabled !== false,
      volume: Number.isFinite(volume) ? clamp(volume, 0, 1) : 0.7,
    };
  } catch {
    return { enabled: true, volume: 0.7 };
  }
}

export function saveAudioPreferences(preferences) {
  try {
    localStorage.setItem(AUDIO_PREFERENCES_KEY, JSON.stringify({
      enabled: preferences.enabled !== false,
      volume: clamp(Number(preferences.volume), 0, 1),
    }));
  } catch {
    // 浏览器禁用本地存储时，偏好仍在当前页面内生效。
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
