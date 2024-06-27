import {env} from 'node:process';
import * as cache from 'memory-cache';
import {after, describe, it} from 'node:test';
import {ok, equal} from 'node:assert';
import {Doc, SmartSheet} from '../src';
import {DecimalPlaces, FieldType} from '../src/smart-sheet-field';
import {CellValueKeyType} from '../src/smart-sheet-sheet';

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
let record_id: string = TEST_FIELDID || '';
let field_type = FieldType.FIELD_TYPE_TEXT;
describe('SmartSheet - Record', function() {
  after(() => cache.clear());

  it('确保docid存在', async () => {
    if (!docid) {
      const res = await Doc.create({
        doc_type: 10,
        doc_name: 'test2',
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
  it('添加数字类型字段', async () => {
    const res = await SmartSheet.Field.addNumberField({
      docid,
      sheet_id,
      field_title: 'test1',
      decimal_places: DecimalPlaces.MINUS_ONE,
      use_separate: true
    }, options);
    console.log(res);
    field_id = res[0].field_id
    field_type = res[0].field_type
  });
  it('添加复选框类型字段', async () => {
    const res = await SmartSheet.Field.addCheckboxField({
      docid,
      sheet_id,
      field_title: 'test3',
      checked: true
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
  it('添加记录', async () => {
    const res = await SmartSheet.Record.add({
      docid,
      sheet_id,
      key_type: CellValueKeyType.CELL_VALUE_KEY_TYPE_FIELD_TITLE,
      records: [{
        values: {
          test: [{
            type: "text",
            text: "文本内容"
          }],
          test1: 3.3,
          test3: true,
        }
      }]
    }, options);
    console.log("records:", res[0]);
    record_id = res[0].record_id
    ok(res?.length);
  });
  it('更新记录', async () => {
    const res = await SmartSheet.Record.update({
      docid,
      sheet_id,
      key_type: CellValueKeyType.CELL_VALUE_KEY_TYPE_FIELD_TITLE,
      records: [{
        record_id: record_id,
        values: {
          test: [{
            type: "text",
            text: "文本内容2"
          }],
          test1: 3.32,
          test3: true,
        }
      }]
    }, options);
    console.log("records:", res[0]);
    record_id = res[0].record_id
    ok(res?.length);
  });
  it('查询记录', async () => {
    const res = await SmartSheet.Record.records({
      docid,
      sheet_id,
      offset: 0,
      limit: 1,
      key_type: CellValueKeyType.CELL_VALUE_KEY_TYPE_FIELD_TITLE,
    }, options);
    console.log("records:", res);
    ok(res?.length);
  });
  it('删除记录', async () => {
    const res = await SmartSheet.Record.del({
      docid,
      sheet_id,
      record_ids: [record_id]
    }, options);
    equal(res, 0)
  });
  it('删除临时创建的文档', async () => {
    if (!TEST_DOCID) {
      await Doc.del({ docid }, options)
    }
  });
});