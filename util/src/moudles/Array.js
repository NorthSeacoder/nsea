/**
 * @description 数组操作类
 */
export default class utilsArray {
    static test(){
        console.log('hahahahaha')
    }
    /**
     * @description 数组排序
     * @example utils.Array.order([{value:10},{value:20}],'desc','value')
     * @example utils.Array.order([10,20],'desc')
     * @param {Array} array 要操作的数组
     * @param {String} type 排序 asc/desc  default asc
     * @param {String} column 如果array是对象数组传字段名
     * @returns {Array} 返回排序后的数组
     */
    static order(array, type, column) {
        var n1 = type == 'desc' ? -1 : 1,
            n2 = n1 == 1 ? -1 : 1;
        return array.sort(function (a, b) {
            var _a = -Number.NEGATIVE_INFINITY,
                _b = -Number.NEGATIVE_INFINITY,
                av = u.isObject(a) ? a[column] : a,
                bv = u.isObject(b) ? b[column] : b;

            if (u.isNumeric(av)) _a = parseFloat(av);
            if (u.isNumeric(bv)) _b = parseFloat(bv);
            return _a > _b ? n1 : n2;
        });
    }
    /**
     * @description 数组去重
     * @example utils.Array.unique([{name:'zs'},{name:'zs'}],'name')
     * @example utils.Array.unique([10,10])
     * @param {Array} array 要操作的数组
     * @param {String} column 如果array是对象数组传字段名
     * @returns {Array} 返回去重后的数组
     */
    static unique(array, column) {
        var result = [],
            hash = {};
        for (var i = 0; i < array.length; i++) {
            var elem = typeof array[i] == 'object' ? array[i][column] : array[i];
            if (!hash[elem]) {
                hash[elem] = true;
                result.push(array[i]);
            }
        }
        return result;
    }

}