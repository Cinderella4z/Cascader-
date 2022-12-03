<template>

  <div class="box" v-show="show">
    <div v-for="(c, k) in propData" class="item" :key="c.id" @click="itemClick(c, k)" ref="box">
      <input class="input" :name="index" :checked="ifChecked" type="radio" @click.stop="getData(c)">{{ c.ad_name }}
    </div>
  </div>


</template>
<script lang="ts" setup>
import type { Idata_tree } from '@/types/Idata';
import { computed, ref, toRefs, } from 'vue';
const box = ref()
const ifChecked = ref()
const props = defineProps(['index', 'propData', 'show',])
const { propData, index, show } = toRefs(props)

const emit = defineEmits(['getData', 'tabShow', 'update:show'])
const getData = (i: Idata_tree) => {
  emit('getData', i, index)
}
const itemClick = (c: Idata_tree[], k: number) => {
  box.value[k].children[0].checked = true
  emit('getData', c, index)
}


</script>
<style lang="less" scoped>
.box {
  width: 180px;
  height: 200px;
  background-color: #ffffff;
  display: inline-block;
  overflow-y: scroll;
  border-radius: 10px;
  // box-shadow: 0px 0px 0px 3px #f6f6f6;
  box-shadow: 10px 10px 8px #f6f6f6;
  margin: 10px 2px;

  .item {
    height: 30px;
    line-height: 30px;
    color: #60627e;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    user-select: none
  }

  div:hover {
    background-color: #f5f7fa;
  }

}
</style>