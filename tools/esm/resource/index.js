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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import axios from 'axios';
var ObjectKey;
(function (ObjectKey) {
    ObjectKey["Dot"] = ".k";
    ObjectKey["Bracket"] = "[k]";
    ObjectKey["Whole"] = "json";
})(ObjectKey || (ObjectKey = {}));
var ArrayKey;
(function (ArrayKey) {
    ArrayKey["None"] = "";
    ArrayKey["Dot"] = ".i";
    ArrayKey["Bracket"] = "[i]";
    ArrayKey["EmptyBracket"] = "[]";
    ArrayKey["Whole"] = "json";
})(ArrayKey || (ArrayKey = {}));
export var setUrlParams = function (path) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (!/:/.test(path))
        return path;
    var isFormData = typeof FormData !== 'undefined' && args[0] instanceof FormData;
    var _a = (args[1] || args[0] || {}).params, params = _a === void 0 ? '' : _a;
    if (!params)
        params = args[0] || {};
    return path.replace(/\/:([^/]+)/g, function (match, key) {
        var replacement = (isFormData ? params.get(key) : params[key]) || '';
        delete params[key];
        return "/" + replacement;
    });
};
export var objToFormData = function (obj, config) {
    if (!obj)
        return obj;
    var _a = config.objectKey, objectKey = _a === void 0 ? ObjectKey.Dot : _a, _b = config.arrayKey, arrayKey = _b === void 0 ? ArrayKey.None : _b;
    var formData = new FormData();
    Object.keys(obj).forEach(function (key) {
        var curData = obj[key];
        if (curData === undefined || curData === null)
            return;
        if (curData && curData.constructor === Array) {
            switch (arrayKey) {
                case ArrayKey.None:
                case ArrayKey.Dot:
                case ArrayKey.Bracket:
                case ArrayKey.EmptyBracket:
                    curData.forEach(function (item, idx) {
                        formData.append("" + key + arrayKey.replace('i', idx), item);
                    });
                    return;
                case ArrayKey.Whole:
                    curData = JSON.stringify(curData);
                    break;
            }
        }
        if (curData && curData.constructor === Object) {
            switch (objectKey) {
                case ObjectKey.Dot:
                case ObjectKey.Bracket:
                    Object.keys(curData).forEach(function (subKey) {
                        formData.append("" + key + objectKey.replace('k', subKey), curData[subKey]);
                    });
                    return;
                case ObjectKey.Whole:
                    curData = JSON.stringify(curData);
                    break;
            }
        }
        formData.append(key, curData);
    });
    return formData;
};
export { axios };
var Resource = (function () {
    function Resource(_a) {
        var _this = this;
        var url = _a.url, getHost = _a.getHost, config = __rest(_a, ["url", "getHost"]);
        this.url = url;
        this.getHost = getHost;
        ['get', 'patch', 'post', 'put', 'delete', 'save', 'savePatch'].forEach(function (method) { return _this[method] = _this[method].bind(_this); });
        this.extend(config);
    }
    Resource.create = function (opts) {
        return new Resource(opts);
    };
    Resource.prototype.extend = function (config) {
        var _this = this;
        Object.keys(config).forEach(function (key) {
            var _a = config[key], method = _a.method, url = _a.url, link = _a.link, download = _a.download, targetSelf = _a.targetSelf, formData = _a.formData;
            var request = axios[method];
            if (!(link || download || targetSelf) && !request) {
                throw new Error("Method [" + method + "] is not valid http verb!");
            }
            _this[key] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _a = _this.parse.apply(_this, [url].concat(args)), parsedUrl = _a[0], cd = _a[1], restArgs = _a.slice(2);
                var configOrData = cd;
                if (link || download || targetSelf) {
                    var _b = (configOrData || {}).params, params = _b === void 0 ? configOrData : _b;
                    var requestUrl = axios.getUri({ params: params, url: parsedUrl });
                    if (download)
                        window.open(requestUrl);
                    if (targetSelf)
                        window.location.href = requestUrl;
                    return requestUrl;
                }
                if (formData) {
                    configOrData = objToFormData(configOrData, formData);
                }
                return request.apply(void 0, [parsedUrl, configOrData].concat(restArgs));
            };
        });
    };
    Resource.prototype.parse = function (url) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a = this.getHost, getHost = _a === void 0 ? '' : _a;
        var parsedArgs = args.map(function (params) { return (params instanceof Array ? params.slice() : params && __assign({}, params)); });
        var parsedUrl = "" + (getHost && getHost()) + setUrlParams.apply(void 0, [url].concat(parsedArgs));
        return [parsedUrl].concat(parsedArgs);
    };
    Resource.prototype.get = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return axios.get.apply(axios, this.parse.apply(this, [this.url].concat(args)));
    };
    Resource.prototype.patch = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return axios.patch.apply(axios, this.parse.apply(this, [this.url].concat(args)));
    };
    Resource.prototype.post = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return axios.post.apply(axios, this.parse.apply(this, [this.url].concat(args)));
    };
    Resource.prototype.put = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return axios.put.apply(axios, this.parse.apply(this, [this.url].concat(args)));
    };
    Resource.prototype.delete = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return axios.delete.apply(axios, this.parse.apply(this, [this.url].concat(args)));
    };
    Resource.prototype.save = function (data, options) {
        if (options === void 0) { options = { id: 'id' }; }
        return this[data[options.id] ? 'put' : 'post'](data, options);
    };
    Resource.prototype.savePatch = function (data, options) {
        if (options === void 0) { options = { id: 'id' }; }
        return this[data[options.id] ? 'patch' : 'post'](data, options);
    };
    return Resource;
}());
export default Resource;
