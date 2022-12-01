import type { Idata, Idata_tree } from "@/types/Idata";

export const arrTotree = (arr: Idata[]): Idata_tree[] => {
  const parent = arr.filter(item => item.parent_id === '1')
  const children = arr.filter(item => item.parent_id !== '1')
  walk(parent, children)
  return parent
}

function walk(parent: Idata[], children: Idata[]) {
  parent.map(p => {
    children.map(c => {
      if (c.parent_id === p.id) {
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