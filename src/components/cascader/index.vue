<template>
  <div v-close="closeTabShow" class="content-box">
    <div class="top">
      <input v-model="textValue" :disabled="inputDisable" :placeholder="placeholder" />
      <button class="btn" @click="handleTabShow">{{ Icon }}</button>
    </div>
    <seletBoxVue v-for="(item, key) in data" :propData="item" :index="key" :show="tabShow"
      @handleInputClick="handleInputClick" @handleItemClick="handleItemClick" @getAdcode="getAdcode" ref="boxRef" />

    <div class="selectBox" v-if="matchNameBoxShow">
      <div class="select" v-for="item in matchName" @click="handleItemCheck(item)">
        <span v-for="i in item">
          {{ i.ad_name }} /
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, type Ref, computed, watch, toRefs, } from 'vue';
import dbData from '@/assets/data.json'
import type { Idata_tree } from '@/types/Idata';
// 子组件
import seletBoxVue from './child/seletBox.vue';
// hooks
import { Search } from './hooks/search'
import { arrTotree } from '@/libs';
import { debounce } from '@/libs';
/*****全局变量 */
// 传给子组件的数据
const data: Ref<Idata_tree[][]> = ref([])
const boxRef = ref()
// 控制下拉选择显影
const tabShow = ref(false)
// 双绑input框
const textValue: Ref<string[] | string> = ref([])

// 模糊搜索匹配的结果 -> 传给子组件遍历
const matchName: Ref<Idata_tree[][]> = ref([])
const { search, deep } = Search()
/* description: 带搜索的地区级联选择器
* props: 组件属性
* value 选中地区的值 V - model 绑定对象
* props.useAsync { boolean } 是否异步获取数据，默认是false
* props.data { array } 备选列表数据(tree)。当useAsync为false时候必传
* props.loadFn[(currentNode, resolve) => void - 远程获取树列表数据，USeAsunc rue时候以传 
* props.searchFn[(keywords, resolve) => Void} 远程搜索函数，当 useAsync true 时候必传 
* proDs.checkstrictLu ooLeD) 是否严格的进守父子节点不互相关联 就认为ture, true 时候可以选中任何 - 节点，faLse 时候 只能选中最后一级的节点
* events: 组件事件
* change 改变选中值触发事件，回调参数为选中的节点
*/
const compProps = defineProps({
  value: {
    type: String,
    default: ''
  },
  props: {
    type: Object,
    default: () => { }
  }
})
const emit = defineEmits(['update:value', 'change'])
const { value, props } = toRefs(compProps);
const { loadFn, searchFn, useAsync, checkStrictly, dataArr } = props.value

/*****Computed */
const Icon = computed(() => !tabShow.value ? '👆' : '👇')
const matchNameBoxShow = computed(() => !tabShow.value && matchName.value.length)
const inputDisable = computed(() => !useAsync)
const placeholder = computed(() => useAsync ? '试试搜索：合肥' : '请选择')
// 初始化数据
const initLoadData = () => {
  if (typeof useAsync === 'undefined' || useAsync === false) {
    data.value = dataArr
  } else {
    loadFn((res: Idata_tree[]) => { data.value.push(res) }, '')
  }
}
const getAdcode = (adcode: string) => {
  emit('update:value', adcode)
}
// 点击每一项选项触发
const handleChange = (itemChildren: Idata_tree) => {
  emit('change', itemChildren)
}
const handleItemClick = async (itemChildren: Idata_tree, index: Ref<number>,) => {
  function quchong() {
    if (data.value[index.value + 1]) {
      // 为了清除 切换时 后一列中子项高亮
      boxRef.value[index.value + 1][0]()
      data.value.splice(index.value + 1)
    }
  }
  if (typeof useAsync === 'undefined' || useAsync === false) {
    quchong()
    itemChildren.children && data.value.push(itemChildren.children)
  } else {
    loadFn((res: Idata_tree[]) => {
      quchong()
      res && data.value.push(res)
    }, itemChildren.ad_name)
  }
}
const handleInputClick = async (itemChildren: Idata_tree, index: Ref<number>,) => {
  handleChange(itemChildren)
  handleItemClick(itemChildren, index)
}
const handleItemCheck = async (item?: Idata_tree[]) => {
  if (item) {
    if (checkStrictly) {
      textValue.value = item.map(c => c.ad_name) as string[]
    } else {
      textValue.value = [item[item?.length - 1].ad_name]
    }
  }
  const _textValue = item?.map(c => c.ad_name) as string[]
  const length = _textValue.length
  // 当选择搜索内容后，清空并再次初始化一次
  data.value = []
  initLoadData()
  _textValue.map((item, key) => {
    if (typeof useAsync === 'undefined' || useAsync === false) {
    }
    else {
      loadFn((list: Idata_tree[]) => {
        list && data.value.push(list)
        length - 1 === key ? boxRef.value[key][1](item, 'end') : boxRef.value[key][1](item)
      }, item)
    }

  })
}
// 控制选择栏显影
const handleTabShow = () => {
  tabShow.value = !tabShow.value
}
// 点击非组件地方 关闭下拉栏
const closeTabShow = () => {
  tabShow.value = false
  if (!textValue.value) {
    const db = arrTotree(dbData)
    textValue.value = deep(value.value, db) ? deep(value.value, db).map(i => i.ad_name) : ''
  }
}
initLoadData()

watch(textValue, debounce((n: string) => {
  matchName.value = []
  // 模糊搜索
  if (typeof n === 'string' && n !== '') {
    tabShow.value = false
    searchFn(n, (res: Idata_tree[][]) => {
      res.map(item => {
        matchName.value.push(item)
      })
    })
  }
}, 200))

watch((value as Ref), (n) => {
  const db = arrTotree(dbData)
  const searchRes = deep(n, db)
  if (checkStrictly) {
    textValue.value = searchRes && searchRes.map(i => i.ad_name)
  } else {
    textValue.value = searchRes && [searchRes[searchRes.length - 1].ad_name]
  }


}, { immediate: true })


</script>
<style lang="less" scoped>
.content-box {
  width: 800px;

  .top {
    display: flex;
    width: 200px;

    input {
      border: 1px solid #dcdfe6;
      height: 30px;
      border-radius: 10px 0 0 10px;
      border-right: 0;
      outline: none;
      color: #606266;
    }

    button {
      border: 0;
      background-color: white;
      border: 1px solid #dcdfe6;
      border-left: 0;
      border-radius: 0 10px 10px 0;
    }
  }

  .selectBox {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 200px;
    width: 200px;

    .select {
      width: 200px;
      height: 40px;
      background-color: #ffffff;
      white-space: nowrap;
      box-shadow: 0px 0px 8px 8px #f6f6f6;
      border-radius: 10px;
      display: flex;
      align-items: center;
      margin-top: 5px;
      overflow-x: scroll;
      user-select: none;
      color: #60627e;
      font-size: 14px;

      span {
        margin-left: 5px;
      }
    }
  }
}
</style>

