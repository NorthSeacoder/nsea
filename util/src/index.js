import ArrayUtils from './moudles/Array';

class u {
    static isNumeric(obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
    }
    static type(obj) {
        return typeof obj;
    }
    static isObject(obj) {
        return u.type(obj) == 'object';
    }
    static isBoolean(obj) {
        return u.type(obj) == 'boolean';
    }
}

/**
 * @description 数组操作类
 */
// class utilsArray {
//     /**
//      * @description 数组排序
//      * @example utils.Array.order([{value:10},{value:20}],'desc','value')
//      * @example utils.Array.order([10,20],'desc')
//      * @param {Array} array 要操作的数组
//      * @param {String} type 排序 asc/desc  default asc
//      * @param {String} column 如果array是对象数组传字段名
//      * @returns {Array} 返回排序后的数组
//      */
//     static order(array, type, column) {
//         var n1 = type == 'desc' ? -1 : 1,
//             n2 = n1 == 1 ? -1 : 1;
//         return array.sort(function (a, b) {
//             var _a = -Number.NEGATIVE_INFINITY,
//                 _b = -Number.NEGATIVE_INFINITY,
//                 av = u.isObject(a) ? a[column] : a,
//                 bv = u.isObject(b) ? b[column] : b;

//             if (u.isNumeric(av)) _a = parseFloat(av);
//             if (u.isNumeric(bv)) _b = parseFloat(bv);
//             return _a > _b ? n1 : n2;
//         });
//     }
//     /**
//      * @description 数组去重
//      * @example utils.Array.unique([{name:'zs'},{name:'zs'}],'name')
//      * @example utils.Array.unique([10,10])
//      * @param {Array} array 要操作的数组
//      * @param {String} column 如果array是对象数组传字段名
//      * @returns {Array} 返回去重后的数组
//      */
//     static unique(array, column) {
//         var result = [],
//             hash = {};
//         for (var i = 0; i < array.length; i++) {
//             var elem = typeof array[i] == 'object' ? array[i][column] : array[i];
//             if (!hash[elem]) {
//                 hash[elem] = true;
//                 result.push(array[i]);
//             }
//         }
//         return result;
//     }

// }
/**
 * @description 字符串操作类
 */
