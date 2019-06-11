import u from './common/util';

/**
 * @description 字符串操作类
 */
export default class utilsString {

    /**
     * 剔除html标签
     * @param {String} html  要剔除的html字符串
     */
    static removeHTML(html) {
        return html.replace(/<\/?[^>]*>/g, '')
            .replace(/[ | ]*\n/g, '\n')
            .replace(/&nbsp;/ig, '');
    }
    /**
     * 字符串截断并加指定字符串 subString(`sadfsdafsd`,2,'...')
     * @param {String} val  要截断的字符串
     * @param {Number} len  长度
     * @param {String} suffix  需要补齐的字符串
     * @returns {String} sa...
     */
    static subString(val, len, suffix) {
        return (val || '').length > len ? val = val.substr(0, len) + (suffix == undefined ? '' : suffix) : val;
    }
    /**
     * 字符串转换parseFloat并保留指定小数位
     * @param {String} val  要操作的字符串
     * @param {Number} len  保留小数位长度
     * @param {Boolean} fill  如果小数位长度不足是否需要补齐 default =true
     * @returns {String} 转换后的值
     */
    static toFixed(val, len, fill) {
        fill = !u.isBoolean(fill) ? true : fill;

        var v = val;
        if (val && u.isNumeric(val)) {
            if (fill) {
                v = parseFloat(val).toFixed(len)
            } else {
                v = parseFloat(val);
                if (val.toString().indexOf('.') > 0) {
                    var arr = val.toString().split('.');
                    v = arr[1].length > len ? v.toFixed(len) : v;
                }
            }
        }
        return v;
    }
    /**
     * 删除前后空格
     * @param {String} val  要操作的字符串
     * @returns {String} 删除前后空格后的字符串
     */
    static trim(val) {
        return val.replace(/(^\s*)|(\s*$)/g, '');
    }
    /**
     * 替换所有
     * @param {String} val  要操作的字符串
     * @param {String} replacestr  被替换字符串
     * @param {String} newstr  用来替换的字符串
     * @returns {String} 替换后的字符串
     */
    static replaceAll(val, replacestr, newstr) {
        return val.replace(new RegExp(replacestr, 'gm'), newstr)
    }
    /**
     * 字符转换日期
     * @param {String} val  要操作的日期字符串
     * @param {String} split  日期字符串的连接方式，例'-'或'/'
     * @returns {Date} 转换后日期对象
     */
    static toDate(val, split) {
        split = split || '-';
        var arr = val.split(split);
        if (arr.length == 3) {
            var date = new Date();
            date.setUTCFullYear(arr[0], arr[1] - 1, arr[2]);
            date.setUTCHours(0, 0, 0, 0);
            return date;
        }
    }
}