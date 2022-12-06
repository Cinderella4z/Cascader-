<template>
  <div v-close="close" class="content-box">
    <div class="top">
      <input v-model="textValue" placeholder="区域名搜索" />
      <button class="btn" @click="pull">{{ Icon }}</button>
    </div>
    <seletBoxVue v-for="(item, key) in options" :propData="item" :index="key" :show="tabShow" @getData="getData"
      @getAdcode="getAdcode" ref="box" />

    <div class="selectBox" v-if="matchNameBoxShow">
      <div class="select" v-for="item in matchName" @click="cover(item)">
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
/****
 * load ：加载源数据函数
 * value：绑定点击元素
 * showAllLevels：控制是否选择所有路径 或 只显示最后一级
 */
const props = defineProps({
  load: {
    type: Function,
    default: () => { }
  },
  value: {
    type: String,
    default: ''
  },
  showAllLevels: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['update:value'])

const { load, value, showAllLevels } = toRefs(props);
const textValue: Ref<string[] | string> = ref([])
// 接收数据 传给子组件进行遍历
const options: Ref<Idata_tree[][]> = ref([])
const init = () => {
  load?.value().then((res: Idata_tree[]) => {
    options.value.push(res)
  })
}
init()
const box = ref()

const getAdcode = (adcode: string) => {
  emit('update:value', adcode)
}

// 点击每一项选项触发
const getData = async (itemChildren: Idata_tree, index: Ref<number>,) => {
  const childList = await load?.value(itemChildren.ad_name)
  if (options.value[index.value + 1]) {
    // 为了清除 切换时 后一列中子项高亮
    box.value[index.value + 1][0]()
    options.value.splice(index.value + 1)
  }
  childList && options.value.push(childList);
}
// 控制选择栏显影
let tabShow = ref(false)
const pull = () => {
  tabShow.value = !tabShow.value
}
const close = () => {
  tabShow.value = false
}
const Icon = computed(() => !tabShow.value ? '👆' : '👇')

// 模糊搜索 相关方法
const { search, deep } = Search()
const matchName: Ref<Idata_tree[][]> = ref([])
const matchNameBoxShow = computed(() => !tabShow.value && matchName.value.length)
const cover = async (item?: Idata_tree[]) => {
  textValue.value = item?.map(c => c.ad_name) as string[]
  const length = textValue.value.length
  // 当选择搜索内容后，清空并再次初始化一次
  options.value = []
  init()
  textValue.value.map(async (item, key) => {
    const list: Idata_tree[] = await load.value(item)
    list && options.value.push(list)
    //调用子组件方法，为了修改高亮
    //如果是最后一项，就需要通知子组件将这一项改为checked
    length - 1 === key ? box.value[key][1](item, 'end') : box.value[key][1](item)
  })
}


watch(textValue, debounce((n: string) => {
  matchName.value = []
  // 为了控制 输入框为空时，清空所有选项卡
  // 模糊搜索
  if (typeof n === 'string' && n !== '') {
    tabShow.value = false
    const resArr = search(n)
    resArr.map(item => {
      matchName.value.push(item)
    })
  }
}, 200))

watch((value as Ref), (n) => {
  const db = arrTotree(dbData)
  const searchRes = deep(n, db)
  if (n !== '' && showAllLevels?.value) {
    textValue.value = searchRes && searchRes.map(i => i.ad_name)
  } else {
    textValue.value = searchRes && [searchRes.pop() as Idata_tree].map(i => i.ad_name)
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
      box-shadow: 10px 10px 8px #f6f6f6;
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

