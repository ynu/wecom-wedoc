/**
 * 企业微信API-文档-智能表格操作-记录
 */
import axios from 'axios';
import { getToken, qyHost } from 'wecom-common';
import Debug from 'debug';
import { CellValueKeyType, CommonRecord, SheetRequestPrams } from './smart-sheet-sheet';
const warn = Debug('wecom-wedoc:warn');
const error = Debug('wecom-wedoc:error');
const info = Debug('wecom-wedoc:info');
const debug = Debug('wecom-wedoc:debug');

/**
 * 查询视图
 * 本接口用于获取 Smartsheet 中某个子表里全部视图信息。
 * https://developer.work.weixin.qq.com/document/path/99913
 */
export const views = async (docid: string, sheet_id: string, options:any): Promise<any[]> => {
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
}, options:any) => {
  
}

/**
 * 删除视图
 */
export const del = async (params:SheetRequestPrams & { view_ids: string[] }, options:any) => {
  
}

/**
 * 更新视图
 */
export const update = async (params:SheetRequestPrams & {
  view_id: string,
  view_title?: string,
  property?: object,
}) => {
  
}
