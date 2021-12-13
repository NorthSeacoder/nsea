/*
 * @Author: qxy
 * @Date: 2020-06-30 13:32:14
 * @Last Modified by: qxy
 * @Last Modified time: 2020-06-30 17:23:59
 */

export default input => {
    const totalSeconds = input / 1000;
    const minute = `${Math.floor(totalSeconds / 60)}`.padStart(2, '0');
    const second = `${Math.floor(totalSeconds % 60)}`.padStart(2, '0');
    return `${minute}:${second}`;
};
