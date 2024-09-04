/**
 * 企业微信API-文档权限
 */
import axios from 'axios';
import { GetToken, getToken, qyHost } from 'wecom-common';
import Debug from 'debug';
import {GetDoc} from "./doc";
const warn = Debug('wecom-wedoc:warn');
const error = Debug('wecom-wedoc:error');
const info = Debug('wecom-wedoc:info');
const debug = Debug('wecom-wedoc:debug');

/**
 * 权限类型枚举
 */
enum AuthType {
  /**
   * 只读
   */
  ReadOnly = 1,
  /**
   * 读写
   */
  ReadWrite = 2,
}

/**
 * 文档特定部门类型枚举
 */
enum DepartmentType {
  /**
   * 部门
   */
  Department = 2,
}

/**
 * 文档特定部门权限配置
 */
export type CoAuthList = {
  /**
   * 文档查看权限特定部门id
   */
  departmentid: number;
  /**
   * 文档特定部门权限
   */
  auth: AuthType;
  /**
   * 文档特定部门类型
   */
  type: DepartmentType;
}

/**
 * 文档权限配置类型
 */
export type DocumentPermissionConfig = {
  /**
   * 操作的docid
   */
  docid: string;
  /**
   * 是否允许企业内成员浏览文档, 有值则覆盖
   */
  enable_corp_internal?: boolean;
  /**
   * 企业内成员主动查看文档后获得的权限类型, 有值则覆盖
   */
  corp_internal_auth?: AuthType;
  /**
   * 是否允许企业外成员浏览文档, 有值则覆盖
   */
  enable_corp_external?: boolean;
  /**
   * 企业外成员主浏览文档后获得的权限类型, 有值则覆盖
   */
  corp_external_auth?: AuthType;
  /**
   * 企业内成员加入文档是否必须由管理员审批，enable_corp_internal为false时，只能为true，有值则覆盖
   */
  corp_internal_approve_only_by_admin?: boolean;
  /**
   * 企业外成员加入文档是否必须由管理员审批，enable_corp_external和ban_share_external均为false时，该参数只能为true，有值则覆盖
   */
  corp_external_approve_only_by_admin?: boolean;
  /**
   * 是否禁止文档分享到企业外, 有值则覆盖
   */
  ban_share_external?: boolean;
  /**
   * 是否更新文档查看权限的特定部门, true时更新特定部门列表
   */
  update_co_auth_list?: boolean;
  /**
   * 需要更新文档查看权限特定部门时, 覆盖之前部门, 特别的: 列表为空则清空
   */
  co_auth_list?: CoAuthList[];
}

/**
 * 文档通知范围配置类型
 */
export type DocumentNotificationConfig = GetDoc & {
  /**
   * 更新文档通知范围的列表， 批次大小最大100
   */
  update_file_member_list?: UpdateFileMember[];
  /**
   * 删除的文档通知范围列表，批次大小最大一百
   */
  del_file_member_list?: DelFileMember[];
}

/**
 * 更新文档通知范围的列表
 */
export type UpdateFileMember = {
  /**
   * 文档通知范围的类型 1:用户。文档通知范围仅支持按人配置
   */
  type: number;
  /**
   * 文档通知范围内人员获得的权限 1:只读权限 2:读写权限（目前仅智能表可设置为读写权限） 7:管理员权限，文档管理员最多三个
   */
  auth: number;
  /**
   * 企业内成员的ID
   */
  userid?: string;
  /**
   * 外部用户临时id。同一个用户在不同的文档中返回的该id不一致。
   */
  tmp_external_userid?: string;
}

/**
 * 删除的文档通知范围列表
 */
export type DelFileMember = {
  /**
   * 文档通知范围的类型 1:用户。文档通知范围仅支持按人配置
   */
  type: number;
  /**
   * 企业内成员的ID
   */
  userid?: string;
  /**
   * 外部用户临时id。同一个用户在不同的文档中返回的该id不一致。
   */
  tmp_external_userid?: string;
}

/**
 * 水印设置
 */
interface WatermarkSettings {
  /**
   * 水印疏密度，1:稀疏，2:紧密
   */
  margin_type?: number;
  /**
   * 是否展示访问者名字水印，有值则覆盖
   */
  show_visitor_name?: boolean;
  /**
   * 是否展示文本水印，有值则覆盖
   */
  show_text?: boolean;
  /**
   * 文字水印的文字，有值则覆盖
   */
  text?: string;
}

/**
 * 文档安全设置
 */
export type DocumentSaftyConfig = GetDoc & {
  /**
   * 是否允许只读成员复制、下载文档，有值则覆盖
   */
  enable_readonly_copy?: boolean;
  /**
   * 水印设置
   */
  watermark?: WatermarkSettings;
}


/**
 * 获取文档权限信息
 * https://developer.work.weixin.qq.com/document/path/97461
 */
export const getAuth = async (params:GetDoc, options: GetToken) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/doc_get_auth?access_token=${token}`, params);
  return res.data;
}

/**
 * 修改文档查看规则
 * https://developer.work.weixin.qq.com/document/path/97778
 */
export const modDocJoinRule = async (params:DocumentPermissionConfig, options: GetToken) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/mod_doc_join_rule?access_token=${token}`, params);
  return res.data;
}

/**
 * 修改文档通知范围及权限
 * https://developer.work.weixin.qq.com/document/path/97781
 */
export const modDocMember = async (params:DocumentNotificationConfig, options: GetToken) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/mod_doc_member?access_token=${token}`, params);
  return res.data;
}

/**
 * 修改文档安全设置
 * https://developer.work.weixin.qq.com/document/path/97782
 */
export const modDocSaftySetting = async (params:DocumentSaftyConfig, options: GetToken) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/mod_doc_safty_setting?access_token=${token}`, params);
  return res.data;
}