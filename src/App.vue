<template>
  <!--  
 * load ：加载源数据函数
 * value：绑定点击元素
 * showAllLevels：控制是否选择所有路径 或 只显示最后一级 
-->
  <Cascader :load="load" v-model:value="value" :show-all-levels="true" />

</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { getDataByName } from '@/network/getDataByName';

//动态绑定adcode
const value = ref('')
// 加载函数
async function load(name?: string) {
  const res = await getDataByName(name)
  return res
}
</script>
