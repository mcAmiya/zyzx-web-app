<script setup>
import axios from 'axios'
import {Base64} from "js-base64";

// url host
// 旧版本
// const urlHost = 'https://zyzx-s.zy.com'
// 新版本
const urlHost = 'https://zxx.zy.com/zxx'

// 使用全局配置
import {useStore} from "@/store";

const store = useStore();
const User = store.UserData;

// 调用父组件(App.vue)的changePage(newPage)函数来切换页面
const emit = defineEmits(['changePage'])
const changePage = (newPage) => {
  emit('changePage', newPage)
}

function xorEncryptDecrypt(text, key) {
  // 对文本进行异或加解密
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

function downloadFile(fileName, saveName) {
  // 下载操作
  if (fileName) {
    fileName = fileName.replace(Base64.decode(xorEncryptDecrypt(Base64.decode('GzEoSE4/KFRhGEkcICE3DHcaCRF3MkVGHypPEk9FVRQ='), Base64.decode(xorEncryptDecrypt(Base64.decode('PzlZRSsuZ3cXAwcVD2guRw=='), 'ZW5sNmVDMTNaV0l0WVhCdw==')))), "")
    // 下载文件
    if (!saveName) {
      saveName = fileName
    }
    axios({
      url: `${Base64.decode(xorEncryptDecrypt(Base64.decode('GzEoSE4/KFRhGEkcICE3DGAjLFNgCxdDNAMRAGMOUA9MNggcNhRLTU4gKxFPUiYbNhQ0Dk8kXV8='), Base64.decode(xorEncryptDecrypt(Base64.decode('PzlZRSsuZ3cXAwcVD2guRw=='), 'ZW5sNmVDMTNaV0l0WVhCdw=='))))}${fileName}`,
      method: 'GET',
      responseType: 'blob', // important
    })
        .then(response => {
          // 创建用于下载的元素
          const FileBlob = new Blob([response.data]);
          const FileURL = URL.createObjectURL(FileBlob);
          const downloadLink = document.createElement('a');
          downloadLink.href = FileURL;
          downloadLink.download = `${saveName}`;
          downloadLink.click();
          URL.revokeObjectURL(FileURL);
          return true
        })
        .catch(error => {
          // 处理错误
          console.error(error)
        })
  }
  return false

}

// 输出用户信息
console.log(`当前用户: ${User['Name']}\nToken: ${User['Token']}`);

function getExamUrl(
    pageNo = 1,
    pageSize = 10,
    finished = false,
    access_token = ""
) {
  return `${urlHost}/api/1/aipt/get_tasks?\
pageNo=${pageNo}\
&pageSize=${pageSize}\
&finished=${finished}\
&access_token=${access_token}`;
}

async function getJson(url) {
  return await axios
      .get(url)
      .then((result) => {
        const json_str = JSON.stringify(result.data);
        return JSON.parse(json_str);
      })
      .catch(function (error) {
        console.log(error);
      });
}

// 定义基础信息
const undone_total = ref(0)
const done_total = ref(0)
const like_total = ref(0)

const undone_data = ref()
const done_data = ref()
const like_data = ref()

const got_undone_data = ref(true)
const got_done_data = ref(true)
const got_like_data = ref(true)

const pages = ref(1)
const current = ref(1)

const undone_page_size = ref(50)
const done_page_size = ref(50)
const like_page_size = ref(50)

// 未完成
const getUndoneTaskList = async (pageNo, page_size = 50) => {
  await getJson(getExamUrl(pageNo, page_size, false, User['Token'])).then((json) => {
    undone_data.value = json
    undone_total.value = undone_data.value['data']['total']
    pages.value = undone_data.value['data']['pages']
    got_undone_data.value = false

  });
}

// 已完成
const getDoneTaskList = async (pageNo, page_size = 50) => {
  await getJson(getExamUrl(pageNo, page_size, true, User['Token'])).then((json) => {
    done_data.value = json
    done_total.value = done_data.value['data']['total']
    pages.value = done_data.value['data']['pages']
    got_done_data.value = false
  });
}
const getLikeTaskList = async (pageNo, page_size) => {
// 我的收藏
  await getJson(`${urlHost}/api/1/aipt/get_like_tasks?pageNo=${pageNo}\&pageSize=${page_size}\&access_token=${User['Token']}`).then((json) => {
    like_data.value = json
    like_total.value = like_data.value['data']['total']
    pages.value = like_data.value['data']['pages']
    got_like_data.value = false
  });
}
getLikeTaskList(current.value, undone_page_size.value)
getDoneTaskList(current.value, done_page_size.value)
getUndoneTaskList(current.value, like_page_size.value)


const onChange = (pageNumber, page_size, page) => {
  console.log('Page: ', pageNumber);
  if (page === 'undone') {
    getUndoneTaskList(pageNumber, page_size)
  } else if (page === 'done') {
    getDoneTaskList(pageNumber, page_size)
  } else if (page === 'like') {
    getLikeTaskList(pageNumber, page_size)
  }


};

function open(url, target) {
  // 打开新网页
  window.open(url, target)
}
</script>

<template>
  <div id='MainPage' class="container mt-3">
    <h2>{{ User.Name }}の任务列表 <span class="badge bg-secondary">内测2</span></h2>
    <!-- <br> -->
    <div class="row">
      <!-- <br> -->
      <!-- 返回主页 -->
      <button type="button" class="btn btn-outline-primary mb-1" style="float: right"
              @click="changePage('login')">
        返回主页
      </button>
      <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item" @click="onChange(current,undone_page_size,'undone')">
          <a class="nav-link active" data-bs-toggle="tab" href="#undone">未完成
            <a-badge :count='undone_total' :overflow-count="999999999"/>
          </a>
        </li>
        <li class="nav-item" @click="onChange(current,done_page_size,'done')">
          <a class="nav-link" data-bs-toggle="tab" href="#done">已完成
            <a-badge :count='done_total' :overflow-count="999999999"/>
          </a>
        </li>
        <li class="nav-item" @click="onChange(current,like_page_size,'like')">
          <a class="nav-link" data-bs-toggle="tab" href="#like">我的收藏
            <a-badge :count='like_total' :overflow-count="999999999"/>
          </a>
        </li>
      </ul>
    </div>
    <!-- Tab panes -->
    <div class="tab-content">
      <!-- 未完成页面 -->
      <div id="undone" class="container tab-pane fade show active">
        <br>
        <!-- 手风琴特效 -->
        <div id="Undone_list">
          <!--          第一个是行宽，第二个是列宽-->
          <a-row :gutter="[16,16]">
            <a-col v-for="item in undone_data.data.list" :span="24">
              <a-badge-ribbon :text="item['subject_name']" color="">
                <a-card
                    hoverable
                    :loading="got_undone_data"
                    @click="open(item['resource_list'][0]['resource_preview_url'],'_blank')"
                >
                  <template #title>
                    <span class="badge bg-danger" style="float: left" v-if="item['is_new'] === true">新</span>
                    {{ item['task_name'] }}
                  </template>

                  <!--                  {{ item }}-->
                  <!--截止时间-->
                  <p v-if="item['deadline'] !== null">截止时间：{{ item['publish_time'] }} --> {{ item['deadline'] }}</p>
                  <p v-else>发布时间：{{ item['publish_time'] }}</p>
                  <!--教师叮嘱-->
                  <span v-if='item["remarks"] !== ""'>{{ item["remarks"] }}</span>

                  <!--资料下载-->
                  <template v-for="resource in item['resource_list']">
                    <a-card
                        hoverable
                        :loading="got_undone_data"
                        v-if="resource['attachment_url'] != null"
                        @click.stop="open(resource['resource_preview_url'], '_blank');"
                    >

                      {{ resource['resource_name'] }}
                      <a-button @click.stop="downloadFile(resource['attachment_url'],resource['resource_name'])">下载
                      </a-button>
                    </a-card>
                  </template>
                  <a-divider/>
                  <div>
                    <span class="badge bg-secondary">{{ item['res_type_name'] }}</span>
                    &nbsp;
                    <span class="badge bg-secondary">{{ item['exercise_type_name'] }}</span>
                  </div>
                </a-card>

              </a-badge-ribbon>
            </a-col>
          </a-row>
        </div>
        <a-pagination v-model:current="current" v-model:page-size="undone_page_size" show-quick-jumper
                      :total="undone_total"
                      @change="onChange(current,undone_page_size,'undone')"/>
      </div>

      <!--       已完成页面-->
      <div id="done" class="container tab-pane fade">
        <br>
        <!-- 手风琴特效 -->
        <div id="Undone_list">
          <!--          第一个是行宽，第二个是列宽-->
          <a-row :gutter="[16,16]">
            <a-col v-for="item in done_data.data.list" :span="24">
              <a-badge-ribbon :text="item['subject_name']" color="">
                <a-card
                    hoverable
                    :loading="got_done_data"
                    @click="open(item['resource_list'][0]['resource_preview_url'],'_blank')"

                >
                  <template #title>
                    {{ item['task_name'] }}
                  </template>

                  <!--                  {{ item }}-->
                  <!--完成作业时间-->
                  <p v-if="item['finish_time'] !== null">完成时间：{{ item['publish_time'] }} --> {{
                      item['finish_time']
                    }}</p>
                  <!--教师叮嘱-->
                  <span v-if="item['remarks'] !== ''">{{ item['remarks'] }}</span>


                  <template v-for="resource in item['resource_list']">
                    <a-card
                        hoverable
                        :loading="got_done_data"
                        v-if="resource['attachment_url'] != null"
                        @click.stop="open(resource['resource_preview_url'], '_blank');"
                    >

                      {{ resource['resource_name'] }}
                      <a-button @click.stop="downloadFile(resource['attachment_url'],resource['resource_name'])">下载
                      </a-button>
                    </a-card>
                  </template>
                  <a-divider/>
                  <div>
                    <span class="badge bg-secondary">{{ item['res_type_name'] }}</span>
                    &nbsp;
                    <span class="badge bg-secondary">{{ item['exercise_type_name'] }}</span>
                  </div>
                </a-card>

              </a-badge-ribbon>
            </a-col>
          </a-row>
        </div>
        <a-pagination v-model:current="current" v-model:page-size="done_page_size" show-quick-jumper
                      :total="done_total"
                      @change="onChange(current,done_page_size,'done')"/>
      </div>

      <!-- 我的收藏页面 -->
      <div id="like" class="container tab-pane fade">
        <br>
        <!-- 手风琴特效 -->
        <div id="Undone_list">
          <!--          第一个是行宽，第二个是列宽-->
          <a-row :gutter="[16,16]">
            <a-col v-for="item in like_data.data.list" :span="24">
              <a-badge-ribbon :text="item['subject_name']" color="">
                <a-card
                    hoverable
                    :loading="got_like_data"
                    @click="open(item['resource_list'][0]['resource_preview_url'],'_blank')"

                >
                  <template #title>
                    {{ item['task_name'] }}
                  </template>

                  <!--完成作业时间-->
                  <p v-if="item['finish_time'] !== null">完成时间：{{ item['publish_time'] }} --> {{
                      item['finish_time']
                    }}</p>
                  <p v-else>发布时间：{{ item['publish_time'] }}</p>
                  <!--教师叮嘱-->
                  <span v-if="item['remarks'] !== null">{{ item['remarks'] }}</span>


                  <template v-for="resource in item['resource_list']">
                    <a-card
                        hoverable
                        :loading="got_like_data"
                        v-if="resource['attachment_url'] != null"
                        @click.stop="open(resource['resource_preview_url'], '_blank');"
                    >

                      {{ resource['resource_name'] }}
                      <a-button @click.stop="downloadFile(resource['attachment_url'],resource['resource_name'])">下载
                      </a-button>
                    </a-card>
                  </template>
                  <a-divider/>
                  <div>
                    <span class="badge bg-secondary">{{ item['res_type_name'] }}</span>
                    &nbsp;
                    <span class="badge bg-secondary">{{ item['exercise_type_name'] }}</span>
                  </div>
                </a-card>

              </a-badge-ribbon>
            </a-col>
          </a-row>
        </div>
        <a-pagination v-model:current="current" v-model:page-size="like_page_size" show-quick-jumper
                      :total="like_total"
                      @change="onChange(current, like_page_size,'like')"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>