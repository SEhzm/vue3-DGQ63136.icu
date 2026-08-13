<template>
  <el-dropdown trigger="click" class="theme-dropdown" @command="handleCommand">
    <button class="theme-dropdown-trigger" type="button">
      <el-icon :size="18"><component :is="currentIcon" /></el-icon>
      <span class="theme-label">{{ currentLabel }}</span>
      <el-icon class="arrow-icon"><ArrowDown /></el-icon>
    </button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :command="opt" v-for="opt in options" :key="opt.mode">
          <el-icon class="menu-icon"><component :is="opt.icon" /></el-icon>
          <span>{{ opt.label }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Sunny, Moon, Monitor, ArrowDown } from '@element-plus/icons-vue'
import { useThemeStore, type ThemeMode } from '@/stores/themeStore'

const theme = useThemeStore()

interface Option {
  mode: ThemeMode
  label: string
  icon: typeof Sunny
}

const options: Option[] = [
  { mode: 'light', label: '浅色模式', icon: Sunny },
  { mode: 'dark', label: '深色模式', icon: Moon },
  { mode: 'system', label: '跟随系统', icon: Monitor }
]

const currentOpt = computed(() => options.find(o => o.mode === theme.mode) || options[2])

const currentLabel = computed(() => currentOpt.value.label)
const currentIcon = computed(() => currentOpt.value.icon)

function handleCommand(cmd: { mode: ThemeMode; label: string; icon: typeof Sunny }) {
  theme.setMode(cmd.mode)
}
</script>

<style scoped lang="scss">
.theme-dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px solid var(--el-border-color-light, #e4e7ed);
  border-radius: 6px;
  background: var(--card-bg, #fff);
  color: var(--body-color, #333);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;

  &:hover {
    border-color: var(--el-color-primary, #11A983);
    background: var(--el-fill-color-light, #f5f7fa);
  }

  .arrow-icon {
    font-size: 12px;
    transition: transform 0.2s;
  }
}

:deep(.el-dropdown-menu) {
  min-width: 140px;
  padding: 4px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

  .el-dropdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    color: var(--body-color, #333);
    transition: background 0.15s;

    .menu-icon {
      font-size: 14px;
      color: var(--el-text-color-secondary, #909399);
    }

    &:hover {
      background: var(--el-fill-color-light, #f5f7fa);
    }

    &.is-active {
      background: var(--el-color-primary-light-9, rgba(17, 169, 131, 0.1));
      color: var(--el-color-primary, #11A983);
    }
  }
}
</style>