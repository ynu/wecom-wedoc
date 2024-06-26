import {env} from 'node:process';
import * as cache from 'memory-cache';
import {after, describe, it} from 'node:test';
import {ok} from 'node:assert';
import {Doc, SmartSheet} from '../src';
import {
  CurrencyType,
  DecimalPlaces,
  DisplayMode,
  FieldType,
  LinkType,
  LocationInputType,
  NumberRuleType,
  NumberType,
  Style
} from '../src/smart-sheet-field';

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
  it('更新数字类型字段', async () => {
    const res = await SmartSheet.Field.updateNumberField({
      docid,
      sheet_id,
      field_id,
      field_title: '数字类型字段',
      decimal_places: DecimalPlaces.ZERO,
      use_separate: true
    }, options);
    console.log(res);
  });
  it('添加复选框类型字段', async () => {
    const res = await SmartSheet.Field.addCheckboxField({
      docid,
      sheet_id,
      field_title: 'test1',
      checked: true
    }, options);
    console.log(res);
    field_id = res[0].field_id
    field_type = res[0].field_type
  });
  it('更新复选框类型字段', async () => {
    const res = await SmartSheet.Field.updateCheckboxField({
      docid,
      sheet_id,
      field_id,
      field_title: '复选框类型字段',
      checked: false,
    }, options);
    console.log(res);
  });
  it('添加日期类型字段', async () => {
    const res = await SmartSheet.Field.addDateTimeField({
      docid,
      sheet_id,
      field_title: 'test2',
      format: 'd/m/yyyy',
      auto_fill: true,
    }, options);
    console.log(res);
    field_id = res[0].field_id
    field_type = res[0].field_type
  });
  it('更新日期类型字段', async () => {
    const res = await SmartSheet.Field.updateDateTimeField({
      docid,
      sheet_id,
      field_id,
      field_title: '日期类型字段',
      format: 'yyyy-mm-dd',
      auto_fill: false,
    }, options);
    console.log(res);
  });
  it('添加文件类型字段', async () => {
    const res = await SmartSheet.Field.addAttachmentField({
      docid,
      sheet_id,
      field_title: 'test2',
      display_mode: DisplayMode.DISPLAY_MODE_LIST,
    }, options);
    console.log(res);
    field_id = res[0].field_id
    field_type = res[0].field_type
  });
  it('更新文件类型字段', async () => {
    const res = await SmartSheet.Field.updateAttachmentField({
      docid,
      sheet_id,
      field_id,
      field_title: '文件类型字段',
      display_mode: DisplayMode.DISPLAY_MODE_GRID,
    }, options);
    console.log(res);
  });
  it('添加人员类型字段', async () => {
    const res = await SmartSheet.Field.addUserField({
      docid,
      sheet_id,
      field_title: 'test2',
      is_multiple: true,
      is_notified: true,
    }, options);
    console.log(res);
    field_id = res[0].field_id
    field_type = res[0].field_type
  });
  it('更新人员类型字段', async () => {
    const res = await SmartSheet.Field.updateUserField({
      docid,
      sheet_id,
      field_id,
      field_title: '人员类型字段',
      is_multiple: false,
      is_notified: false,
    }, options);
    console.log(res);
  });
  it('添加超链接类型字段', async () => {
    const res = await SmartSheet.Field.addUrlField({
      docid,
      sheet_id,
      field_title: 'test2',
      type: LinkType.LINK_TYPE_ICON_TEXT,
    }, options);
    console.log(res);
    field_id = res[0].field_id
    field_type = res[0].field_type
  });
  it('更新超链接类型字段', async () => {
    const res = await SmartSheet.Field.updateUrlField({
      docid,
      sheet_id,
      field_id,
      field_title: '超链接类型字段',
      type: LinkType.LINK_TYPE_PURE_TEXT,
    }, options);
    console.log(res);
  });
  it('添加多选类型字段', async () => {
    const res = await SmartSheet.Field.addSelectField({
      docid,
      sheet_id,
      field_title: 'test2',
      is_quick_add: true,
      options: [{
        // id: '1',
        text: '选项1',
        style: Style.EIGHT,
      },{
        // id: '2',
        text: '选项2',
        style: Style.FIVE,
      }]
    }, options);
    console.log(res);
    field_id = res[0].field_id
    field_type = res[0].field_type
  });
  it('更新多选类型字段', async () => {
    const res = await SmartSheet.Field.updateSelectField({
      docid,
      sheet_id,
      field_id,
      field_title: '多选类型字段',
      is_quick_add: true,
      options: [{
        id: '1',
        text: '选项11',
        style: Style.ONE,
      },{
        id: '2',
        text: '选项22',
        style: Style.TWO,
      }]
    }, options);
    console.log(res);
  });
  it('添加创建时间类型字段', async () => {
    const res = await SmartSheet.Field.addCreatedTimeField({
      docid,
      sheet_id,
      field_title: 'test2',
      format: 'yyyy"年"m"月"d"日"',
    }, options);
    console.log(res);
    field_id = res[0].field_id
    field_type = res[0].field_type
  });
  it('更新创建时间类型字段', async () => {
    const res = await SmartSheet.Field.updateCreatedTimeField({
      docid,
      sheet_id,
      field_id,
      field_title: '创建时间类型字段',
      format: 'yyyy"年"m"月"d"日"',
    }, options);
    console.log(res);
  });
  it('添加最后编辑时间类型字段', async () => {
    const res = await SmartSheet.Field.addModifiedTimeField({
      docid,
      sheet_id,
      field_title: 'test2',
      format: 'yyyy"年"m"月"d"日"',
    }, options);
    console.log(res);
    field_id = res[0].field_id
    field_type = res[0].field_type
  });
  it('更新最后编辑时间类型字段', async () => {
    const res = await SmartSheet.Field.updateModifiedTimeField({
      docid,
      sheet_id,
      field_id,
      field_title: '最后编辑时间类型字段',
      format: 'yyyy"年"m"月"d"日"',
    }, options);
    console.log(res);
  });
  it('添加进度类型字段', async () => {
    const res = await SmartSheet.Field.addProgressField({
      docid,
      sheet_id,
      field_title: 'test2',
      decimal_places: DecimalPlaces.MINUS_ONE,
    }, options);
    console.log(res);
    field_id = res[0].field_id
    field_type = res[0].field_type
  });
  it('更新进度类型字段', async () => {
    const res = await SmartSheet.Field.updateProgressField({
      docid,
      sheet_id,
      field_id,
      field_title: '进度类型字段',
      decimal_places: DecimalPlaces.ONE,
    }, options);
    console.log(res);
  });
  it('添加单选类型字段', async () => {
    const res = await SmartSheet.Field.addSingleSelectField({
      docid,
      sheet_id,
      field_title: 'test2',
      is_quick_add: true,
      options: [{
        id: '1',
        text: '选项1',
        style: Style.ONE,
      },{
        id: '2',
        text: '选项2',
        style: Style.THREE,
      }]
    }, options);
    console.log(res);
    field_id = res[0].field_id
    field_type = res[0].field_type
  });
  it('更新单选类型字段', async () => {
    const res = await SmartSheet.Field.updateSingleSelectField({
      docid,
      sheet_id,
      field_id,
      field_title: '单选类型字段',
      is_quick_add: true,
      options: [{
        id: '1',
        text: '选项11',
        style: Style.ONE,
      },{
        id: '2',
        text: '选项22',
        style: Style.SIX,
      }]
    }, options);
    console.log(res);
  });
  it('添加引用类型字段', async () => {
    const res = await SmartSheet.Field.addReferenceField({
      docid,
      sheet_id,
      field_title: 'test2',
      is_multiple: true,
      filed_id: '',
    }, options);
    console.log(res);
    field_id = res[0].field_id
    field_type = res[0].field_type
  });
  it('更新引用类型字段', async () => {
    const res = await SmartSheet.Field.updateReferenceField({
      docid,
      sheet_id,
      field_id,
      field_title: '引用类型字段',
      is_multiple: true,
      filed_id: '',
    }, options);
    console.log(res);
  });
  it('添加地理类型类型字段', async () => {
    const res = await SmartSheet.Field.addLocationField({
      docid,
      sheet_id,
      field_title: 'test2',
      input_type: LocationInputType.LOCATION_INPUT_TYPE_AUTO,
    }, options);
    console.log(res);
    field_id = res[0].field_id
    field_type = res[0].field_type
  });
  it('更新地理类型类型字段', async () => {
    const res = await SmartSheet.Field.updateLocationField({
      docid,
      sheet_id,
      field_id,
      field_title: '地理类型类型字段',
      input_type: LocationInputType.LOCATION_INPUT_TYPE_MANUAL,
    }, options);
    console.log(res);
  });
  it('添加自动编号类型字段', async () => {
    const res = await SmartSheet.Field.addAutoNumberField({
      docid,
      sheet_id,
      field_title: 'test2',
      type: NumberType.NUMBER_TYPE_INCR,
      rules: [{
        type: NumberRuleType.NUMBER_RULE_TYPE_INCR,
        value: '2'
      }],
      reformat_existing_record: false,
    }, options);
    console.log(res);
    field_id = res[0].field_id
    field_type = res[0].field_type
  });
  it('更新自动编号类型字段', async () => {
    const res = await SmartSheet.Field.updateAutoNumberField({
      docid,
      sheet_id,
      field_id,
      field_title: '自动编号类型字段',
      type: NumberType.NUMBER_TYPE_INCR,
      rules: [{
        type: NumberRuleType.NUMBER_RULE_TYPE_INCR,
        value: '2'
      }],
      reformat_existing_record: false,
    }, options);
    console.log(res);
  });
  it('添加货币类型字段', async () => {
    const res = await SmartSheet.Field.addCurrencyField({
      docid,
      sheet_id,
      field_title: 'test2',
      currency_type: CurrencyType.AED,
      decimal_places: DecimalPlaces.TWO,
      use_separate: false,
    }, options);
    console.log(res);
    field_id = res[0].field_id
    field_type = res[0].field_type
  });
  it('更新货币类型字段', async () => {
    const res = await SmartSheet.Field.updateCurrencyField({
      docid,
      sheet_id,
      field_id,
      field_title: '货币类型字段',
      currency_type: CurrencyType.USD,
      decimal_places: DecimalPlaces.THREE,
      use_separate: true,
    }, options);
    console.log(res);
  });
  it('添加群类型字段', async () => {
    const res = await SmartSheet.Field.addWwGroupField({
      docid,
      sheet_id,
      field_title: 'test2',
      allow_multiple: true,
    }, options);
    console.log(res);
    field_id = res[0].field_id
    field_type = res[0].field_type
  });
  it('更新群类型字段', async () => {
    const res = await SmartSheet.Field.updateWwGroupField({
      docid,
      sheet_id,
      field_id,
      field_title: '群类型字段',
      allow_multiple: true,
    }, options);
    console.log(res);
  });
  it('读取所有字段', async () => {
    const res = await SmartSheet.Field.fields({ docid, sheet_id }, options);
    console.log(res);
    ok(res?.length);
  });
  it('删除临时创建的文档', async () => {
    if (!TEST_DOCID) {
      await Doc.del({ docid }, options)
    }
  });
});