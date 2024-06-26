/**
 * 企业微信API-文档-智能表格操作-记录
 */
import axios from 'axios';
import { GetToken, WecomError, getToken, qyHost } from 'wecom-common';
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
  FIELD_TYPE_AUTONUMBER = 'FIELD_TYPE_AUTONUMBER',
}

// 定义小数点后的位数
export enum DecimalPlaces {
  // 显示原值
  MINUS_ONE = -1,
  // 代表整数
  ZERO = 0,
  // 精确到小数点后一位（1.0）
  ONE = 1,
  // 精确到小数点后一位（1.0）
  TWO = 2,
  // 精确到小数点后一位（1.0）
  THREE = 3,
  // 精确到小数点后一位（1.0）
  FOUR = 4,
}

// 展示样式
export enum DisplayMode {
  // 列表样式
  DISPLAY_MODE_LIST = 'DISPLAY_MODE_LIST',
  // 宫格样式
  DISPLAY_MODE_GRID = 'DISPLAY_MODE_GRID',
}

// 超链接展示样式
export enum LinkType {
  // 文字
  LINK_TYPE_PURE_TEXT = 'LINK_TYPE_PURE_TEXT',
  // 图标文字
  LINK_TYPE_ICON_TEXT = 'LINK_TYPE_ICON_TEXT',
}

// 自动编号类型
export enum NumberType {
  // 自增数字类型
  NUMBER_TYPE_INCR = 'NUMBER_TYPE_INCR',
  // 自定义类型
  NUMBER_TYPE_CUSTOM = 'NUMBER_TYPE_CUSTOM',
}

// 数字规则类型
export enum NumberRuleType {
  // 自增数字类型
  NUMBER_RULE_TYPE_INCR = 'NUMBER_RULE_TYPE_INCR',
  // 固定字符
  NUMBER_RULE_TYPE_FIXED_CHAR = 'NUMBER_RULE_TYPE_FIXED_CHAR',
  // 创建时间
  NUMBER_RULE_TYPE_TIME = 'NUMBER_RULE_TYPE_TIME',
}

// 货币符号类型
export enum CurrencyType {
  // 人民币
  CNY = 'CURRENCY_TYPE_CNY',
  // 美元
  USD = 'CURRENCY_TYPE_USD',
  // 欧元
  EUR = 'CURRENCY_TYPE_EUR',
  // 英镑
  GBP = 'CURRENCY_TYPE_GBP',
  // 日元
  JPY = 'CURRENCY_TYPE_JPY',
  // 韩元
  KRW = 'CURRENCY_TYPE_KRW',
  // 港元
  HKD = 'CURRENCY_TYPE_HKD',
  // 澳门元
  MOP = 'CURRENCY_TYPE_MOP',
  // 新台币
  TWD = 'CURRENCY_TYPE_TWD',
  // 阿联酋迪拉姆
  AED = 'CURRENCY_TYPE_AED',
  // 澳大利亚元
  AUD = 'CURRENCY_TYPE_AUD',
  // 巴西雷亚尔
  BRL = 'CURRENCY_TYPE_BRL',
  // 加拿大元
  CAD = 'CURRENCY_TYPE_CAD',
  // 瑞士法郎
  CHF = 'CURRENCY_TYPE_CHF',
  // 印尼卢比
  IDR = 'CURRENCY_TYPE_IDR',
  // 印度卢比
  INR = 'CURRENCY_TYPE_INR',
  // 墨西哥比索
  MXN = 'CURRENCY_TYPE_MXN',
  // 马来西亚林吉特
  MYR = 'CURRENCY_TYPE_MYR',
  // 菲律宾比索
  PHP = 'CURRENCY_TYPE_PHP',
  // 波兰兹罗提
  PLN = 'CURRENCY_TYPE_PLN',
  // 俄罗斯卢布
  RUB = 'CURRENCY_TYPE_RUB',
  // 新加坡元
  SGD = 'CURRENCY_TYPE_SGD',
  // 泰国铢
  THB = 'CURRENCY_TYPE_THB',
  // 土耳其里拉
  TRY = 'CURRENCY_TYPE_TRY',
  // 越南盾
  VND = 'CURRENCY_TYPE_VND'
}

