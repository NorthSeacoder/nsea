/*
 * @Author: mengpeng
 * @Date: 2021-12-18 13:59:16
 * @Last Modified by: mengpeng 
 * @Last Modified time: 2021-12-18 14:49:54 
 */

const files = require.context('.', true, /^\.\/(.*)\/(.*)\.js$/);

export default files.keys().reduce((obj, file) => {
    const reg = /^\.\/(.*)\/(.*)\.js$/;
    const [url, type, name] = reg.exec(file);
    const rule = {name, rule: files(url).default, test: files(url).test};
    !!obj[type] ? obj[type].push(rule) : (obj[type] = [rule]);
    return obj;
}, {});
