/**
 * 企业微信API-文档-智能表格操作-记录
 */
import axios from 'axios';
import {GetToken, getToken, qyHost, WecomError} from 'wecom-common';
import Debug from 'debug';
import { SheetRequestPrams } from './smart-sheet-sheet';
const warn = Debug('wecom-wedoc:warn');
const error = Debug('wecom-wedoc:error');
const info = Debug('wecom-wedoc:info');
const debug = Debug('wecom-wedoc:debug');

/**
 * 定义字段类型的枚举
 */
export enum ViewType {
  /**
   * 网格视图
   */
  VIEW_TYPE_GRID = 'VIEW_TYPE_GRID',
  /**
   * 看板视图
   */
  VIEW_TYPE_KANBAN = 'VIEW_TYPE_KANBAN',
  /**
   * 画册视图
   */
  VIEW_TYPE_GALLERY = 'VIEW_TYPE_GALLERY',
  /**
   * 甘特视图
   */
  VIEW_TYPE_GANTT = 'VIEW_TYPE_GANTT',
  /**
   * 日历视图
   */
  VIEW_TYPE_CALENDAR = 'VIEW_TYPE_CALENDAR',
  /**
   * 未知类型视图，传递该值不合法
   */
  VEW_UNKNOWN = 'VEW_UNKNOWN',
}

/**
 * 筛选值判断操作类型
 */
export enum Operator {
  /**
   * 未知
   */
  OPERATOR_UNKNOWN = "OPERATOR_UNKNOWN",
  /**
   * 等于
   */
  OPERATOR_IS = "OPERATOR_IS",
  /**
   * 不等于
   */
  OPERATOR_IS_NOT = "OPERATOR_IS_NOT",
  /**
   * 包含
   */
  OPERATOR_CONTAINS = "OPERATOR_CONTAINS",
  /**
   * 不包含
   */
  OPERATOR_DOES_NOT_CONTAIN = "OPERATOR_DOES_NOT_CONTAIN",
  /**
   * 大于
   */
  OPERATOR_IS_GREATER = "OPERATOR_IS_GREATER",
  /**
   * 大于或等于
   */
  OPERATOR_IS_GREATER_OR_EQUAL = "OPERATOR_IS_GREATER_OR_EQUAL",
  /**
   * 小于
   */
  OPERATOR_IS_LESS = "OPERATOR_IS_LESS",
  /**
   * 小于或等于
   */
  OPERATOR_IS_LESS_OR_EQUAL = "OPERATOR_IS_LESS_OR_EQUAL",
  /**
   * 为空
   */
  OPERATOR_IS_EMPTY = "OPERATOR_IS_EMPTY",
  /**
   * 不为空
   */
  OPERATOR_IS_NOT_EMPTY = "OPERATOR_IS_NOT_EMPTY"
}

/**
 * 日期类型
 */
export enum DateTimeType {
  /**
   * 具体时间
   */
  DATE_TIME_TYPE_DETAIL_DATE = "DATE_TIME_TYPE_DETAIL_DATE",

  /**
   * 具体时间范围
   */
  DATE_TIME_TYPE_DETAIL_DATE_RANGE = "DATE_TIME_TYPE_DETAIL_DATE_RANGE",

  /**
   * 今天
   */
  DATE_TIME_TYPE_TODAY = "DATE_TIME_TYPE_TODAY",

  /**
   * 明天
   */
  DATE_TIME_TYPE_TOMORROW = "DATE_TIME_TYPE_TOMORROW",

  /**
   * 昨天
   */
  DATE_TIME_TYPE_YESTERDAY = "DATE_TIME_TYPE_YESTERDAY",

  /**
   * 本周
   */
  DATE_TIME_TYPE_CURRENT_WEEK = "DATE_TIME_TYPE_CURRENT_WEEK",

  /**
   * 上周
   */
  DATE_TIME_TYPE_LAST_WEEK = "DATE_TIME_TYPE_LAST_WEEK",

  /**
   * 本月
   */
  DATE_TIME_TYPE_CURRENT_MONTH = "DATE_TIME_TYPE_CURRENT_MONTH",

  /**
   * 过去 7 天内
   */
  DATE_TIME_TYPE_THE_PAST_7_DAYS = "DATE_TIME_TYPE_THE_PAST_7_DAYS",

  /**
   * 接下来 7 天内
   */
  DATE_TIME_TYPE_THE_NEXT_7_DAYS = "DATE_TIME_TYPE_THE_NEXT_7_DAYS",

  /**
   * 上月
   */
  DATE_TIME_TYPE_LAST_MONTH = "DATE_TIME_TYPE_LAST_MONTH",

  /**
   * 过去 30 天内
   */
  DATE_TIME_TYPE_THE_PAST_30_DAYS = "DATE_TIME_TYPE_THE_PAST_30_DAYS",

  /**
   * 接下来 30 天内
   */
  DATE_TIME_TYPE_THE_NEXT_30_DAYS = "DATE_TIME_TYPE_THE_NEXT_30_DAYS"
}

/**
 * 视图ID类型
 */
export type ViewRequestPrams = {
  /**
   * 视图ID
   */
  view_id?: string,
}

/**
 * 视图ID数组类型
 */
export type ViewsRequestPrams = {
  /**
   * 视图ID数组
   */
  view_ids: string[],
}

/**
 * 查询视图类型
 */
export type QueryParams = ViewRequestPrams & SheetRequestPrams