// 自动编号规则
export type NumberRule = {
  type: NumberRuleType,
  value: string,
}

// 创建时间格式,目前应用于自动编号规则中的value字段
export enum CreateTimeFormat {
  // 格式说明：20240301
  YYYYMMDD = 'YYYYMMDD',
  // 格式说明：202403
  YYYYMM = 'YYYYMM',
  // 格式说明：0301
  MMDD = 'MMDD',
  // 格式说明：2024
  YYYY = 'YYYY',
  // 格式说明：03
  MM = 'MM',
  // 格式说明：01
  DD = 'DD',
}

// 选项颜色
export enum Style {
  // 浅红
  ONE = 1,
  // 浅橙
  TWO = 2,
  // 浅天蓝
  THREE = 3,
  // 浅绿
  FOUR = 4,
  // 浅紫
  FIVE = 5,
  // 浅粉红
  SIX = 6,
  // 浅灰
  SEVEN = 7,
  // 白
  EIGHT = 8,
}

// 地理位置输入类型
export enum LocationInputType {
  // 手动输入
  LOCATION_INPUT_TYPE_MANUAL = 'LOCATION_INPUT_TYPE_MANUAL',
  // 自动定位
  LOCATION_INPUT_TYPE_AUTO = 'LOCATION_INPUT_TYPE_AUTO',
}

// 多选和单选的选项参数
export type Option = {
  // 选项ID
  id?: string;
  // 要填写的选项内容
  text: string;
  // 选项颜色
  style: Style;
}

/**
 * 设置日期格式
 * "yyyy"年"m"月"d"日""            2018 年 4 月 20 日
 * "yyyy-mm-dd"                   2018-04-20
 * "yyyy/m/d"                     2018/4/20
 * "m"月"d"日""                    4 月 20 日
 * "yyyy"年"m"月"d"日" dddd"       2018 年 4 月 20 日 星期五
 * "yyyy"年"m"月"d"日" hh:mm"      2018 年 4 月 20 日 14:00
 * "yyyy-mm-dd hh:mm"             2018-04-20 14:00
 * "m/d/yyyy"                     4/20/2018
 * "d/m/yyyy"                     20/4/2018
 */
export type Format = string

export type AddField = {
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
export const fields = async (params: SheetRequestPrams, options:GetToken): Promise<any[]> => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/get_fields?access_token=${token}`, params);
  if (res.data.errcode) throw new WecomError(res.data.errcode, res.data.errmsg);
  return res.data?.fields;
}

/**
 * 添加字段
 * 字段名不能同名，否则报错
 */
export const add = async (params:AddFields, options: GetToken) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/add_fields?access_token=${token}`, params);
  console.log("res: ", res)
  if (res.data.errcode) throw new WecomError(res.data.errcode, res.data.errmsg);
  return res.data?.fields;
}

/**
 * 删除字段
 */
