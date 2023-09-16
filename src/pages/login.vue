<script setup>
// 使用全局配置
import {useStore} from "@/store";

const store = useStore();

// 调用父组件(App.vue)的changePage(newPage)函数来切换页面
const emit = defineEmits(['changePage'])
const changePage = (newPage) => {
  emit('changePage', newPage)
}

const User =
    {
      Zzy: {
        Name: 'Zzy',
        Token: '7fdaa624-4cd4-4391-bc3f-e471d0dc0bbe',
        McName: 'Zzy'
      },
      Pkx: {
        Name: 'Amiya',
        Token: '6ff9dd8c-dcbf-414f-8a02-6c693de20b7e',
        McName: 'mcAmiya'
      },
      Ljy: {
        Name: 'Ljy',
        Token: 'c47436b5-548e-4bf4-b992-2ac3d0bf42dd',
        McName: 'Ljy'
      }
    }

const params = new URLSearchParams(window.location.search)
const customUserToken = params.get('token')
let customUserName = params.get('name')

if (customUserName == null) {
  customUserName = 'CustomUser'
}
if (customUserToken) {
  store.setUserData({Name: customUserName, Token: customUserToken})
  changePage('tasklist')
}

</script>

<template>
  <a-row
      :gutter="16"
  >
    <a-col
        :span="8"
        v-for="Member in User"
    >
      <a-card
          @click="store.setUserData(Member);changePage('tasklist')"
          hoverable
      >
        <template #cover>
          <img alt="example" :src='`https://mineskin.eu/helm/${Member.McName}`'/>
        </template>
        <a-card-meta
            :title="Member['Name']"
        >
          <template #description>欢迎使用</template>
        </a-card-meta>
      </a-card>
    </a-col>
  </a-row>
</template>

<style scoped>

</style>