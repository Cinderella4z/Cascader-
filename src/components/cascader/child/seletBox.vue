<template>

  <div class="box" v-show="show">
    <div v-for="(areaItem, ind) in propData" class="item" :key="areaItem.id" @click="itemClick(areaItem, ind)">
      <input class="input" :name="index" type="radio" :checked="checkedIndex === ind">{{ areaItem.ad_name }}
    </div>
  </div>


</template>
<script lang="ts" setup>
import type { Idata_tree } from '@/types/Idata';
import { computed, ref, toRefs, } from 'vue';

const props = defineProps(['index', 'propData', 'show',])
const { propData, index, show } = toRefs(props)

let checkedIndex = ref(-1)

const emit = defineEmits(['getData', 'tabShow', 'update:show'])

const itemClick = (areaItem: Idata_tree[], ind: number) => {
  checkedIndex.value = ind
  emit('getData', areaItem, index)
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