/**
 * 删除视图类型
 */
export type DelParams = ViewsRequestPrams & SheetRequestPrams

/**
 * 甘特和日历类型,用于视图添加
 */
export type GanttAndCalendartViewProperty = {
  /**
   * 时间条起点字段ID，只允许日期类型(FIELD_TYPE_DATE_TIME)的字段ID
   */
  start_date_field_id: string,
  /**
   * 时间条终点字段ID，只允许日期类型(FIELD_TYPE_DATE_TIME)的字段ID
   */
  end_date_field_id: string,
}

/**
 * 添加视图类型
 */
export type AddParams = {
  /**
   * 视图标题
   */
  view_title: string,
  /**
   * 视图类型
   */
  view_type: ViewType,
  /**
   * 甘特视图属性,添加甘特图时必填
   */
  property_gantt?: GanttAndCalendartViewProperty,
  /**
   * 日历视图属性，添加日历视图时必填
   */
  property_calendar?: GanttAndCalendartViewProperty,
} & SheetRequestPrams

/**
 * 视图的排序/过滤/分组配置,用于更新视图
 */
export type ViewProperty = {
  /**
   * 记录变更后自动重新排序
   */
  auto_sort?: boolean,
  /**
   * 排序设置
   */
  sort_spec?: SortSpec,
  /**
   * 分组设置
   */
  group_spec?: GroupSpec,
  /**
   * 过滤设置
   */
  filter_spec?: FilterSpec,
  /**
   * 是否使用数据统计
   */
  is_field_stat_enabled?: boolean,
  /**
   * 类似map。 key为字段ID, value为布尔值表示是否显示
   */
  field_visibility?: object,
  /**
   * 冻结列数量，从首列开始
   */
  frozen_field_count?: number,
}

/**
 * 排序设置
 */
export type SortSpec = {
  /**
   * 参与排序的字段列表
   */
  sort_infos: [{
    /**
     * 字段id
     */
    field_id: string,
    /**
     * 是否降序
     */
    desc: boolean,
  }]
}

/**
 * 分组设置
 */
export type GroupSpec = {
  /**
   * 参与分组的字段列表
   */
  sort_infos: [{
    /**
     * 字段id
     */
    field_id: string,
    /**
     * 是否降序
     */
    desc: boolean,
  }]
}

/**
 * 过滤设置
 */
export type FilterSpec = {
  /**
   * 多个conditions之间是以and(CONJUNCTION_AND)还是or(CONJUNCTION_OR)进行组合
   */
  conjunction: "CONJUNCTION_AND" | "CONJUNCTION_OR",
  /**
   * 判断条件
   */
  conditions: Condition[]
}

/**
 * 判断条件,用于更新视图-过滤设置
 */
export type Condition = {
  /**
   * 字段ID
   */
  field_id: string,
  /**
   * 判断类型
   */
  operator: Operator,
  /**
   * 文本、网址、电话、邮箱、地理位置、关联、单选、多选等列类型使用。关联列为记录ID；选项列为选项ID；其它为文本值
   */
  string_value?: {
    /**
     * 值
     */
    value: string[]
  },
  /**
   * 数字、进度列类型使用
   */
  number_value?: {
    /**
     * 值
     */
    value: number
  },
  /**
   * 复选框列类型使用
   */
  bool_value?: {
    /**
     * 值
     */
    value: boolean
  },
  /**
   * 人员、创建人、最后编辑人列类型使用，值为成员ID
   */
  user_value?: {
    /**
     * id
     */
    value: string[]
  },
  /**
   * 日期、创建时间、最后编辑时间列类型使用
   */
  date_time_value?: FilterDataTimeValue,
}

/**
 * 日期、创建时间、最后编辑时间列类型使用
 */
export type FilterDataTimeValue = {
  type: DateTimeType,
  /**
   * 具体日期值，type为具体日期(DATE_TIME_TYPE_DETAIL_DATE)或具体日期范围(DATE_TIME_TYPE_DETAIL_DATE_RANGE)时必填
   */
  value: string[]
}

/**
 * 更新视图类型
 */
export type UpdateParams = {
  /**
   * 视图标题
   */
  view_title?: string,
  /**
   * 视图的排序/过滤/分组配置
   */
  property?: ViewProperty,
} & ViewRequestPrams & SheetRequestPrams



/**
 * 查询视图
 * 本接口用于获取 Smartsheet 中某个子表里全部视图信息。
 * https://developer.work.weixin.qq.com/document/path/99913
 */
export const views = async (params: QueryParams, options: GetToken): Promise<any[]> => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/get_views?access_token=${token}`, params);
  return res.data?.views;
}

/**
 * 添加视图
 */
export const add = async (params: AddParams, options: GetToken) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/add_view?access_token=${token}`, params);
  if (res.data.errcode) throw new WecomError(res.data.errcode, res.data.errmsg);
  return res.data?.view;
}

/**
 * 删除视图
 */
export const del = async (params: DelParams, options: GetToken) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/delete_views?access_token=${token}`, params);
  if (res.data.errcode) throw new WecomError(res.data.errcode, res.data.errmsg);
  return 0;
}

/**
 * 更新视图
 * https://developer.work.weixin.qq.com/document/path/99902
 */
export const update = async (params: UpdateParams, options: GetToken) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/update_view?access_token=${token}`, params);
  if (res.data.errcode) throw new WecomError(res.data.errcode, res.data.errmsg);
  return res.data?.view;
}
