/*
 * @Author: ruiwang
 * @Date: 2019-11-18 17:12:55
 * @Last Modified by: ruiwang
 * @Last Modified time: 2021-06-11 14:58:19
 */

import DefType from '../../../constant/def-type';
import FieldFile from '../component/field-file';
import FieldCode from '../component/field-code';
import FieldSql from '../component/field-sql';
import FieldButtonGroup from '../component/field-button-group';
import FieldInput from '../component/field-input';
import FieldSelect from '../component/field-select';
import FieldTree from '../component/field-tree';

const getContainer = (trigger, dialogContext) => (dialogContext ? trigger.parentNode : document.body);

export const defaultPropsMap = {
    [DefType.select]: {
        placeholder: 'common.pleaseSelect',
        allowClear: true,
        showSearch: true,
        optionFilterProp: 'pinyin',
        getPopupContainer: getContainer
    },
    [DefType.dateTime]: {
        showTime: true,
        getCalendarContainer: getContainer
    },
    [DefType.date]: {
        getCalendarContainer: getContainer
    },
    [DefType.time]: {
        getPopupContainer: getContainer
    },
    [DefType.tree]: {
        placeholder: 'common.pleaseSelect',
        allowClear: true,
        showSearch: true,
        treeDefaultExpandAll: true,
        dropdownStyle: {maxHeight: '400px', overflow: 'auto'},
        treeNodeFilterProp: 'title'
    },
    [DefType.color]: {
        type: 'color'
    }
};

export default {
    [DefType.text]: FieldInput,
    [DefType.textarea]: 'a-textarea',
    [DefType.number]: 'a-input-number',
    [DefType.date]: 'a-date-picker',
    [DefType.dateTime]: 'a-date-picker',
    [DefType.dateRange]: 'a-range-picker',
    [DefType.time]: 'a-time-picker',
    [DefType.month]: 'a-month-picker',
    [DefType.switch]: 'a-switch',
    [DefType.select]: FieldSelect,
    [DefType.tree]: FieldTree,
    [DefType.checkbox]: 'field-checkbox',
    [DefType.radio]: 'field-radio',
    [DefType.file]: FieldFile,
    [DefType.code]: FieldCode,
    [DefType.sql]: FieldSql,
    [DefType.buttonGroup]: FieldButtonGroup,
    [DefType.markdown]: 'field-md-editor',
    [DefType.rich]: 'field-rich',
    [DefType.autoComplete]: 'field-auto-complete'
};