export const del = async (params: DelFields, options: GetToken) => {
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
 * 字段名不能修改为已存在的字段名，否则报错
 */
export const update = async(params: UpdateFields, options: GetToken) => {
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
  decimal_places: DecimalPlaces,
  /**
   * 是否使用千位符，设置此属性后数字字段将以英文逗号分隔千分位，如 1,000
   */
  use_separate: boolean,
}
export type AddNumberField = {
  field_title: string,
} & NumberFieldProperty & SheetRequestPrams
export const addNumberField = (params:AddNumberField, options: GetToken) => {
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

export type UpdateNumberField = {
  field_id: string,
  field_title?: string,
} & NumberFieldProperty & SheetRequestPrams
export const updateNumberField = (params: UpdateNumberField, options: GetToken) => {
  const { docid, sheet_id, field_title, field_id, ...property_number } = params;
  let field = {
    field_id,
    field_type: FieldType.FIELD_TYPE_NUMBER,
    field_title,
    property_number,
  };
  if (!field_title) delete field.field_title;
  return update({
    fields: [field],
    docid,
    sheet_id,
  }, options);
}

// CheckboxFieldProperty
export type CheckboxFieldProperty = {
  /**
   * 新增时是否默认勾选
   */
  checked: boolean;
}

export type AddCheckboxField = {
  field_title: string,
} & CheckboxFieldProperty & SheetRequestPrams

export const addCheckboxField = (params:AddCheckboxField, options: GetToken) => {
  const { docid, sheet_id, field_title, ...property_checkbox } = params;
  return add({
    docid,
    sheet_id,
    fields: [{
      field_title,
      field_type: FieldType.FIELD_TYPE_CHECKBOX,
      property_checkbox,
    }],
  }, options);
}

export type UpdateCheckboxField = {
  field_id: string,
  field_title?: string,
} & CheckboxFieldProperty & SheetRequestPrams

export const updateCheckboxField = (params:UpdateCheckboxField, options: GetToken) => {
  const { docid, sheet_id, field_id, field_title, ...property_checkbox } = params;
  return update({
    docid,
    sheet_id,
    fields: [{
      field_id,
      field_title,
      field_type: FieldType.FIELD_TYPE_CHECKBOX,
      property_checkbox,
    }],
  }, options);
}

// DateTimeFieldProperty
export type DateTimeFieldProperty = {
  format: Format;
  /**
   * 新建记录时，是否自动填充时间
   */
  auto_fill: boolean;
}
export type AddDateTimeField = {
  field_title: string,
} & DateTimeFieldProperty & SheetRequestPrams

export const addDateTimeField = (params:AddDateTimeField, options: GetToken) => {
  const { docid, sheet_id, field_title, ...property_date_time } = params;
  return add({
    docid,
    sheet_id,
    fields: [{
      field_title,
      field_type: FieldType.FIELD_TYPE_DATE_TIME,
      property_date_time,
    }],
  }, options);
}

export type UpdateDateTimeField = {
  field_id: string,
  field_title?: string,
} & DateTimeFieldProperty & SheetRequestPrams

export const updateDateTimeField = (params:UpdateDateTimeField, options: GetToken) => {
  const { docid, sheet_id, field_id, field_title, ...property_date_time } = params;
  return update({
    docid,
    sheet_id,
    fields: [{
      field_id,
      field_title,
      field_type: FieldType.FIELD_TYPE_DATE_TIME,
      property_date_time,
    }],
  }, options);
}

// AttachmentFieldProperty
export type AttachmentFieldProperty = {
  /**
   * 设置文件展示方式
   */
  display_mode: DisplayMode;
}

export type AddAttachmentField = {
  field_title: string,
} & AttachmentFieldProperty & SheetRequestPrams

export const addAttachmentField = (params:AddAttachmentField, options: GetToken) => {
  const { docid, sheet_id, field_title, ...property_attachment } = params;
  return add({
    docid,
    sheet_id,
    fields: [{
      field_title,
      field_type: FieldType.FIELD_TYPE_ATTACHMENT,
      property_attachment,
    }],
  }, options);
}

export type UpdateAttachmentField = {
  field_id: string,
  field_title?: string,
} & AttachmentFieldProperty & SheetRequestPrams

export const updateAttachmentField = (params:UpdateAttachmentField, options: GetToken) => {
  const { docid, sheet_id, field_id, field_title, ...property_attachment } = params;
  return update({
    docid,
    sheet_id,
    fields: [{
      field_id,
      field_title,
      field_type: FieldType.FIELD_TYPE_ATTACHMENT,
      property_attachment,
    }],
  }, options);
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

export type AddUserField = {
  field_title: string,
} & UserFieldProperty & SheetRequestPrams

export const addUserField = (params:AddUserField, options: GetToken) => {
  const { docid, sheet_id, field_title, ...property_user } = params;
  return add({
    docid,
    sheet_id,
    fields: [{
      field_title,
      field_type: FieldType.FIELD_TYPE_USER,
      property_user,
    }],
  }, options);
}

export type UpdateUserField = {
  field_id: string,
  field_title?: string,
} & UserFieldProperty & SheetRequestPrams

export const updateUserField = (params:UpdateUserField, options: GetToken) => {
  const { docid, sheet_id, field_id, field_title, ...property_user } = params;
  return update({
    docid,
    sheet_id,
    fields: [{
      field_id,
      field_title,
      field_type: FieldType.FIELD_TYPE_USER,
      property_user,
    }],
  }, options);
}

// UrlFieldProperty
export type UrlFieldProperty = {
  /**
   * 超链接展示样式
   */
  type: LinkType;
}

export type AddUrlField = {
  field_title: string,
} & UrlFieldProperty & SheetRequestPrams

export const addUrlField = (params:AddUrlField, options: GetToken) => {
  const { docid, sheet_id, field_title, ...property_url } = params;
  return add({
    docid,
    sheet_id,
    fields: [{
      field_title,
      field_type: FieldType.FIELD_TYPE_URL,
      property_url,
    }],
  }, options);
}

export type UpdateUrlField = {
  field_id: string,
  field_title?: string,
} & UrlFieldProperty & SheetRequestPrams

export const updateUrlField = (params:UpdateUrlField, options: GetToken) => {
  const { docid, sheet_id, field_id, field_title, ...property_url } = params;
  return update({
    docid,
    sheet_id,
    fields: [{
      field_id,
      field_title,
      field_type: FieldType.FIELD_TYPE_URL,
      property_url,
    }],
  }, options);
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
  options: Array<Option>;
}

export type AddSelectField = {
  field_title: string,
} & SelectFieldProperty & SheetRequestPrams

export const addSelectField = (params:AddSelectField, options: GetToken) => {
  const { docid, sheet_id, field_title, ...property_select } = params;
  return add({
    docid,
    sheet_id,
    fields: [{
      field_title,
      field_type: FieldType.FIELD_TYPE_SELECT,
      property_select,
    }],
  }, options);
}

export type UpdateSelectField = {
  field_id: string,
  field_title?: string,
} & SelectFieldProperty & SheetRequestPrams

export const updateSelectField = (params:UpdateSelectField, options: GetToken) => {
  const { docid, sheet_id, field_id, field_title, ...property_select } = params;
  return update({
    docid,
    sheet_id,
    fields: [{
      field_id,
      field_title,
      field_type: FieldType.FIELD_TYPE_SELECT,
      property_select,
    }],
  }, options);
}

// CreatedTimeFieldProperty & ModifiedTimeFieldProperty
export type TimeFieldProperty = {
  /**
   * 设置日期格式
   */
  format: Format;
}

export type AddCreatedTimeField = {
  field_title: string,
} & TimeFieldProperty & SheetRequestPrams

export const addCreatedTimeField = (params:AddCreatedTimeField, options: GetToken) => {
  const { docid, sheet_id, field_title, ...property_created_time } = params;
  return add({
    docid,
    sheet_id,
    fields: [{
      field_title,
      field_type: FieldType.FIELD_TYPE_CREATED_TIME,
      property_created_time,
    }],
  }, options);
}

export type UpdateCreatedTimeField = {
  field_id: string,
  field_title?: string,
} & TimeFieldProperty & SheetRequestPrams

export const updateCreatedTimeField = (params:UpdateCreatedTimeField, options: GetToken) => {
  const { docid, sheet_id, field_id, field_title, ...property_time } = params;
  return update({
    docid,
    sheet_id,
    fields: [{
      field_id,
      field_title,
      field_type: FieldType.FIELD_TYPE_CREATED_TIME,
      property_time,
    }],
  }, options);
}

export type AddModifiedTimeField = {
  field_title: string,
} & TimeFieldProperty & SheetRequestPrams

export const addModifiedTimeField = (params:AddModifiedTimeField, options: GetToken) => {
  const { docid, sheet_id, field_title, ...property_modified_time } = params;
  return add({
    docid,
    sheet_id,
    fields: [{
      field_title,
      field_type: FieldType.FIELD_TYPE_MODIFIED_TIME,
      property_modified_time,
    }],
  }, options);
}

export type UpdateModifiedTimeField = {
  field_id: string,
  field_title?: string,
} & TimeFieldProperty & SheetRequestPrams

export const updateModifiedTimeField = (params:UpdateModifiedTimeField, options: GetToken) => {
  const { docid, sheet_id, field_id, field_title, ...property_modified_time } = params;
  return update({
    docid,
    sheet_id,
    fields: [{
      field_id,
      field_title,
      field_type: FieldType.FIELD_TYPE_MODIFIED_TIME,
      property_modified_time,
    }],
  }, options);
}

// ProgressFieldProperty
export type ProgressFieldProperty = {
  /**
   * 小数位数
   */
  decimal_places: DecimalPlaces;
}

export type AddProgressField = {
  field_title: string,
} & ProgressFieldProperty & SheetRequestPrams

export const addProgressField = (params:AddProgressField, options: GetToken) => {
  const { docid, sheet_id, field_title, ...property_progress } = params;
  return add({
    docid,
    sheet_id,
    fields: [{
      field_title,
      field_type: FieldType.FIELD_TYPE_PROGRESS,
      property_progress,
    }],
  }, options);
}

export type UpdateProgressField = {
  field_id: string,
  field_title?: string,
} & ProgressFieldProperty & SheetRequestPrams

export const updateProgressField = (params:UpdateProgressField, options: GetToken) => {
  const { docid, sheet_id, field_id, field_title, ...property_progress } = params;
  return update({
    docid,
    sheet_id,
    fields: [{
      field_id,
      field_title,
      field_type: FieldType.FIELD_TYPE_PROGRESS,
      property_progress,
    }],
  }, options);
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
  options: Array<Option>;
}

export type AddSingleSelectField = {
  field_title: string,
} & SingleSelectFieldProperty & SheetRequestPrams

export const addSingleSelectField = (params:AddSingleSelectField, options: GetToken) => {
  const { docid, sheet_id, field_title, ...property_single_select } = params;
  return add({
    docid,
    sheet_id,
    fields: [{
      field_title,
      field_type: FieldType.FIELD_TYPE_SINGLE_SELECT,
      property_single_select,
    }],
  }, options);
}

export type UpdateSingleSelectField = {
  field_id: string,
  field_title?: string,
} & SingleSelectFieldProperty & SheetRequestPrams

export const updateSingleSelectField = (params:UpdateSingleSelectField, options: GetToken) => {
  const { docid, sheet_id, field_id, field_title, ...property_single_select } = params;
  return update({
    docid,
    sheet_id,
    fields: [{
      field_id,
      field_title,
      field_type: FieldType.FIELD_TYPE_SINGLE_SELECT,
      property_single_select,
    }],
  }, options);
}

// ReferenceFieldProperty
export type ReferenceFieldProperty = {
  /**
   * 关联的子表id
   */
  sub_id?: string;
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
  view_id?: string;
}

export type AddReferenceField = {
  field_title: string,
} & ReferenceFieldProperty & SheetRequestPrams

export const addReferenceField = (params:AddReferenceField, options: GetToken) => {
  const { docid, sheet_id, field_title, ...property_reference } = params;
  return add({
    docid,
    sheet_id,
    fields: [{
      field_title,
      field_type: FieldType.FIELD_TYPE_REFERENCE,
      property_reference,
    }],
  }, options);
}

export type UpdateReferenceField = {
  field_id: string,
  field_title?: string,
} & ReferenceFieldProperty & SheetRequestPrams

export const updateReferenceField = (params:UpdateReferenceField, options: GetToken) => {
  const { docid, sheet_id, field_id, field_title, ...property_reference } = params;
  return update({
    docid,
    sheet_id,
    fields: [{
      field_id,
      field_title,
      field_type: FieldType.FIELD_TYPE_REFERENCE,
      property_reference,
    }],
  }, options);
}

// LocationFieldProperty
export type LocationFieldProperty = {
  /**
   * 输入类型
   */
  input_type: LocationInputType;
}

export type AddLocationField = {
  field_title: string,
} & LocationFieldProperty & SheetRequestPrams

export const addLocationField = (params:AddLocationField, options: GetToken) => {
  const { docid, sheet_id, field_title, ...property_location } = params;
  return add({
    docid,
    sheet_id,
    fields: [{
      field_title,
      field_type: FieldType.FIELD_TYPE_LOCATION,
      property_location,
    }],
  }, options);
}

export type UpdateLocationField = {
  field_id: string,
  field_title?: string,
} & LocationFieldProperty & SheetRequestPrams

export const updateLocationField = (params:UpdateLocationField, options: GetToken) => {
  const { docid, sheet_id, field_id, field_title, ...property_location } = params;
  return update({
    docid,
    sheet_id,
    fields: [{
      field_id,
      field_title,
      field_type: FieldType.FIELD_TYPE_LOCATION,
      property_location,
    }],
  }, options);
}

// AutoNumberFieldProperty
export type AutoNumberFieldProperty = {
  /**
   * 输入类型
   */
  type: NumberType;
  /**
   * 自定义规则
   */
  rules?: Array<NumberRule>;
  /**
   * 是否应用于已有编号
   */
  reformat_existing_record: boolean;
}

export type AddAutoNumberField = {
  field_title: string,
} & AutoNumberFieldProperty & SheetRequestPrams

export const addAutoNumberField = (params:AddAutoNumberField, options: GetToken) => {
  const { docid, sheet_id, field_title, ...property_auto_number } = params;
  return add({
    docid,
    sheet_id,
    fields: [{
      field_title,
      field_type: FieldType.FIELD_TYPE_AUTONUMBER,
      property_auto_number,
    }],
  }, options);
}

export type UpdateAutoNumberField = {
  field_id: string,
  field_title?: string,
} & AutoNumberFieldProperty & SheetRequestPrams

export const updateAutoNumberField = (params:UpdateAutoNumberField, options: GetToken) => {
  const { docid, sheet_id, field_id, field_title, ...property_auto_number } = params;
  return update({
    docid,
    sheet_id,
    fields: [{
      field_id,
      field_title,
      field_type: FieldType.FIELD_TYPE_AUTONUMBER,
      property_auto_number,
    }],
  }, options);
}

// CurrencyFieldProperty
export type CurrencyFieldProperty = {
  /**
   * 输入类型
   */
  currency_type: CurrencyType;
  /**
   * 表示小数点的位数，即数字精度
   */
  decimal_places: DecimalPlaces;
  /**
   * 是否使用千位符
   */
  use_separate: boolean;
}

export type AddCurrencyField = {
  field_title: string,
} & CurrencyFieldProperty & SheetRequestPrams

export const addCurrencyField = (params:AddCurrencyField, options: GetToken) => {
  const { docid, sheet_id, field_title, ...property_currency } = params;
  return add({
    docid,
    sheet_id,
    fields: [{
      field_title,
      field_type: FieldType.FIELD_TYPE_CURRENCY,
      property_currency,
    }],
  }, options);
}

export type UpdateCurrencyField = {
  field_id: string,
  field_title?: string,
} & CurrencyFieldProperty & SheetRequestPrams

export const updateCurrencyField = (params:UpdateCurrencyField, options: GetToken) => {
  const { docid, sheet_id, field_id, field_title, ...property_currency } = params;
  return update({
    docid,
    sheet_id,
    fields: [{
      field_id,
      field_title,
      field_type: FieldType.FIELD_TYPE_CURRENCY,
      property_currency,
    }],
  }, options);
}

// WwGroupFieldProperty
export type WwGroupFieldProperty = {
  /**
   * 是否允许多个群聊
   */
  allow_multiple: boolean;
}

export type AddWwGroupField = {
  field_title: string,
} & WwGroupFieldProperty & SheetRequestPrams

export const addWwGroupField = (params:AddWwGroupField, options: GetToken) => {
  const { docid, sheet_id, field_title, ...property_ww_group } = params;
  return add({
    docid,
    sheet_id,
    fields: [{
      field_title,
      field_type: FieldType.FIELD_TYPE_WWGROUP,
      property_ww_group,
    }],
  }, options);
}

export type UpdateWwGroupField = {
  field_id: string,
  field_title?: string,
} & WwGroupFieldProperty & SheetRequestPrams

export const updateWwGroupField = (params:UpdateWwGroupField, options: GetToken) => {
  const { docid, sheet_id, field_id, field_title, ...property_ww_group } = params;
  return update({
    docid,
    sheet_id,
    fields: [{
      field_id,
      field_title,
      field_type: FieldType.FIELD_TYPE_WWGROUP,
      property_ww_group,
    }],
  }, options);
}
