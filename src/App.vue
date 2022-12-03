<template>

  <Cascader v-model:keyword="keyword" />

</template>
<script lang="ts" setup>
import { ref } from 'vue';

//方法
const keyword = ref('34')


</script>
