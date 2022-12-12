import type { Idata, Idata_tree } from "@/types/Idata";
/***
 * @description 将json格式的数据转换为树形结构
 * @param  arr
 * @returns  
 */

export const arrTotree = (arr: Idata[]): Idata_tree[] => {
  const data: Idata[] = JSON.parse(JSON.stringify(arr))
  const parent = data.filter(item => item.parent_id === '1')
  const children = data.filter(item => item.parent_id !== '1')
  walk(parent, children)
  return parent as Idata_tree[]
}

function walk(parent: Idata[], children: Idata[]) {
  parent.map(p => {
    children.map(c => {
      if (c.parent_id === p.id && c.ad_name !== '市辖区') {
        if (p.children) {
          p.children.push(c)
        }
        else {
          p.children = [c]
        }
        walk([c], children)
      }
    })
  })
}