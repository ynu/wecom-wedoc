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

export type AddField = {
  // field_id?: string,
  field_title: string,
  field_type: FieldType,
  [key: string]: any,
}

export type AddFields = {
  fields: AddField[],
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
  console.log(params);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/add_fields?access_token=${token}`, params);
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

export type NumberFieldProperty = {
  /**
   * 表示小数点的位数，即数字精度
   */
  decimal_places: number,
  /**
   * 是否使用千位符，设置此属性后数字字段将以英文逗号分隔千分位，如 1,000
   */
  use_separate: boolean,
}
export type AddNumberField = {
  field_title: string,
} & NumberFieldProperty & SheetRequestPrams
export const addNumberField = (params:AddNumberField, options:any) => {
  const { docid, sheet_id, field_title, ...property_number } = params;
  return add({
    docid,
    sheet_id,
    fields: [{
      field_title,
      field_type: FieldType.FIELD_TYPE_NUMBER,
      property_number,
    }],
  }, options);
}

// CheckboxFieldProperty
export type CheckboxFieldProperty = {
  /**
   * 新增时是否默认勾选
   */
  checked: boolean;
}

export type addCheckboxField = (params:any, options:any) => {
  // TODO
}

// DateTimeFieldProperty
export type DateTimeFieldProperty = {
  /**
   * 设置日期格式
   */
  format: string;
  /**
   * 新建记录时，是否自动填充时间
   */
  auto_fill: boolean;
}
// TODO addDateTimeFieldProperty

// AttachmentFieldProperty
export type AttachmentFieldProperty = {
  /**
   * 设置文件展示方式
   */
  display_mode: string; // 这里假设display_mode是一个字符串类型，具体值需要根据实际API文档定义
}

// UserFieldProperty
export type UserFieldProperty = {
  /**
   * 允许添加多个人员
   */
  is_multiple: boolean;
  /**
   * 添加人员时通知用户
   */
  is_notified: boolean;
}

// UrlFieldProperty
export type UrlFieldProperty = {
  /**
   * 超链接展示样式
   */
  type: string; // 这里假设type是一个字符串类型，具体值需要根据实际API文档定义
}

// SelectFieldProperty
export type SelectFieldProperty = {
  /**
   * 是否允许填写时新增选项
   */
  is_quick_add: boolean;
  /**
   * 多选选项的格式设置
   */
  options: Array<{
    // 这里定义options对象的结构，具体属性需要根据实际API文档定义
    key: string; // 假设有一个key属性
    label: string; // 假设有一个label属性
  }>;
}

// CreatedTimeFieldProperty & ModifiedTimeFieldProperty
export type TimeFieldProperty = {
  /**
   * 设置日期格式
   */
  format: string;
}

// ProgressFieldProperty
export type ProgressFieldProperty = {
  /**
   * 小数位数
   */
  decimal_places: number;
}

// SingleSelectFieldProperty
export type SingleSelectFieldProperty = {
  /**
   * 是否允许填写时新增选项
   */
  is_quick_add: boolean;
  /**
   * 单选选项的格式设置
   */
  options: Array<{
    // 这里定义options对象的结构，具体属性需要根据实际API文档定义
    key: string;
    label: string;
  }>;
}

// ReferenceFieldProperty
export type ReferenceFieldProperty = {
  /**
   * 关联的子表id
   */
  sub_id: string;
  /**
   * 关联的字段id
   */
  filed_id: string;
  /**
   * 是否允许多选
   */
  is_multiple: boolean;
  /**
   * 视图id
   */
  view_id: string;
}

// LocationFieldProperty
export type LocationFieldProperty = {
  /**
   * 输入类型
   */
  input_type: string; // 这里假设input_type是一个字符串类型，具体值需要根据实际API文档定义
}

// AutoNumberFieldProperty
export type AutoNumberFieldProperty = {
  /**
   * 输入类型
   */
  type: string; // 这里假设type是一个字符串类型，具体值需要根据实际API文档定义
  /**
   * 自定义规则
   */
  rules: Array<{
    // 这里定义rules对象的结构，具体属性需要根据实际API文档定义
  }>;
  /**
   * 是否应用于已有编号
   */
  reformat_existing_record: boolean;
}

// CurrencyFieldProperty
export type CurrencyFieldProperty = {
  /**
   * 输入类型
   */
  currency_type: string; // 这里假设currency_type是一个字符串类型，具体值需要根据实际API文档定义
  /**
   * 表示小数点的位数，即数字精度
   */
  decimal_places: number;
  /**
   * 是否使用千位符
   */
  use_separate: boolean;
}

// WwGroupFieldProperty
export type WwGroupFieldProperty = {
  /**
   * 是否允许多个群聊
   */
  allow_multiple: boolean;
}
