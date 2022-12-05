<template>
  <div v-close="close">
    <div class="top">
      <input v-model="textValue" />
      <button class="btn" @click="pull">{{ Icon }}</button>
    </div>

    <seletBoxVue v-for="(item, key) in options" :propData="item" :index="key" :show="tabShow" @getData="getData"
      @getAdcode="getAdcode" />

    <div class="select" v-show="matchNameBoxShow" v-for="item in matchName" @click="cover(item)">
      <span v-for="i in item">
        {{ i.ad_name }} /
      </span>
    </div>

  </div>
</template>
<script lang="ts" setup>
import { ref, type Ref, computed, watch, toRefs, } from 'vue';
import dbData from '@/assets/data.json'
import type { Idata_tree } from '@/types/Idata';
// 子组件
import seletBoxVue from './child/seletBox.vue';
// hooks
import { Search } from './hooks/search'
import { arrTotree } from '@/libs';

const props = defineProps(['load', 'value'])
const emit = defineEmits(['update:value'])
const { load, value } = toRefs(props);
const textValue: Ref<string[] | string> = ref([])
// 接收数据 传给子组件进行遍历
const options: Ref<Idata_tree[][]> = ref([])
load?.value().then((res: Idata_tree[]) => {
  options.value.push(res)
})
const getAdcode = (adcode: string) => {
  emit('update:value', adcode)
}
const close = () => {
  tabShow.value = false
}
// 点击每一项选项触发
const getData = async (itemChildren: Idata_tree, index: Ref<number>,) => {
  const childList = await load?.value(itemChildren.ad_name)
  if (options.value[index.value + 1]) {
    options.value.splice(index.value + 1)
  }
  childList && options.value.push(childList);
}
// 控制选择栏显影
const tabShow = ref(false)
const pull = () => {
  tabShow.value = !tabShow.value
}
const Icon = computed(() => !tabShow.value ? '👆' : '👇')
// *****搜索相关 变量 与 方法 
const { search, deep } = Search()
// 模糊搜索
const matchName: Ref<Idata_tree[][]> = ref([])
const matchNameBoxShow = computed(() => !tabShow.value && matchName.value.length)
// *****
// 选择框
const cover = (item?: Idata_tree[]) => {
  textValue.value = item?.map(c => c.ad_name) as string[]
  matchName.value = []
}
watch(textValue, (n) => {
  matchName.value = []
  tabShow.value = false
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
watch((value as Ref), (n) => {
  if (n !== '') {
    const db = arrTotree(dbData)
    const searchRes = deep(n, db)
    cover(searchRes)
  }
}, { immediate: true })

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