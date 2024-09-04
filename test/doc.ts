import { env } from 'node:process';
import * as cache from 'memory-cache';
import {
  Doc,DocAuth,
  createCollect,
} from '../src/index';
// import { after, describe, it } from 'node:test';
import { equal, ok } from 'node:assert';

const {
  CORP_ID,
  SECRET,
  TEST_FORMID,
} = env;

const options = {
  corpId: CORP_ID,
  secret: SECRET,
};

describe('wecom-wedoc测试', function() {
  after(() => cache.clear());

  let docid: string;

  // it('获取文档权限信息', async () => {
  //   // docid = ''
  //   const res = await DocAuth.getAuth({
  //     docid: docid
  //   }, options);
  //   console.log(res)
  //   ok(res.errmsg == 'ok');
  // });

  // it('修改文档查看规则', async () => {
  //   docid = ''
  //   const res = await DocAuth.modDocJoinRule({
  //     docid: docid,
  //     enable_corp_internal: true,
  //     corp_internal_auth: 1
  //   }, options);
  //   console.log(res)
  //   ok(res.errmsg == 'ok');
  // });

  // it('修改文档通知范围及权限', async () => {
  //   docid = 'dclKx0vfLu2C0lS0K9cmnH-LhSWfTtLuygtvIZaI_c_L3nJ7v5UYJir41nU3wNHel-AP8AZy3P3v-N6_KgIv-y8w'
  //   const res = await DocAuth.modDocMember({
  //     docid: docid,
  //     update_file_member_list: [{
  //       "type":1,
  //       "auth":2,
  //       "userid":"1540010001"
  //     }]
  //   }, options);
  //   console.log(res)
  //   ok(res.errmsg == 'ok');
  // });

  // it('修改文档安全设置', async () => {
  //   docid = ''
  //   const res = await DocAuth.modDocSaftySetting({
  //     docid: docid,
  //     enable_readonly_copy: true
  //   }, options);
  //   console.log(res)
  //   ok(res.errmsg == 'ok');
  // });


  // it('创建文档', async () => {
  //   const res = await Doc.create({
  //     doc_type: 10,
  //     doc_name: 'API测试智能表格（勿删）',
  //     admin_users: ['na57'],
  //   }, options);
  //   ok(res.url);
  //   ok(res.docid);
  //   docid = res.docid;
  // });
  // it('删除文档', async () => {
  //   const res = await Doc.del({
  //     docid,
  //   }, options);
  //   equal(res.errcode, 0);
  // });
  //
  // describe('收集表', () => {
  //   it('分享链接 share', async () => {
  //     const url = await Doc.share({
  //       formid: TEST_FORMID,
  //     }, options);
  //     ok(url);
  //   });
  //
  //   it('创建收集表 createCollect', async () => {
  //     const form_info = {
  //       form_title: 'mocha Test',
  //       form_question: {
  //         items: [{
  //           question_id: 1,
  //           title: 'test question',
  //           pos: 1,
  //           status: 1,
  //           reply_type: 1,
  //           must_reply: false,
  //         }],
  //       },
  //       form_setting: {
  //         setting_manager_range: {
  //           userids: ['na57'],
  //         },
  //       },
  //     }
  //     const formid = await createCollect(form_info, {}, options);
  //     console.log(formid);
  //   });
  // });

  
});