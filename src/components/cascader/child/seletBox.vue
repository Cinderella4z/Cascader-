<template>
  <div class="box" v-show="show">
    <div v-for="(c, k) in propData" class="item" :key="c.id" @click.stop="handleItemClick(c, k)"
      :class="{ 'active': k === active }" ref="box">
      <input class="input" :name="'1'" type="radio" :checked="ifMatch === k" @click.stop="handleInputClick(c, k)">
      {{ c.ad_name }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Idata_tree } from '@/types/Idata';
import { ref, toRefs, watch, type Ref, nextTick } from 'vue';
/*****
 *propData:父组件传来进行遍历创建
 *index: 此变量是父组件遍历子组件中的index, 为了得知此子组件是第几个
 *show:控制子组件显影
 */
const props = defineProps(['index', 'propData', 'show',])
const { propData, index, show } = toRefs(props)
// 控制点击高亮
const active = ref(-1)
// 控制圆点选中
const ifMatch = ref(-1)
const box = ref()
const matchItem = ref()
const emit = defineEmits(['handleInputClick', 'getAdcode'])
const handleInputClick = (i: Idata_tree, k: number) => {
  emit('handleInputClick', i, index)
  emit('getAdcode', i.id)
  active.value = k
}
const handleItemClick = (c: Idata_tree, k: number) => {
  emit('handleInputClick', c, index)
  active.value = k
}
const setActive = () => {
  active.value = -1
  ifMatch.value = -1
}
const setMatchItem = (name: string, index: string) => {

  let key = propData?.value.findIndex((item: Idata_tree) => item.ad_name === name)
  active.value = key
  matchItem.value = box.value[key]

  if (typeof index !== undefined) {
    ifMatch.value = key
  }
}
defineExpose([setActive, setMatchItem])


// 当模糊搜索 选择完之后 打开下拉选择框 跳到对应选择项的可视区
watch(show as Ref, (n) => {
  nextTick(() => {
    matchItem.value && matchItem.value.scrollIntoView()
  })
})

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