class utilsString {

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

/**
 * @description Date操作类
 */
class utilsDate {
    /**
     * 日期格式化制定格式字符串
     * @param {Date} date  日期
     * @param {String} fmt  转换的格式 如 yyyy-MM-dd
     */
    static format(date, fmt) {
        var o = {
            "M+": date.getMonth() + 1, //月份   
            "d+": date.getDate(), //日   
            "h+": date.getHours(), //小时   
            "m+": date.getMinutes(), //分   
            "s+": date.getSeconds(), //秒   
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
            "S": date.getMilliseconds() //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    /**
     * @param {any} date 结束时间2019-01-08 00:00:00
     * @returns  
     * 
     * @memberOf utilsDate
     */
    static Countdown(date) {
        const now = new Date();
        const to = new Date(date)
        let second = to.getTime() - now.getTime();
        if (second <= 0) return '已结束';
        let selfSecond = second;
        const day = Number.parseInt(selfSecond / (1000 * 3600 * 24), 10);
        selfSecond %= 1000 * 3600 * 24; //除去整天之后剩余的时间
        const hour = Number.parseInt(selfSecond / (1000 * 3600), 10);
        selfSecond %= 1000 * 3600; //除去整小时之后剩余的时间
        const minute = Number.parseInt(selfSecond / (1000 * 60), 10);
        selfSecond %= 1000 * 60; //除去整分钟之后剩余的时间
        return `${day}days${hour}hours${minute}minutes${Number.parseInt(
          selfSecond / 1000,
          10
        )}seconds`;
    }
}
/**
 * @description 对象操作类
 */
class utilsObject {
    /**
     * 数组/对象 拷贝
     */
    static extend() {
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }


        if (typeof target !== "object") {
            target = {};
        }

        if (length === i) {
            target = this;
            --i;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (typeof copy == 'object')) {
                        copyIsArray = Array.isArray(copy);
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? copy : [];
                        } else {
                            clone = src && typeof src == 'object' ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = utilsObject.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    }
}

/**
 * @description 渐变色
 */
class Intensity {
    /**
     * @constructor Intensity
     * description 获取渐变色阶/size
     * @param {Object} options 
     * @param {Object} options.gradient 色阶 {0.1:red,0.5:'#fff'}
     * @param {Number} options.maxSize 最大size
     * @param {Number} options.minSize 最小size
     * @param {Number} options.max 最大值
     * @param {String} options.colorType 返回颜色类型 'binary'||'rgb'
     * @returns {Object} 当前对象实例
     */
    constructor(options) {
        options = options || {};
        this.gradient = options.gradient || {
            0.25: "rgba(0, 0, 255, 1)",
            0.55: "rgba(0, 255, 0, 1)",
            0.85: "rgba(255, 255, 0, 1)",
            1.0: "rgba(255, 0, 0, 1)"
        };
        this.maxSize = options.maxSize || 35;
        this.minSize = options.minSize || 0;
        this.max = options.max || 100;
        this.colorType = options.colorType || 'rgb';
        this.initPalette();
    }

    initPalette() {

        var gradient = this.gradient;

        if (typeof document === 'undefined') {
            // var Canvas = require('canvas');
            // var paletteCanvas = new Canvas(256, 1);
        } else {
            var paletteCanvas = document.createElement('canvas');
        }

        paletteCanvas.width = 256;
        paletteCanvas.height = 1;

        var paletteCtx = this.paletteCtx = paletteCanvas.getContext('2d');

        var lineGradient = paletteCtx.createLinearGradient(0, 0, 256, 1);

        for (var key in gradient) {
            lineGradient.addColorStop(parseFloat(key), gradient[key]);
        }
        paletteCtx.fillStyle = lineGradient;
        paletteCtx.fillRect(0, 0, 256, 1);
    }

    /**
     * 根据value获取色阶颜色
     * @param {Number} value  
     * @returns {String}
     */
    getColor(value) {

        var max = this.max;

        if (value > max) {
            value = max;
        }

        var index = Math.floor(value / max * (256 - 1)) * 4;

        var imageData = this.paletteCtx.getImageData(0, 0, 256, 1).data;

        var color = "rgba(" + imageData[index] + ", " + imageData[index + 1] + ", " + imageData[index + 2] + ", " + imageData[index + 3] / 256 + ")";

        return this.colorType == 'binary' ? utilsColor.rgb2binary(color) : color;
    }



    /**
     * 根据value获取size
     * @param {Number} value  
     */
    getSize(value) {

        var size = 0;
        var max = this.max;
        var maxSize = this.maxSize;
        var minSize = this.minSize;

        if (value > max) {
            value = max;
        }

        size = minSize + value / max * (maxSize - minSize);

        return size;
    }
}

/**
 * @description 颜色转换
 */
class utilsColor {
    /**
     * 根据rbg颜色转换成二进制网页色
     * @param {String} color  rgb颜色
     * @returns {String} 二进制网页色
     */
    static rgb2binary(color) {
        color = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (color && color.length === 4) ? '#' +
            ('0' + parseInt(color[1], 10).toString(16)).slice(-2) +
            ('0' + parseInt(color[2], 10).toString(16)).slice(-2) +
            ('0' + parseInt(color[3], 10).toString(16)).slice(-2) : '';
    }

    /**
     * 
     * @param {Object} options 
     * @param {Object} options.gradient 色阶 {0.1:red,0.5:'#fff'}
     * @param {Number} options.maxSize 最大size
     * @param {Number} options.minSize 最小size
     * @param {Number} options.max 最大值
     * @param {String} options.colorType 返回颜色类型 'binary'||'rgb'
     * @returns {Object} 当前对象实例
     */
    static intensity(options) {
        return new Intensity(options);
    }
}


module.exports.Array = ArrayUtils;
module.exports.String = utilsString;
module.exports.Date = utilsDate;
module.exports.Object = utilsObject;
//获取色阶
module.exports.Color = utilsColor;
module.exports.Test=()=>console.log('hahaha')