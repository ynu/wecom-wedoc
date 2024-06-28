import { env } from 'node:process';
import * as cache from 'memory-cache';
import { after, describe, it } from 'node:test';
import { equal, ok } from 'node:assert';
import { Doc, SmartSheet } from '../src';
import {ViewType} from '../src/smart-sheet-view';

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
let view_id: string;
describe('SmartSheet - Sheet', function() {
  after(() => cache.clear());

  it('确保docid存在', async () => {
    if (!docid) {
      // 创建新文档
      const res = await Doc.create({
        doc_type: 10,
        doc_name: 'test_api',
        // 设置了管理员才能看得到文档
        admin_users: []
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
  it('添加视图', async () => {
    const params = {
      docid,
      sheet_id,
      view_title: "测试视图",
      view_type: ViewType.VIEW_TYPE_GRID,
    }
    const res = await SmartSheet.View.add(params, options);
    view_id = res.view_id
    ok(res.view_id);
    console.log(res)
  });
  it('查询所有视图', async () => {
    const res = await SmartSheet.View.views({docid, sheet_id}, options);
    ok(res?.length);
    console.log(res);
  });
  it('修改视图', async () => {
    const params = {
      docid,
      sheet_id,
      view_id,
      view_title: "修改视图名称",
    }
    const res = await SmartSheet.View.update(params, options);
    ok(res.view_id);
    console.log(res)
  });
  it('删除视图', async () => {
    const res = await SmartSheet.View.del({ docid, sheet_id, view_ids:[view_id] }, options);
    equal(res, 0);
  });
  it('删除临时创建的文档', async () => {
    if (!TEST_DOCID) {
      await Doc.del({ docid }, options)
    }
  });
});