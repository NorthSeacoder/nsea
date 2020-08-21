var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var filterBody = function (res, filterFunc) {
    var data = res.data;
    var body = data.body.filter(filterFunc);
    return __assign({}, res, { data: __assign({}, data, { body: body }) });
};
var getKeys = function (keyString) {
    if (keyString === void 0) { keyString = ''; }
    return keyString.replace(/]/g, '').split(/[[.]/);
};
var pickValue = function (obj, keyString) {
    var keys = getKeys(keyString);
    var value = obj;
    try {
        keys.forEach(function (key) { return (value = value[key]); });
    }
    catch (err) {
        value = undefined;
    }
    return value;
};
var isTextFieldValid = function (textField) { return (textField !== undefined && textField !== '' && textField !== null); };
var getItemText = function (item, value, _a) {
    var _b = _a.textField, textField = _b === void 0 ? 'name' : _b, _c = _a.textTpl, textTpl = _c === void 0 ? '' : _c;
    return (textTpl ? textTpl.replace(/\{{2}(\w+)\}{2}/g, function (match, sub1) { return (item[sub1] || ''); }) : item[textField]);
};
var getMapList = function (arr, options) {
    var map = {};
    var itemMap = {};
    var list = [];
    var _a = options.valueField, valueField = _a === void 0 ? 'id' : _a, _b = options.onHandleRecord, onHandleRecord = _b === void 0 ? function () { } : _b;
    arr.forEach(function (val) {
        if (typeof val === 'string') {
            var obj = { value: val, text: val };
            map[val] = val;
            itemMap[val] = obj;
            list.push(obj);
            return;
        }
        onHandleRecord(val);
        var value = val[valueField];
        var text = getItemText(val, value, options);
        if (isTextFieldValid(text) && isTextFieldValid(value) && !map[value]) {
            var obj = __assign({}, val, { value: value, text: text });
            map[value] = text;
            itemMap[value] = obj;
            list.push(obj);
        }
    });
    return { map: map, itemMap: itemMap, list: list };
};
var handleDisabled = function (list, options) {
    if (options === void 0) { options = {}; }
    var _a = options.disabledValues, disabledValues = _a === void 0 ? [] : _a;
    if (!disabledValues.length)
        return;
    list.forEach(function (item) { return item.disabled = disabledValues.includes(item.value); });
};
var Enum = (function () {
    function Enum() {
    }
    Enum.from = function (map, options) {
        if (options === void 0) { options = {}; }
        var yqgEnum = new Enum();
        yqgEnum.options = options;
        yqgEnum.extraMap = options.extraMap || {};
        yqgEnum.populate({ map: map });
        return yqgEnum;
    };
    Enum.fromArray = function (arr, options) {
        if (options === void 0) { options = {}; }
        var yqgEnum = new Enum();
        yqgEnum.options = options;
        yqgEnum.extraMap = options.extraMap || {};
        yqgEnum.populate(getMapList(arr, options));
        return yqgEnum;
    };
    Enum.query = function (fetch, options) {
        if (options === void 0) { options = {}; }
        var _a = options.dataBodyField, dataBodyField = _a === void 0 ? '' : _a, _b = options.queryOnce, queryOnce = _b === void 0 ? false : _b, _c = options.extraMap, extraMap = _c === void 0 ? {} : _c;
        var yqgEnum = new Enum();
        yqgEnum.options = options;
        yqgEnum.extraMap = extraMap;
        yqgEnum.populate({ map: {}, itemMap: {} });
        yqgEnum.query = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (queryOnce && yqgEnum.QUERY_PROMISE) {
                return yqgEnum.QUERY_PROMISE;
            }
            yqgEnum.QUERY_PROMISE = fetch.apply(void 0, args).then(function (resp) {
                var body = resp.data.body;
                if (!body)
                    return resp;
                if (dataBodyField) {
                    body = pickValue(body, dataBodyField);
                }
                var mapList = {};
                if (Array.isArray(body)) {
                    mapList = getMapList(body, options);
                }
                else {
                    mapList.map = body || {};
                }
                yqgEnum.populate(mapList);
                return resp;
            }).catch(function (err) {
                yqgEnum.QUERY_PROMISE = null;
                return Promise.reject(err);
            });
            return yqgEnum.QUERY_PROMISE;
        };
        return yqgEnum;
    };
    Enum.filter = function (superEnum, filterFn, options) {
        var filteredEnum = null;
        if ('query' in superEnum) {
            filteredEnum = Enum.query(function () { return superEnum.query().then(function (res) { return filterBody(res, filterFn); }); }, options || superEnum.options);
        }
        else {
            filteredEnum = Enum.from(filterFn(superEnum.MAP));
        }
        filteredEnum.superEnum = superEnum;
        return filteredEnum;
    };
    Enum.map = function (baseEnum, options) {
        return Enum.query(baseEnum.query, options);
    };
    Enum.prototype.populate = function (_a) {
        var _this = this;
        var map = _a.map, itemMap = _a.itemMap, list = _a.list;
        this.MAP = map;
        this.ITEM_MAP = itemMap;
        this.LIST = list || Object.keys(map).map(function (value) { return ({ value: value, text: map[value] }); });
        handleDisabled(this.LIST, this.options);
        this.TYPE = {};
        this.REVERSEMAP = {};
        Object.keys(map).forEach(function (value) {
            _this.TYPE[value] = value;
            _this.REVERSEMAP[map[value]] = value;
        });
    };
    Enum.prototype.getText = function (value) {
        var _a = this, MAP = _a.MAP, extraMap = _a.extraMap, superEnum = _a.superEnum, options = _a.options, _b = _a.options, textField = _b.textField, textTpl = _b.textTpl;
        var text = MAP[value] || extraMap[value];
        if (!text && superEnum) {
            var _c = superEnum.options, superTextField = _c.textField, superTextTpl = _c.textTpl;
            if (textField === superTextField && textTpl === superTextTpl) {
                text = superEnum.MAP[value];
            }
            else {
                text = getItemText(superEnum.ITEM_MAP[value] || {}, value, options);
            }
        }
        return text || value;
    };
    return Enum;
}());
export default Enum;
