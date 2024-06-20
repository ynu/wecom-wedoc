import {env} from 'node:process';
import * as cache from 'memory-cache';
import {after, describe, it} from 'node:test';
import {ok} from 'node:assert';
import {Doc, SmartSheet} from '../src';
import {FieldType} from '../src/smart-sheet-field';

const {
  CORP_ID,
  SECRET,
  TEST_DOCID,
  TEST_SHEETID,
  TEST_FIELDID,
} = env;

const options = {
  corpId: CORP_ID,
  secret: SECRET,
};

let docid = TEST_DOCID || '';
let sheet_id = TEST_SHEETID || '';
let field_id: string = TEST_FIELDID || '';
let field_type = FieldType.FIELD_TYPE_TEXT;
describe('SmartSheet - Field', function() {
  after(() => cache.clear());

  it('确保docid存在', async () => {
    if (!docid) {
      const res = await Doc.create({
        doc_type: 10,
        doc_name: 'test',
        // 设置了管理员才能看得到文档
        admin_users: []
      }, options);
      docid = res.docid;
      console.log("docid: ", docid)
      console.log("url: ", res.url)
    }
  });
  it('确保sheet_id存在', async () => {
    if (!sheet_id) {
      const res = await SmartSheet.Sheet.add({ docid }, options);
      console.log("sheet_id: ", sheet_id)
      sheet_id = res.sheet_id
      ok(res.sheet_id);
    }
  });
  it('添加字段', async () => {
    const res = await SmartSheet.Field.add({
      docid,
      sheet_id,
      fields: [{
        field_title: 'test',
        field_type: FieldType.FIELD_TYPE_TEXT,
      }],
    }, options);
    console.log(res);
    field_id = res[0].field_id
    field_type = res[0].field_type
  });
  it('读取所有字段', async () => {
    const res = await SmartSheet.Field.fields({ docid, sheet_id }, options);
    console.log(res);
    ok(res?.length);
  });
  it('更新字段', async () => {
    const res = await SmartSheet.Field.update({
      docid,
      sheet_id,
      fields: [{
        field_id,
        field_title: 'test7',
        field_type
      }],
    }, options);
    console.log(res);
  });
  it('删除字段', async () => {
    const res = await SmartSheet.Field.del({
      docid,
      sheet_id,
      field_ids: [field_id],
    }, options);
    console.log(res);
  });
  it('删除临时创建的文档', async () => {
    if (!TEST_DOCID) {
      await Doc.del({ docid }, options)
    }
  });
});