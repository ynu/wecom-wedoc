/**
 * 企业微信API-文档-智能表格操作
 */
import axios from 'axios';
import { GetToken, WecomError, getToken, qyHost } from 'wecom-common';
import Debug from 'debug';
import { DocRequestParams } from './doc';
const warn = Debug('wecom-wedoc:warn');
const error = Debug('wecom-wedoc:error');
const info = Debug('wecom-wedoc:info');
const debug = Debug('wecom-wedoc:debug');

/**
 * 用于查询Sheet的请求参数结构
 */
export type SheetRequestPrams = {
  sheet_id: string,
} & DocRequestParams

export type AddSheet = {
  properties?: {
    title?: string,
    index?: number,
  },
} & DocRequestParams

export type UpdateSheet = {
  properties: {
    sheet_id: string,
    title: string,
  },
} & DocRequestParams

/**
* 查询子表
* 本接口用于查询一篇在线表格中全部智能表信息。
* @see https://developer.work.weixin.qq.com/document/path/99911
* @returns 
*/
export const sheets = async (docid: string, options: GetToken): Promise<any[]> => {
 const token = await getToken(options);
 const res = await axios.post(`${qyHost}/wedoc/smartsheet/get_sheet?access_token=${token}`, {
   docid,
 });
 if (res.data.errcode) throw new WecomError(res.data.errcode, res.data.errmsg);
 return res.data?.sheet_list;
}

/**
 * 添加子表
 * 本接口用于在表格的某个位置添加一个智能表，该智能表不存在视图、记录和字段，可以使用 API 在该智能表中添加视图、记录和字段。
 * @see https://developer.work.weixin.qq.com/document/path/99896
 */
export const add = async (params: AddSheet, options: GetToken): Promise<any> => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/add_sheet?access_token=${token}`, params);
  return res.data?.properties;
}

/**
 * 删除子表
 */
export const del = async (params: SheetRequestPrams, options: GetToken) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/delete_sheet?access_token=${token}`, params);
  if (res.data.errcode) throw new WecomError(res.data.errcode, res.data.errmsg);
  return 0;
}

/**
 * 更新子表
 * 用于修改表格中某个子表的标题
 */
export const update = async(params: UpdateSheet, options: any) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/smartsheet/update_sheet?access_token=${token}`, params);
  if (res.data.errcode) throw new WecomError(res.data.errcode, res.data.errmsg);
  return 0;
}