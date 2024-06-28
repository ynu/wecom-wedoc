/**
 * 企业微信API-文档-智能表格操作-记录
 */
import axios from 'axios';
import { GetToken, getToken, qyHost } from 'wecom-common';
import Debug from 'debug';
import { CellValueKeyType, CommonRecord, SheetRequestPrams } from './smart-sheet-sheet';
const warn = Debug('wecom-wedoc:warn');
const error = Debug('wecom-wedoc:error');
const info = Debug('wecom-wedoc:info');
const debug = Debug('wecom-wedoc:debug');

export type AddRecord = {
  key_type?: CellValueKeyType,
  records: { values: object }[],
} & SheetRequestPrams

export type Sort = {
  /**
   * 需要排序的字段标题
   */
  field_titles: string,
  /**
   * 是否进行降序排序，默认值为 false
   */
  desc?: string,
}

export type QueryParams = {
  /**
   * 视图 ID
   */
  view_id?: string,
  /**
   * 由记录 ID 组成的 JSON 数组
   */
  record_ids?: [string],
  /**
   * 返回记录中单元格的key类型
   */
  key_type?: CellValueKeyType,
  /**
   * 返回指定列，由字段标题组成的 JSON 数组 ，key_type 为 CELL_VALUE_KEY_TYPE_FIELD_TITLE 时有效
   */
  field_titles?: [string],
  /**
   * 返回指定列，由字段 ID 组成的 JSON 数组 ，key_type 为 CELL_VALUE_KEY_TYPE_FIELD_ID 时有效
   */
  field_ids?: [string],
  /**
   * 对返回记录进行排序
   */
  sort?: [Sort],
  /**
   * 偏移量，初始值为 0
   */
  offset?: number,
  /**
   * 分页大小 , 每页返回多少条数据；当不填写该参数或将该参数设置为 0 时，如果总数大于 1000，一次性返回 1000 行记录，当总数小于 1000 时，返回全部记录；limit 最大值为 1000
   */
  limit?: number,
} & SheetRequestPrams

/**
 * 查询记录
 * 本接口用于获取 Smartsheet 中某个子表下记录信息，该接口可以完成下面三种功能：获取全部记录信息、依据字段名和记录 ID 获取对应记录、对记录进行排序。
 * @see https://developer.work.weixin.qq.com/document/path/99915
 */
export const records = async (params: QueryParams, options: GetToken): Promise<any[]> => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/get_records?access_token=${token}`, params);
  return res.data?.records;
}

/**
 * 添加记录
 * 本接口用于在 Smartsheet 中的某个子表里添加一行或多行新记录。单表最多允许有40000行记录。
 * 注意：不能通过添加记录接口给创建时间、最后编辑时间、创建人和最后编辑人四种类型的字段添加记录。
 * @see https://developer.work.weixin.qq.com/document/path/99907
 */
export const add = async (params: AddRecord, options: GetToken): Promise<any[]> => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/add_records?access_token=${token}`, params);
  return res.data?.success ? res.data?.records : res.data;
}

/**
 * 删除记录
 * 本接口用于删除 Smartsheet 的某个子表中的一行或多行记录。
 * @see https://developer.work.weixin.qq.com/document/path/99908
 */
export const del = async (params: SheetRequestPrams & { record_ids: string[] }, options: GetToken): Promise<any[]> => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/delete_records?access_token=${token}`, params);
  return res.data.errcode;
}

/**
 * 更新记录
 * 本接口用于更新 Smartsheet 中的某个子表里的一行或多行记录。
 * 注意：不能通过更新记录接口给创建时间、最后编辑时间、创建人和最后编辑人四种类型的字段更新记录。
 * @see https://developer.work.weixin.qq.com/document/path/99909
 */
export const update = async (params: SheetRequestPrams & {
  key_type?: CellValueKeyType,
  records: CommonRecord[],
}, options: GetToken): Promise<any[]> => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/update_records?access_token=${token}`, params);
  return res.data?.records;
}

export const getTextFromRecord = (record:any, name:string) => {
  if (record.values[name]) return record.values[name][0].text;
  else return null;
}