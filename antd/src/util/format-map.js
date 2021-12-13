/*
 * @Author: xiaodongyu
 * @Date 2019-12-12 11:35:18
 * @Last Modified by:   wenxiujiang
 * @Last Modified time: 2020-08-03 11:55:35
 */
import moment from 'moment';
import {boolOf, valueOf} from './enum';

const listSeparator = '\n';

// ListBrList 展示textarea, 接口要List
const list = {
    format: val => val && val.join(listSeparator),
    unformat: val => (val ? val.trim().split(listSeparator) : undefined)
};

// CommaBrComma 展示textarea, 接口要CommaString
const comma = {
    format: val => val && val.split(',').join(listSeparator),
    unformat: val => val
        && val
            .trim()
            .split(listSeparator)
            .join(',')
};

// ListBrJsonList 展示textarea, 接口要JsonList, 多用于查询条件，不支持编辑
const listJson = {
    ...list,
    unformat: val => val && JSON.stringify(val.trim().split(listSeparator))
};

// BooleanEnumBoolean 展示enum, 接口要boolean
const boolean = {
    format: valueOf,
    unformat: boolOf
};

const bool = {
    format: val => ((!!val || val === false) ? `${val}` : undefined),
    unformat: val => (typeof val !== 'string' ? undefined : val === 'true')
};

// CommaListComma 展示enum, 接口要CommaString
const listComma = {
    format: val => val && val.trim().split(','),
    unformat: val => val && val.join(',')
};

// ObjectJsonObject 展示textarea, 接口要Object
const json = {
    format: val => {
        try {
            return JSON.stringify(val, null, 2);
        } catch (err) {
            return val;
        }
    },
    unformat: val => {
        try {
            return JSON.parse(val);
        } catch (err) {
            return val;
        }
    }
};

// StringMomentString 财务相关接口要 DateString
const date = {
    format: val => {
        if (!val) return val;
        if (Array.isArray(val)) {
            return val.map(item => (moment(item).valueOf()));
        }
        return (moment(val).valueOf());
    },
    unformat: val => {
        if (!val) return val;
        if (Array.isArray(val)) {
            return val.map(item => moment(item).format('YYYY-MM-DD'));
        }
        return moment(val).format('YYYY-MM-DD');
    }
};
const dateTime = {
    format: val => {
        if (!val) return val;
        if (Array.isArray(val)) {
            return val.map(item => moment(item).valueOf());
        }
        return moment(val).valueOf();
    },
    unformat: val => {
        if (!val) return val;
        if (Array.isArray(val)) {
            return val.map(item => moment(item).format('YYYY-MM-DD HH:mm:ss'));
        }
        return moment(val).format('YYYY-MM-DD HH:mm:ss');
    }
};

const percent = {
    format: val => {
        if (!val) return val;

        const res = val * 100;
        return !isNaN(res) ? res : val;
    },
    unformat: val => {
        if (!val) return val;

        const res = val / 100;
        return !isNaN(res) ? res : val;
    }
};

const FormatMap = {
    boolean,
    bool,
    list,
    comma,
    listJson,
    json,
    listComma,
    date,
    dateTime,
    percent
};

export default format => {
    if (typeof format === 'string') {
        return FormatMap[format];
    }

    return format;
};

