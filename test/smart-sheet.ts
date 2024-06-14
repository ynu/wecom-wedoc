import { env } from 'node:process';
import * as cache from 'memory-cache';
import { after, describe, it } from 'node:test';
import { equal, ok } from 'node:assert';
import { Doc, SmartSheet } from '../src';

const {
  CORP_ID,
  SECRET,
  TEST_DOCID,
} = env;

const options = {
  corpId: CORP_ID,
  secret: SECRET,
};

let docid = TEST_DOCID || '';
let sheet_id: string;
describe('SmartSheet - Sheet', function() {
  after(() => cache.clear());

  it('确保docid存在', async () => {
    if (!docid) {
      // 创建新文档
      const res = await Doc.create({ 
        doc_type: 10,
        doc_name: 'test_api',
      }, options);
      ok(res.docid);
      docid = res.docid;
    }
  });
  it('添加子表', async () => {
    const res = await SmartSheet.Sheet.add({ docid }, options);
    ok(res.sheet_id);
    sheet_id = res.sheet_id;
  });
  it('读取所有Sheet', async () => {
    const res = await SmartSheet.Sheet.sheets(docid, options);
    ok(res?.length);
    console.log(res);
  });
  it('删除子表', async () => {
    const res = await SmartSheet.Sheet.del({ docid, sheet_id }, options);
    equal(res, 0);
  });
  it('删除临时创建的文档', async () => {
    if (!TEST_DOCID) {
      await Doc.del({ docid }, options)
    }
  });
});