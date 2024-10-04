<template>
  <a @click="navigateTo('/AnimalRandom')">
    <div class="aa">
      <img src="https://pic.imgdb.cn/item/66e3f20ed9c307b7e9a4a5a4.png"
           style="object-fit:cover;width: 394px;height: 250px;" alt="image.png">
      <el-button type="text" style="margin-left:80px;font-size: 20px">猛兽派对UNO八人座位随机</el-button>
    </div>
  </a>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";


const router = useRouter();
function navigateTo(path: string): void {
  router.push(path);
}

</script>

<style>
.aa {
  z-index: 1;
  width: 400px;
  height: 300px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, .1);
  padding: 3px;
  box-shadow: 0 0 4px rgba(0, 0, 0, .8);
  cursor:pointer
}
</style>