/*
 * @Author: xiaodongyu
 * @Date 2019-12-07 14:00:32
 * @Last Modified by: xiaodongyu
 * @Last Modified time: 2021-04-23 16:43:39
 */

export const evalProp = (value, values) => {
    if (typeof value === 'function') {
        return value(values);
    }

    return value;
};

const getKeys = (keyString = '') => keyString.split(/\]?[[.]/);

export const pickValue = (obj, keyString) => {
    const keys = getKeys(keyString);
    let value = obj;
    try {
        keys.forEach(key => (value = value[key]));
    } catch (err) {
        value = undefined;
    }

    return value;
};

export const setValue = (obj = {}, keyString, value) => {
    const keys = getKeys(keyString);
    const result = {...obj};
    let target = result;
    keys.forEach((key, idx) => {
        if (idx === keys.length - 1) {
            target[key] = value;
        } else {
            if (!target[key]) {
                const nextKey = keys[idx + 1];
                if (/^\d+$/.test(nextKey) && new RegExp(`${key}]?[${nextKey}]`).test(keyString)) {
                    target[key] = [];
                } else {
                    target[key] = {};
                }
            }

            target = target[key];
        }
    });

    return result;
};

const numberToStr = val => {
    if ((val || val === 0 || val === false) && (val.constructor === Number || val.constructor === Boolean)) {
        return val.toString();
    }

    return val;
};

export const numbersToStr = val => {
    if (val && val.constructor === Array) {
        return val.map(numberToStr);
    }

    return numberToStr(val);
};

export const isMobile = /mobile/i.test(navigator.userAgent);

export function spreadProps({class: className, style, ref, key, ...props} = {}) {
    return {
        key,
        class: className,
        style,
        ref,
        props
    };
}
