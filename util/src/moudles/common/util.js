export default class u {
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