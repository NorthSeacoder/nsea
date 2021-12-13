/*
 * @Author: xiaodongyu
 * @Date 2019-11-29 23:27:11
 * @Last Modified by: mengpeng 
 * @Last Modified time: 2021-07-30 16:21:53 
 */

import moment from 'moment';

import DefValue from '../component/def-value';
import {boolOf} from '../util/enum';

export const merge = (...args) => Object.assign({}, ...args);

export const required = def => merge(def, {required: true});

export const primaryStaticProps = {staticProps: {class: 'yqg-text-primary'}};

export const successStaticProps = {staticProps: {class: 'yqg-text-success'}};

export const warningStaticProps = {staticProps: {class: 'yqg-text-warning'}};

export const sizeLongProps = {props: {style: {maxWidth: '100%', width: '500px'}}};

export const fixedLeft = (def, width = 20) => merge(def, {column: {fixed: 'left', width}});

export const fixedRight = (def, width = 20) => merge(def, {column: {fixed: 'right', width}});

export const getPre = prefix => suffix => `${prefix}${suffix}`;

export const clearFields = fields => ({form}) => form.setFieldsValue(fields.reduce((acc, field) => ({
    ...acc,
    [field]: undefined
}), {}));

export const getSdTextStaticProps = (checker = boolOf, success = true) => ({value}) => {
    const valid = checker(value);
    return {
        class: {
            'yqg-text-success': success && valid,
            'yqg-text-danger': !valid
        }
    };
};

export const extendsDefValue = options => ({
    extends: DefValue,
    ...options
});

export const staticComp = def => merge(def, {component: 'def-value'});

export const dateTimeDef = {type: 'date', props: {showTime: true}, filter: 'dateTime'};

export const dateTimeDayStartDef = {
    ...dateTimeDef,
    props: {showTime: {defaultValue: moment('00:00:00', 'HH:mm:ss')}}
};

export const dateTimeDayEndDef = {
    ...dateTimeDef,
    props: {showTime: {defaultValue: moment('23:59:59', 'HH:mm:ss')}}
};

export const blockItem = {itemProps: {class: 'yqg-form-item-block'}};

export const hiddenItem = {itemProps: {class: 'yqg-form-item-hidden'}};

export const rangeItem = {label: ' ', itemProps: {class: 'yqg-form-item-range'}};

export const op = {field: 'op', label: 'common.op'};

export const time = {field: 'time', label: 'common.time', filter: 'dateTime'};

export const timeCreate = {field: 'timeCreate', label: 'common.timeCreate', filter: 'dateTime'};

export const timeUpdate = {field: 'timeUpdate', label: 'common.timeUpdate', filter: 'dateTime'};

export const timeCreated = merge(timeCreate, {field: 'timeCreated'});

export const timeUpdated = merge(timeUpdate, {field: 'timeUpdated'});

export const remark = {field: 'remark', type: 'textarea', label: 'common.remark'};

export const numberCommasFixed2 = {filter: 'numberCommasFixed2'};

export const generateColumnDefs = (tableTitle, extraDefMap) => tableTitle.map(({
    value: field,
    label,
    cellFilter: filter
}) => ({
    field,
    label,
    filter,
    ...(extraDefMap && extraDefMap[field])
}));

export const getCommonOptions = ({
    tableTitle,
    rowKey = 'id',
    op: flag = true,
    extraDefMap = {},
    extraCols = [],
    ...rest
}) => ({
    rowKey,
    colDefs: [
        ...generateColumnDefs(tableTitle, extraDefMap),
        ...(flag ? [op] : []),
        ...extraCols
    ],
    ...rest
});