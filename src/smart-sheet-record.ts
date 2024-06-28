/**
 * 企业微信API-文档-智能表格操作-记录
 */
import axios from 'axios';
import {GetToken, getToken, qyHost} from 'wecom-common';
import Debug from 'debug';
import {GetSheet} from './smart-sheet-sheet';

const warn = Debug('wecom-wedoc:warn');
const error = Debug('wecom-wedoc:error');
const info = Debug('wecom-wedoc:info');
const debug = Debug('wecom-wedoc:debug');

/**
 * 记录(UpdateRecord和CommonRecord)中key的类型
 */
export enum CellValueKeyType {
  /**
   * key用字段标题表示
   */
  CELL_VALUE_KEY_TYPE_FIELD_TITLE = "CELL_VALUE_KEY_TYPE_FIELD_TITLE",
  /**
   * key用字段 ID 表示
   */
  CELL_VALUE_KEY_TYPE_FIELD_ID = "CELL_VALUE_KEY_TYPE_FIELD_ID",
}

/**
 * 文本类型字段的枚举
 */
export enum CellTextValueType {
  /**
   * 内容为文本
   */
  TEXT = "text",
  /**
   * 内容为链接
   */
  URL = "url",
}

/**
 * 单元格的key类型
 */
export type KeyType = {
  /**
   * 返回记录中单元格的key类型，默认用标题
   */
  key_type?: CellValueKeyType,
}

/**
 * 记录ID类型
 */
export type RecordRequestPrams = {
  /**
   * 记录ID
   */
  record_id: string,
}

/**
 * 记录的具体内容
 * key根据KeyType动态改变
 */
export type Values = {values: {
    [key: string]: CellTextValue[] | CellNumberValue | CellProgressValue | CellCheckboxValue |
        CellDateTimeValue | CellPhoneNumberValue | CellEmailValue | CellCurrencyValue | CellImageValue[] |
        CellAttachmentValue[] | CellUserValue[] | CellUrlValue[] | Option[] | CellLocationValue[]
  }
}

/**
 * 添加记录参数
 */
export type AddRecords = {
  /**
   * 需要添加的记录的具体内容组成的 JSON 数组
   */
  records: Values[],
} & KeyType & GetSheet

/**
 * 更新记录对象,相比添加记录多了record_id字段
 */
export type UpdateRecord = Values & RecordRequestPrams

/**
 * 修改记录
 */
export type UpdateRecords = {
  /**
   * 需要添加的记录的具体内容组成的 JSON 数组
   * key值根据单元格的key类型动态改变
   */
  records: UpdateRecord[],
} & KeyType & GetSheet

/**
 * 删除记录
 */
export type DelParams = { record_ids: string[]} & GetSheet

/**
 * 文本类型
 */
export type CellTextValue = {
  /**
   * 文本类型字段的单元
   */
  type: CellTextValueType,
  /**
   * 单元格内容
   */
  text: string,
  /**
   * 当type时url时，表示链接跳转url
   */
  link?: string,
}

/**
 * 数字单元格类型
 */
export type CellNumberValue= number

/**
 * 进度单元格类型
 */
export type CellProgressValue = number

/**
 * 复选框单元格类型
 */
export type CellCheckboxValue = boolean

/**
 * 日期单元格类型
 */
export type CellDateTimeValue = string

/**
 * 电话单元格类型
 */
export type CellPhoneNumberValue = string

/**
 * 邮箱单元格类型
 */
export type CellEmailValue = string

/**
 * 货币单元格类型
 */
export type CellCurrencyValue = number

/**
 * 图片单元格类型
 */
export type CellImageValue = {
  /**
   * 图片 ID,自定义id
   */
  id: string,
  /**
   * 图片标题
   */
  title: string,
  /**
   * 图片链接，通过上传图片接口获取
   */
  image_url: string,
  /**
   * 图片宽度
   */
  width: number,
  /**
   * 图片高度
   */
  height: number,
}

/**
 * 文件单元格类型
 */
export type CellAttachmentValue = {
  /**
   * 文件名
   */
  name: string,
  /**
   * 文件大小
   */
  size: number,
  /**
   * 智能表为SMARTSHEET
   */
  file_ext: 'SMARTSHEET',
  /**
   * 文件ID
   */
  file_id: string,
  /**
   * 文件url ，如果是微盘文档则通过获取分享链接获得，如果是文档，则为文档url
   */
  file_url: string,
  /**
   * 智能表为70
   */
  file_type: '70',
  /**
   * 文件类型，用于区分文件夹和文件 1.文件夹 2.文件
   */
  doc_type: string,
}

/**
 * 成员单元格类型
 */
export type CellUserValue = {
  /**
   * 成员ID
   */
  user_id: string,
}

/**
 * 链接单元格类型
 */
export type CellUrlValue = {
  /**
   * 固定为url
   */
  type: 'url',
  /**
   * 链接显示文本
   */
  text: string,
  /**
   * 链接跳转url
   */
  link: string,
}

/**
 * 多选或单选单元格类型
 */
export type Option = {
  /**
   * 选项ID
   */
  id: string,
}

/**
 * 地理位置单元格类型
 */
export type CellLocationValue = {
  /**
   * 填1，表示来源为腾讯地图。目前只支持腾讯地图来源
   */
  source_type: 1,
  /**
   * 地点ID
   */
  id: string,
  /**
   * 纬度
   */
  latitude: string,
  /**
   * 经度
   */
  longitude: string,
  /**
   * 地点名称
   */
  title: string,
}

/**
 * 排序类型
 */
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

/**
 * 查询记录类型
 */
export type QueryParams = {
  /**
   * 视图 ID
   */
  view_id?: string,
  /**
   * 由记录 ID 组成的 JSON 数组
   */
  record_ids?: string[],
  /**
   * 返回记录中单元格的key类型
   */
  key_type?: CellValueKeyType,
  /**
   * 返回指定列，由字段标题组成的 JSON 数组 ，key_type 为 CELL_VALUE_KEY_TYPE_FIELD_TITLE 时有效
   */
  field_titles?: string[],
  /**
   * 返回指定列，由字段 ID 组成的 JSON 数组 ，key_type 为 CELL_VALUE_KEY_TYPE_FIELD_ID 时有效
   */
  field_ids?: string[],
  /**
   * 对返回记录进行排序
   */
  sort?: Sort[],
  /**
   * 偏移量，初始值为 0
   */
  offset?: number,
  /**
   * 分页大小 , 每页返回多少条数据；当不填写该参数或将该参数设置为 0 时，如果总数大于 1000，一次性返回 1000 行记录，当总数小于 1000 时，返回全部记录；limit 最大值为 1000
   */
  limit?: number,
} & GetSheet

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
export const add = async (params: AddRecords, options: GetToken): Promise<any[]> => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/add_records?access_token=${token}`, params);
  return res.data?.success ? res.data?.records : res.data;
}

/**
 * 删除记录
 * 本接口用于删除 Smartsheet 的某个子表中的一行或多行记录。
 * @see https://developer.work.weixin.qq.com/document/path/99908
 */
export const del = async (params: DelParams, options: GetToken): Promise<any[]> => {
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
export const update = async (params: UpdateRecords, options: GetToken): Promise<any[]> => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/update_records?access_token=${token}`, params);
  return res.data?.records;
}

export const getTextFromRecord = (record:any, name:string) => {
  if (record.values[name]) return record.values[name][0].text;
  else return null;
}
