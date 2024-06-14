/**
 * 企业微信API-文档
 */
import axios from 'axios';
import { getToken, qyHost } from 'wecom-common';
import Debug from 'debug';
const warn = Debug('wecom-wedoc:warn');
const error = Debug('wecom-wedoc:error');
const info = Debug('wecom-wedoc:info');
const debug = Debug('wecom-wedoc:debug');

export type CreateDocProps = {
  /**
   * 空间ID
   * 若指定spaceid，则fatherid也要同时指定
   */
  spaceid?: string,

  /**
   * 父目录文件ID
   * 在根目录时为空间ID
   */
  fatherid?: string,

  /**
   * 文档类型
   * 3: 文档
   * 4: 表格
   * 10: 智能表格（目前仅支持自建应用创建）
   */
  doc_type: 3|4|10,

  /**
   * 文档名称
   * 注意：文件名最多填255个字符，超过255个字符会被截断
   */
  doc_name: string,

  /**
   * 文档管理员用户ID
   * 可选字段，指定文档管理员的userid列表
   */
  admin_users?: string[],
}

export type DeleteDocProps = {
  /**
   * 文档docid（docid、formid只能填其中一个）
   */
  docid?: string,
  /**
   * 收集表id（docid、formid只能填其中一个）
   */
  formid?: string,
}
/**
 * 新建文档 https://developer.work.weixin.qq.com/document/path/97460
 */
export const create = async (params:CreateDocProps, options: any) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/create_doc?access_token=${token}`, params);
  return res.data;
}

/**
 * 删除文档
 * https://developer.work.weixin.qq.com/document/path/97735
 */
export const del = async (params:DeleteDocProps, options: any) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/del_doc?access_token=${token}`, params);
  return res.data;
}

export const share = async (params: any, options: any) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/doc_share?access_token=${token}`, {
    ...params,
  });
  return res.data.share_url;
}

export const rename = async (params: any, new_name: any, options = {}) => {
  const token = await getToken(options);
  await axios.post(`${qyHost}/wedoc/rename_doc?access_token=${token}`, {
    ...params,
    new_name,
  });
}