/*
 * @Author: xiaodongyu
 * @Date 2020-04-07 14:56:22
 * @Last Modified by: xiaodongyu
 * @Last Modified time: 2020-04-07 14:56:56
 */

export const boolOf = str => !!str && str === 'TRUE';

export const valueOf = bool => {
    if (typeof bool !== 'boolean') return undefined;

    return bool ? 'TRUE' : 'FALSE';
};
