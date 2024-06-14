// import { env } from 'node:process';
// import * as cache from 'memory-cache';
// import {
//   create,
//   createCollect,
//   share,
//   del,
// } from '../src/index';
// import { after, describe, it } from 'node:test';
// import { equal, ok } from 'node:assert';

// const {
//   CORP_ID,
//   SECRET,
//   TEST_FORMID,
// } = env;

// const options = {
//   corpId: CORP_ID,
//   secret: SECRET,
// };

// describe('wecom-wedoc测试', function() {
//   after(() => cache.clear());

//   let docid: string;
//   it('创建文档', async () => {
//     const res = await create({
//       doc_type: 10,
//       doc_name: 'API测试智能表格（勿删）',
//       admin_users: ['na57'],
//     }, options);
//     ok(res.url);
//     ok(res.docid);
//     docid = res.docid;
//   });
//   it('删除文档', async () => {
//     const res = await del({
//       docid,
//     }, options);
//     equal(res.errcode, 0);
//   });

//   // describe('收集表', () => {
//   //   it('分享链接 share', async () => {
//   //     const url = await share({
//   //       formid: TEST_FORMID,
//   //     }, options);
//   //     ok(url);
//   //   });

//   //   it('创建收集表 createCollect', async () => {
//   //     const form_info = {
//   //       form_title: 'mocha Test',
//   //       form_question: {
//   //         items: [{
//   //           question_id: 1,
//   //           title: 'test question',
//   //           pos: 1,
//   //           status: 1,
//   //           reply_type: 1,
//   //           must_reply: false,
//   //         }],
//   //       },
//   //       form_setting: {
//   //         setting_manager_range: {
//   //           userids: ['na57'],
//   //         },
//   //       },
//   //     }
//   //     const formid = await createCollect(form_info, {}, options);
//   //     console.log(formid);
//   //   });
//   // });

  
// });