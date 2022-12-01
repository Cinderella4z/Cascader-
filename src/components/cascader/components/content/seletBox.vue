<template>

  <div v-if="propData">
    <seletBox v-for="(i, k) in propData" :index="k" :show="show" :itemChild="i" :key="k" @getData="pushData"
      :clickItemIndex="clickItemIndex" />
  </div>

  <div class="box" v-if="itemChild" v-show="show" ref="box">
    <div v-for="c in itemChild">
      <input class="input" :name="index" type="radio" @click="getData(c, index)">{{ c.ad_name }}
    </div>
  </div>


</template>
<script lang="ts" setup>
import type { Idata, Idata_tree } from '@/types/Idata';
import { ref, reactive, toRefs, watch, computed, onMounted, type Ref, } from 'vue';
const box = ref()
// index控制单选
const props = defineProps(['index', 'propData', 'show', 'itemChild', 'clickItemIndex'])
const { propData, index, show, itemChild, clickItemIndex } = toRefs(props)

// 监听是否选中，选中则添加一个seletBox
const emit = defineEmits(['getData', 'tabShow'])
// 模拟获取数据
const getData = (i: Idata_tree, index: number) => {
  new Promise((res) => {
    setTimeout(() => {
      res(i.children)
    }, 200);
  }).then(res => {
    emit('getData', res, index, i)
  })
}
const pushData = (c: Idata_tree, index: number, i: Idata_tree) => {
  emit('getData', c, index, i)
}
const inputArr = reactive([])


watch(box, (n) => {



}, { deep: true })

</script>
<style lang="less" scoped>
.box {
  width: 200px;
  height: 200px;
  background-color: #ffffff;
  display: inline-block;
  overflow-y: scroll;
  box-shadow: 0px 0px 0px 3px #f6f6f6;
  margin-top: 3px;
}
</style>