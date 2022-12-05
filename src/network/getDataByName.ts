import type { Idata_tree } from "@/types/Idata"
import data from '@/assets/data.json'
import { arrTotree } from "@/libs"

export function getDataByName(name?: string): Promise<Idata_tree[]> {
  return new Promise<Idata_tree[]>((resolve) => {
    setTimeout(() => {
      const result: Idata_tree[] = search(name)
      resolve(result)
    }, 100);
  })
}

export function search(name?: string) {
  if (!name) return arrTotree(data)
  return dfs(arrTotree(data))
  
  function dfs(dataArr: Idata_tree[]): Idata_tree[] {
    let res: Idata_tree[] = []
    for (let i of dataArr) {
      if (i.ad_name === name) return i.children
      res = i.children && dfs(i.children)
      if (res) {
        return res
      }
    }
    return res
  }
}
