<script setup>

// 导入各个页面
import login from '@/pages/login.vue'
import tasklist from "@/pages/tasklist.vue";

// 默认页面
const page = ref('login')
// 页面数
const pages = {
  login,
  tasklist
}

// 切换页面
const changePage = (newPage) => {
  console.log(`[changePage]切换页面至：${newPage}`)
  page.value = newPage.toString()
}
</script>

<!-- 页面 -->
<template>
  <component :is="pages[page]" @changePage="changePage"/>
</template>
<style scoped>
</style>
