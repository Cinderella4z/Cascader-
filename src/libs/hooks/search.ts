import type { Idata_tree } from "@/types/Idata"

export function Search() {
  // 通过adcode 查找
  function deep(adcode: string, data: Idata_tree[], res: Idata_tree[] = []): Idata_tree[] {
    for (let i of data) {
      if (adcode.includes(i.id) || i.id.includes(adcode)) {
        res.push(i)
        if (adcode === i.id) return res
        return i.children && deep(adcode, i.children, res)
      }
    }
    return []
  }
  // 模糊搜索
  function search(string: string, data: Idata_tree[]) {
    let res: Idata_tree[][] = []
    dfs(data)

    function dfs(dataArr: Idata_tree[], temp: Idata_tree[] = []) {
      for (let i of dataArr) {
        temp.push(i)
        if (!i.ad_name.includes(string) && !string.includes(i.ad_name)) {
          i.children && dfs(i.children, temp)
          temp.pop()
        }
        else {
          res.push([...temp])
        }
      }
    }
    return res
  }

  return {
    deep, search
  }
}