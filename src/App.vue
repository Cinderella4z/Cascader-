<template>
  <!--  
 * load ：加载源数据函数
 * value：绑定点击元素
-->
  <Cascader :loadFn="loadFn" v-model:value="value" />

</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { getDataByName } from '@/network/getDataByName';

//动态绑定adcode
const value = ref('')
// 加载函数
async function loadFn(name?: string) {
  const res = await getDataByName(name)
  return res
}
</script>
