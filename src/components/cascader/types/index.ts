import type { Idata_tree } from "@/types/Idata";
interface props {
  useAsync: boolean,
  checkStrictly: boolean,
  data?: Array<Idata_tree>
  loadFn?: Function,
  searchFn?: Function,
}

export interface Iprops {
  value: string,
  props: props
}
