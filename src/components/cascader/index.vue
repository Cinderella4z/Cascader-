<template>
  <div>
    <div class="top">
      <input v-model="keyword" />
      <button class="btn" @click="pull" v-if="!tabShow">👇</button>
      <button class="btn" @click="pull" v-else>👆</button>
    </div>

    <seletBoxVue :propData="propData" @getData="getData" :show="tabShow" :clickItemIndex="clickItemIndex" />

    <div class="select" @click="cover()" v-show="matchBoxShow">
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
import { ref, reactive, type Ref, computed, watch, ReactiveEffect, toRefs, } from 'vue';

import { arrTotree, debounce } from '@/libs/index'
import type { Idata_tree } from '@/types/Idata';
// 组件
import seletBoxVue from './components/content/seletBox.vue';
// hooks
import { Search } from '../../libs/hooks/search'
// 后端json格式转tree格式
const props = defineProps(['data'])
const { data } = toRefs(props);
const _data = computed(() => data?.value)
const tree: Idata_tree[] = arrTotree(_data.value)

// 后端数据传给子组件渲染
const propData: Ref<Idata_tree[][]> = ref([tree])

// 绑定input
const keyword: Ref<string[] | string> = ref([])

// 保存选择的区
const tempInputText: Ref<string[]> = ref([])

const clickItemIndex: Ref<number> = ref(0)
// 点击每一项选项触发
const getData = (itemChildren: Idata_tree[], index: number, item: Idata_tree) => {
  clickItemIndex.value = index

  if (propData.value[index + 1]) {
    propData.value = propData.value.slice(0, index + 1)
  }
  propData.value.push(itemChildren)

  if (tempInputText.value[index]) {
    tempInputText.value = tempInputText.value.slice(0, index)
  }
  tempInputText.value.push(item.ad_name)
  // 如果没子类 说明到达最后一层 选择完之后直接赋值给input
  if (!item.children) {
    keyword.value = tempInputText.value
  }

}
// 控制选择栏显影
const tabShow = ref(false)
const pull = () => {
  tabShow.value = !tabShow.value
  match.value = []
}

const { search, deep } = Search()
// 通过adcode匹配到的地区名称
const match: Ref<Idata_tree[]> = ref([])
const matchBoxShow = computed(() => match.value.length)
// 模糊搜索
const matchName: Ref<Idata_tree[][]> = ref([])
const matchNameBoxShow = computed(() => matchName.value.length)

// 这些方法为了选择完之后 把框框清空 并且不显示
const clearPropData = () => {
  propData.value = [tree]
}
const clearMatch = () => {
  match.value = []
}
const clearMatchName = () => {
  matchName.value = []
}
// 选择框
const cover = (item?: Idata_tree[]) => {

  if (item) {
    keyword.value = item.map(item => item.ad_name)
    clearPropData()
    clearMatchName()

  } else {
    keyword.value = match.value.map(item => item.ad_name)
    clearPropData()
    clearMatch()
  }
}


watch(keyword, (n) => {
  // 防抖处理
  // debounce(() => {
  if (Number(n)) {
    const resArr = deep((n as string), tree)
    clearMatch()
    resArr && resArr.map(item => {
      match.value.push(item)
    })
  }
  // 为了控制 输入框为空时，清空所有选项卡
  if (n === '') {
    tabShow.value = false
    clearPropData()
    clearMatch()
    clearMatchName()
  }
  // 模糊搜索
  if (typeof n === 'string' && n !== '') {
    const resArr = search(n, tree)
    clearMatchName()
    resArr.map(item => {
      matchName.value.push(item)
    })
  }

  // }, 500)()


})

</script>
<style lang="less" scoped>
.top {

  input {
    border: 2px solid #f0f0f0;
    height: 100%;
    border-right: 0;
    outline: none;
  }

  button {
    border: 0;
    height: 100%;
    background-color: white;
    border: 2px solid #f0f0f0;
    border-left: 0;
    color: #a3a3a3;
  }
}

.select {
  // width: 200px;
  height: 40px;
  background-color: #ffffff;
  white-space: nowrap;
  box-shadow: 0px 0px 5px #888888;
  display: flex;
  align-items: center;
  margin-top: 5px;
  overflow-x: scroll;
}
</style>