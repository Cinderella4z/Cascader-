<template>

  <Cascader :load="load" v-model:value="value" />

</template>
<script lang="ts" setup>
import { ref, type Ref } from 'vue';
import { getDataByName } from '@/network/getDataByName';

//动态绑定adcode
const value = ref('')
// 加载函数
async function load(name?: string) {
  const res = await getDataByName(name)
  return res
}
</script>
