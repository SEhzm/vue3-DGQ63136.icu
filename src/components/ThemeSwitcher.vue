<template>
  <el-dropdown class="theme-dropdown-trigger" @command="handleCommand">
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="opt in options"
          :key="opt.mode"
          :command="opt.mode"
          class="theme-dropdown-item"
        >
          <el-icon class="menu-icon" :size="16"><component :is="opt.icon" /></el-icon>
          <span>{{ opt.label }}</span>
          <el-icon v-if="theme.mode === opt.mode" class="check-icon" size="14"></el-icon>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
    <el-icon class="theme-dropdown-icon" :class="{ 'mobile-light': isMobile && !theme.isDark }" :size="32">
      <component :is="currentIcon" />
    </el-icon>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Sunny, Moon, Monitor, Check } from '@element-plus/icons-vue'
import { useThemeStore, type ThemeMode } from '@/stores/themeStore'
import { useIsMobile } from '@/composables/useIsMobile'

const theme = useThemeStore()
const isMobile = useIsMobile()

interface Option {
  mode: ThemeMode
  label: string
  icon: typeof Sunny
}

const options: Option[] = [
  { mode: 'system', label: '跟随系统', icon: Monitor },
  { mode: 'light', label: '浅色模式', icon: Sunny },
  { mode: 'dark', label: '深色模式', icon: Moon }
]

const currentIcon = computed(() => {
  const opt = options.find(o => o.mode === theme.mode)
  return opt?.icon ?? Monitor
})

function handleCommand(mode: ThemeMode) {
  theme.setMode(mode)
}
</script>

<style scoped lang="scss">
.theme-dropdown-trigger {
  .theme-dropdown-icon {
    color: #fff;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }

  .mobile-light {
    color: #333;

    &:hover {
      background: rgba(128, 128, 128, 0.15);
    }
  }
}

.theme-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;

  .menu-icon {
    flex-shrink: 0;
    width: 20px;
    text-align: center;
  }

  .check-icon {
    margin-left: auto;
    color: var(--el-color-primary, #11A983);
  }
}
</style>
