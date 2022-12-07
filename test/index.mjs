import assert from 'assert';
import cache from 'memory-cache';
import {
  createCollect,
  share,
} from '../index.mjs';

const {
  CORP_ID,
  SECRET,
  TEST_FORMID,
} = process.env;

const options = {
  corpId: CORP_ID,
  secret: SECRET,
};

describe('wecom-wedoc测试', function() {
  after(() => cache.clear());
  this.timeout(100000);
  describe('收集表', () => {
    it('分享链接 share', async () => {
      const url = await share({
        formid: TEST_FORMID,
      }, options);
      assert.ok(url);
    });

    it('创建收集表 createCollect', async () => {
      const form_info = {
        form_title: 'mocha Test',
        form_question: {
          items: [{
            question_id: 1,
            title: 'test question',
            pos: 1,
            status: 1,
            reply_type: 1,
            must_reply: false,
          }],
        },
        form_setting: {
          setting_manager_range: {
            userids: ['na57'],
          },
        },
      }
      const formid = await createCollect(form_info, {}, options);
      console.log(formid);
    });
  });

  
});