<template>

  <Cascader v-model:value="value" :props="props" @change="change" />

</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { getDataByName } from '@/network/getDataByName';
import { arrTotree } from './libs';
import { Search } from '@/components/cascader/hooks/search';
import data from './assets/data.json'
import type { Idata_tree } from './types/Idata';

const dbData = arrTotree(data)

/* description: 带搜索的地区级联选择器
* props: 组件属性
* props.value 选中地区的值 V - model 绑定对象
* props.useAsync { boolean } 是否异步获取数据，默认是false
* props.data { array } 备选列表数据(tree)。当useAsync为false时候必传
* props.loadFn[(currentNode, resolve) => void - 远程获取树列表数据，USeAsunc rue时候以传 
* props.searchFn[(keywords, resolve) => Void} 远程搜索函数，当 useAsync true 时候必传 
* proDs.checkstrictLu ooLeD) 是否严格的进守父子节点不互相关联 就认为ture, true 时候可以选中任何 - 节点，faLse 时候 只能选中最后一级的节点
* events: 组件事件
* change 改变选中值触发事件，回调参数为选中的节点
*/
const props = {
  useAsync: true,
  loadFn: handleLoadData,
  searchFn: searchFn,
  checkStrictly: false,
  dataArr: [dbData]
}
const change = (item: Idata_tree) => {
  console.log(item);
  console.log(value.value);
  
}

//动态绑定adcode
const value = ref('')
// 加载函数
async function handleLoadData(resolve: Function, name?: string) {
  const res = await getDataByName(name)
  resolve(res)
}
async function searchFn(keyword: string, resolve: Function) {
  const { search } = Search()
  new Promise((res) => {
    setTimeout(() => {
      const searchResult = search(keyword)
      res(searchResult)
    }, 100);
  }).then(res => {
    resolve(res)
  })
}
</script>
