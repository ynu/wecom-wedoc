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
 
export const getFormInfo = async (formid, options = {}) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/get_form_info?access_token=${token}`, {
    formid,
  });
  return res.data.form_info;
}

export const createCollect = async (form_info, params = {}, options = {}) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/create_collect?access_token=${token}`, {
    ...params,
    form_info,
  });
  return res.data.formid;
}

export const share = async (params, options) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/wedoc/doc_share?access_token=${token}`, {
    ...params,
  });
  return res.data.share_url;
}

export const modifyCollect = async (oper, formid, form_info, options = {}) => {
  const token = await getToken(options);
  await axios.post(`${qyHost}/wedoc/doc_share?access_token=${token}`, {
    oper,
    formid,
    form_info,
  });
}

export const rename = async (params, new_name, options = {}) => {
  const token = await getToken(options);
  await axios.post(`${qyHost}/wedoc/rename_doc?access_token=${token}`, {
    ...params,
    new_name,
  });
}

export const del = async (params, options) => {
  const token = await getToken(options);
  await axios.post(`${qyHost}/wedoc/del_doc?access_token=${token}`, {
    ...params,
  });
}

export default {
  getFormInfo,
  createCollect,
  modifyCollect,
  share,
  rename,
  del,
}
