<template>
    <MobileHeader v-if="isMobile" />
    <DesktopHeader v-else />
</template>

<script setup lang="ts">
import { useIsMobile } from '@/composables/useIsMobile';
import DesktopHeader from './components/desktop-header.vue';
import MobileHeader from './components/mobile-header.vue';

const isMobile = useIsMobile();
</script>
