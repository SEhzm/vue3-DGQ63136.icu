<template>
    <!-- <div class="maintenance">
        <div>
            <p>dgq63136.icu 已永久迁移至 <a href="https://dgq63136.cn">dgq63136.cn</a><br>
               请注意修改收藏夹
            </p>
        </div>
    </div> -->
    <RouterView/>
      <StarrySky/>

</template>
<script setup lang="ts">

</script>
<style scoped lang="scss">
	@media (min-width: 601px) {
    .maintenance {
        backdrop-filter: blur(16px);
        z-index: 999999;
        width: 100vw;
        height: 100vh;
        position: fixed;
        p {
            margin-top: 300px;
            text-align: center;
            color: red;
            font-size: 100px;
        }
    }
}
@media (max-width: 600px) {

.maintenance {
    backdrop-filter: blur(16px);
    z-index: 999999;
    width: 100vw;
    height: 100vh;
    position: fixed;
    p {
        margin-top: 300px;
        text-align: center;
        background-color: white;
        color: red;
        font-size: 50px;
    }
}
}
.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: transparent;
  border: none;
}

</style>