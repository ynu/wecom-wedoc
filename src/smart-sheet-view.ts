/**
 * 企业微信API-文档-智能表格操作-记录
 */
import axios from 'axios';
import {GetToken, getToken, qyHost, WecomError} from 'wecom-common';
import Debug from 'debug';
import { CellValueKeyType, CommonRecord, SheetRequestPrams } from './smart-sheet-sheet';
import {FieldType} from "./smart-sheet-field";
const warn = Debug('wecom-wedoc:warn');
const error = Debug('wecom-wedoc:error');
const info = Debug('wecom-wedoc:info');
const debug = Debug('wecom-wedoc:debug');

// 定义字段类型的枚举
export enum ViewType {
  // 网格视图
  VIEW_TYPE_GRID = 'VIEW_TYPE_GRID',
  // 看板视图
  VIEW_TYPE_KANBAN = 'VIEW_TYPE_KANBAN',
  // 画册视图
  VIEW_TYPE_GALLERY = 'VIEW_TYPE_GALLERY',
  // 甘特视图
  VIEW_TYPE_GANTT = 'VIEW_TYPE_GANTT',
  // 日历视图
  VIEW_TYPE_CALENDAR = 'VIEW_TYPE_CALENDAR',
  // 未知类型视图，传递该值不合法
  VEW_UNKNOWN = 'VEW_UNKNOWN',
}

/**
 * 查询视图
 * 本接口用于获取 Smartsheet 中某个子表里全部视图信息。
 * https://developer.work.weixin.qq.com/document/path/99913
 */
export const views = async (docid: string, sheet_id: string, options: GetToken): Promise<any[]> => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/get_views?access_token=${token}`, {
    docid,
    sheet_id,
  });
  return res.data?.views;
}

/**
 * 添加视图
 */
export const add = async (params: SheetRequestPrams & {
  view_title: string,
  view_type: string,
  property_gantt?: object,
  property_calendar?: object,
}, options: GetToken) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/add_view?access_token=${token}`, params);
  if (res.data.errcode) throw new WecomError(res.data.errcode, res.data.errmsg);
  return res.data?.view;
}

/**
 * 删除视图
 */
export const del = async (params:SheetRequestPrams & { view_ids: string[] }, options: GetToken) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/delete_views?access_token=${token}`, params);
  if (res.data.errcode) throw new WecomError(res.data.errcode, res.data.errmsg);
  return 0;
}

/**
 * 更新视图
 * https://developer.work.weixin.qq.com/document/path/99902
 */
export const update = async (params:SheetRequestPrams & {
  view_id: string,
  view_title?: string,
  property?: object,
}, options: GetToken) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/update_view?access_token=${token}`, params);
  if (res.data.errcode) throw new WecomError(res.data.errcode, res.data.errmsg);
  return res.data?.view;
}
