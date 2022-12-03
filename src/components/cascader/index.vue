<template>
  <div v-close="close">
    <div class="top">
      <input @input="change" :value="textValue" />
      <button class="btn" @click="pull">{{ Icon }}</button>
    </div>

    <seletBoxVue v-for="(item, key) in propData" :propData="item" :index="key" v-model:show="tabShow" @getData="getData"
      ref="selectBox" />

    <div class="select" @click="cover(match)" v-show="matchBoxShow">
      <span v-for="i in match">{{ i.ad_name }}</span>
    </div>

    <div class="select" v-show="matchNameBoxShow" v-for="item in matchName" @click="cover(item)">
      <span v-for="i in item">
        {{ i.ad_name }} /
      </span>
    </div>

  </div>
</template>
<script lang="ts" setup>
import { ref, type Ref, computed, watch, toRefs, } from 'vue';

import type { Idata_tree } from '@/types/Idata';
// 子组件
import seletBoxVue from './child/seletBox.vue';
// hooks
import { Search } from './hooks/search'
import { getDataByName } from '@/network/getDataByName';

const props = defineProps(['keyword'])
const emit = defineEmits(['update:keyword'])
const { keyword } = toRefs(props);

const textValue: Ref<string[]> = ref([])
// 接收数据 传给子组件进行遍历
const propData: Ref<Idata_tree[][]> = ref([])

getDataByName().then(res => {
  propData.value.push(res)
})


const change = (e: Event) => {
  (textValue.value as unknown) = ((<HTMLInputElement>e.target).value)
  emit('update:keyword', (<HTMLInputElement>e.target).value)
}
const close = () => {
  tabShow.value = false
}

// 点击每一项选项触发
const getData = async (itemChildren: Idata_tree, index: Ref<number>,) => {
  if (propData.value[index.value + 1]) {
    propData.value.splice(index.value + 1)
  }
  if (textValue.value[index.value]) {
    textValue.value.splice(index.value)
  }
  const childList = await getDataByName(itemChildren.ad_name) as Idata_tree[] | undefined
  childList && propData.value.push(childList)
  textValue.value.push(itemChildren.ad_name)
}
// 控制选择栏显影
const tabShow = ref(false)
const pull = () => {
  tabShow.value = !tabShow.value
}
const Icon = computed(() => !tabShow.value ? '👆' : '👇')
const selectBox = ref()


// *****搜索相关 变量 与 方法 
const { search, deep } = Search()
// 通过adcode匹配到的地区名称
const match: Ref<Idata_tree[]> = ref([])
const matchBoxShow = computed(() => !tabShow.value && match.value.length)
const clearMatch = () => {
  match.value = []
}
// 模糊搜索
const matchName: Ref<Idata_tree[][]> = ref([])
const matchNameBoxShow = computed(() => !tabShow.value && matchName.value.length)
const clearMatchName = () => {
  matchName.value = []
}
// *****
// 选择框
const cover = (item?: Idata_tree[]) => {
  textValue.value = item?.map(c => c.ad_name) as string[]
  clearMatch()
  clearMatchName()
}
watch(keyword as Ref, (n) => {
  clearMatch()
  clearMatchName()
  tabShow.value = false
  if (Number(n)) {
    const resArr = deep((n as string))
    resArr && resArr.map(item => {
      match.value.push(item)
    })
  }
  // 为了控制 输入框为空时，清空所有选项卡
  if (n === '') {
    textValue.value = []
  }
  // 模糊搜索
  if (typeof n === 'string' && n !== '') {
    const resArr = search(n)
    resArr.map(item => {
      matchName.value.push(item)
    })
  }
})

</script>
<style lang="less" scoped>
.top {
  display: flex;

  input {
    border: 1px solid #dcdfe6;
    height: 30px;
    border-radius: 10px 0 0 10px;
    border-right: 0;
    outline: none;
    color: #606266;
  }

  button {
    border: 0;
    background-color: white;
    border: 1px solid #dcdfe6;
    border-left: 0;
    border-radius: 0 10px 10px 0;
  }
}

.select {
  // width: 200px;
  height: 40px;
  width: 200px;
  background-color: #ffffff;
  white-space: nowrap;
  box-shadow: 10px 10px 8px #f6f6f6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  margin-top: 5px;
  overflow-x: scroll;
  user-select: none;
  color: #60627e;
  font-size: 14px;

  span {
    margin-left: 5px;
  }
}
</style>