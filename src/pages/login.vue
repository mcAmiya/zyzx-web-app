<script setup>

import {useRoute, useRouter} from "vue-router";

let router = useRouter()
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

const customUserToken = useRoute().query.token
let customUserName = useRoute().query.name
if (customUserName == null) {
  customUserName = 'CustomUser'
}
if (customUserToken) {
  router.push({
    name: 'tasklist',
    state: {UserArray: {Name: customUserName, Token: customUserToken}}
  })
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
          @click="router.push({name:'tasklist', state:{UserArray:Member}})"
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