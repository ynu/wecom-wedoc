/**
 * 企业微信API-文档-智能表格操作-记录
 */
import axios from 'axios';
import { WecomError, getToken, qyHost } from 'wecom-common';
import Debug from 'debug';
import { SheetRequestPrams } from './smart-sheet-sheet';
const warn = Debug('wecom-wedoc:warn');
const error = Debug('wecom-wedoc:error');
const info = Debug('wecom-wedoc:info');
const debug = Debug('wecom-wedoc:debug');

// 定义字段类型的枚举
export enum FieldType {
  // 文本
  FIELD_TYPE_TEXT = 'FIELD_TYPE_TEXT',
  // 数字
  FIELD_TYPE_NUMBER = 'FIELD_TYPE_NUMBER',
  // 复选框
  FIELD_TYPE_CHECKBOX = 'FIELD_TYPE_CHECKBOX',
  // 日期
  FIELD_TYPE_DATE_TIME = 'FIELD_TYPE_DATE_TIME',
  // 图片
  FIELD_TYPE_IMAGE = 'FIELD_TYPE_IMAGE',
  // 文件
  FIELD_TYPE_ATTACHMENT = 'FIELD_TYPE_ATTACHMENT',
  // 成员
  FIELD_TYPE_USER = 'FIELD_TYPE_USER',
  // 超链接
  FIELD_TYPE_URL = 'FIELD_TYPE_URL',
  // 多选
  FIELD_TYPE_SELECT = 'FIELD_TYPE_SELECT',
  // 创建人
  FIELD_TYPE_CREATED_USER = 'FIELD_TYPE_CREATED_USER',
  // 最后编辑人
  FIELD_TYPE_MODIFIED_USER = 'FIELD_TYPE_MODIFIED_USER',
  // 创建时间
  FIELD_TYPE_CREATED_TIME = 'FIELD_TYPE_CREATED_TIME',
  // 最后编辑时间
  FIELD_TYPE_MODIFIED_TIME = 'FIELD_TYPE_MODIFIED_TIME',
  // 进度
  FIELD_TYPE_PROGRESS = 'FIELD_TYPE_PROGRESS',
  // 电话
  FIELD_TYPE_PHONE_NUMBER = 'FIELD_TYPE_PHONE_NUMBER',
  // 邮件
  FIELD_TYPE_EMAIL = 'FIELD_TYPE_EMAIL',
  // 单选
  FIELD_TYPE_SINGLE_SELECT = 'FIELD_TYPE_SINGLE_SELECT',
  // 关联
  FIELD_TYPE_REFERENCE = 'FIELD_TYPE_REFERENCE',
  // 地理位置
  FIELD_TYPE_LOCATION = 'FIELD_TYPE_LOCATION',
  // 货币
  FIELD_TYPE_CURRENCY = 'FIELD_TYPE_CURRENCY',
  // 群
  FIELD_TYPE_WWGROUP = 'FIELD_TYPE_WWGROUP',
  // 自动编号
  FIELD_TYPE_AUTONUMBER = 'FIELD_TYPE_AUTONUMBER'
}

export type AddFields = {
  fields: {
    field_title: string,
    field_type: FieldType,
    [key: string]: any,
  }[]
} & SheetRequestPrams

export type DelFields = {
  field_ids: string[]
} & SheetRequestPrams

export type UpdateFields = {
  fields: {
    field_id: string,
    field_title?: string,
    field_type: FieldType,
    [key: string]: any,
  }[]
} & SheetRequestPrams
/**
 * 查询字段
 * 本接口用于获取智能表中某个子表下字段信息，该接口可以完成下面三种功能：获取全部字段信息、依据字段名获取对应字段、依据字段 ID 获取对应字段信息。
 * @see https://developer.work.weixin.qq.com/document/path/99914
 */
export const fields = async (params: SheetRequestPrams, options:any): Promise<any[]> => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/get_fields?access_token=${token}`, params);
  if (res.data.errcode) throw new WecomError(res.data.errcode, res.data.errmsg);
  return res.data?.fields;
}

/**
 * 添加字段
 */
export const add = async (params:AddFields, options:any) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/add_fields?access_token=${token}`, {
    docid: params.docid,
    sheet_id: params.sheet_id,
    fields: params.fields,
  });
  if (res.data.errcode) throw new WecomError(res.data.errcode, res.data.errmsg);
  return res.data?.fields;
}

/**
 * 删除字段
 */
export const del = async (params: DelFields, options:any) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/delete_fields?access_token=${token}`, {
    docid: params.docid,
    sheet_id: params.sheet_id,
    field_ids: params.field_ids,
  });
  if (res.data.errcode) throw new WecomError(res.data.errcode, res.data.errmsg);
  return res.data;
}

/**
 * 更新字段
 * 该接口只能更新字段名、字段属性，不能更新字段类型
 */
export const update = async(params: UpdateFields, options:any) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/update_fields?access_token=${token}`, {
    docid: params.docid,
    sheet_id: params.sheet_id,
    fields: params.fields,
  })
  if (res.data.errcode) throw new WecomError(res.data.errcode, res.data.errmsg);
  return res.data;
}