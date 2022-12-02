export interface Idata {
  id: string,
  fw_id: string,
  ad_code: string,
  ad_name: string,
  parent_id: string,
  level: number,
  children?: Array<Idata>
}
export interface Idata_tree {
  id: string,
  fw_id: string,
  ad_code: string,
  ad_name: string,
  parent_id: string,
  level: number,
  children: Idata_tree[]
}