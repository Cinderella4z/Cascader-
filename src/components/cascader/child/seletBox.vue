<template>

  <div class="box" v-show="show">
    <div v-for="(c, k) in propData" class="item" :key="c.id" @click="itemClick(c, k)"
      :class="{ 'active': k === active }">
      <input class="input" :name="'1'" type="radio" @click="getData(c, k)">
      {{ c.ad_name }}
    </div>
  </div>


</template>
<script lang="ts" setup>
import type { Idata_tree } from '@/types/Idata';
import { ref, toRefs, type Ref, } from 'vue';
const props = defineProps(['index', 'propData', 'show',])
const { propData, index, show } = toRefs(props)
const active = ref(-1)
const box = ref()
const emit = defineEmits(['getData', 'getAdcode'])
const getData = (i: Idata_tree, k: number) => {
  emit('getData', i, index)
  emit('getAdcode', i.id)
}
const itemClick = (c: Idata_tree, k: number) => {
  emit('getData', c, index)
  active.value = k
}
const setActive = () => {
  active.value = -1
}
defineExpose([setActive])

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
    // color: #60627e;
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

.chooseItem {
  color: #409eff;
  font-weight: bolder;
}

.active {
  color: #409eff;
  font-weight: bolder;
}
</style>