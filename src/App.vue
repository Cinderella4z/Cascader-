<template>

  <Cascader :load="load" v-model:value="value" />

</template>
<script lang="ts" setup>
import { ref, type Ref } from 'vue';
import { getDataByName } from '@/network/getDataByName';

const value = ref('')
//方法
// const options: Ref<Idata_tree[][]> = ref([])
// getDataByName().then(res => {
//   options.value = [res]
// })

async function load(name?: string) {
  const res = await getDataByName(name)
  return res
}

</script>
