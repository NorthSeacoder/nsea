/*
 * @Author: xiaodongyu
 * @Date 2020-02-20 20:46:42
 * @Last Modified by: mengpeng 
 * @Last Modified time: 2021-07-30 18:05:15 
 */

import {
    Badge,
    Button,
    Card,
    Col,
    ConfigProvider,
    Divider,
    Dropdown,
    Descriptions,
    Form,
    Icon,
    Input,
    Layout,
    LocaleProvider,
    Menu,
    message,
    Modal,
    notification,
    Popconfirm,
    Popover,
    Select,
    Spin,
    Tabs,
    Table,
    Upload,
    Checkbox,
    Tree,
    Rate,
    Radio,
    Row,
    Switch,
    Collapse,
    Tag,
    TreeSelect,
    InputNumber,
    DatePicker,
    TimePicker,
    Tooltip
} from 'ant-design-vue';
import VueClipboard from 'vue-clipboard2';

import DefValue from './def-value';
import Filters from '../filter';
import FieldCheckbox from './yqg-simple-form/component/field-checkbox';
import FieldMdEditor from './yqg-simple-form/component/field-md-editor';
import FieldRadio from './yqg-simple-form/component/field-radio';
import FieldRich from './yqg-simple-form/component/field-rich';
import FieldAutoComplete from './yqg-simple-form/component/field-auto-complete';
import YqgSimpleForm from './yqg-simple-form';
import YqgSimpleModal from './yqg-simple-modal';
import YqgSimpleTable from './yqg-simple-table';
import YqgStaticForm from './yqg-static-form';
import YqgInfoTable from './yqg-info-table';
import YqgInfo from './yqg-info';
import YqgCodeTextarea from './yqg-code-textarea';
import YqgMdView from './yqg-simple-form/component/field-md-editor/component/md-view';
import yqgTransfer from './yqg-transfer';
import {hasBaseUi} from './util';

import {pickValue} from '../util/object';
import {zh} from './i18n';

function globalUse(plugins) {
    const hasB = hasBaseUi();
    Object.keys(plugins).forEach(key => {
        this[`$${hasB ? 'a' : ''}${key}`] = plugins[key];
    });
}

export default {
    install(Vue) {
        [
            Badge,
            Button,
            Card,
            Col,
            ConfigProvider,
            Divider,
            Dropdown,
            Descriptions,
            Form,
            Icon,
            Input,
            Layout,
            LocaleProvider,
            Menu,
            Modal,
            Popconfirm,
            Popover,
            Select,
            Spin,
            Tabs,
            Table,
            Upload,
            Checkbox,
            Tree,
            Rate,
            Radio,
            Row,
            Switch,
            Collapse,
            Tag,
            TreeSelect,
            InputNumber,
            DatePicker,
            TimePicker,
            Tooltip
        ].forEach(plugin => Vue.use(plugin));

        const {info, success, error, warning, confirm, destroyAll} = Modal;
        globalUse.call(Vue.prototype, {
            message,
            notification,
            info,
            success,
            error,
            warning,
            confirm,
            destroyAll
        });

        Vue.use(VueClipboard);
        Vue.use(Filters);
        Vue.component('def-value', DefValue);
        Vue.component('field-checkbox', FieldCheckbox);
        Vue.component('field-md-editor', FieldMdEditor);
        Vue.component('field-radio', FieldRadio);
        Vue.component('field-rich', FieldRich);
        Vue.component('field-auto-complete', FieldAutoComplete);
        Vue.component('yqg-simple-form', YqgSimpleForm);
        Vue.component('yqg-simple-modal', YqgSimpleModal);
        Vue.component('yqg-simple-table', YqgSimpleTable);
        Vue.component('yqg-info', YqgInfo);
        Vue.component('yqg-static-form', YqgStaticForm);
        Vue.component('yqg-info-table', YqgInfoTable);
        Vue.component('yqg-md-view', YqgMdView);
        Vue.component('yqg-transfer', yqgTransfer);

        if (!Vue.component('yqg-code-textarea')) {
            Vue.component('yqg-code-textarea', YqgCodeTextarea);
        }
        Vue.prototype.$t = key => pickValue(zh, key) || key;
    }
};
