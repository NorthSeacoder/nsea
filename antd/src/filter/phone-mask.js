/*
 * @Author: ruiwang
 * @Date: 2019-12-19 17:19:06
 * @Last Modified by: ruiwang
 * @Last Modified time: 2019-12-19 17:20:15
 */

export default (phone, maskNum = 6, suffixNum) => {
    if (!phone) {
        return null;
    }

    const regStr = suffixNum ? `(^\\+?\\d{3})(\\d*)(\\d{${suffixNum}})` : `(^\\+?\\d{3})(\\d{1,${maskNum}})(\\d*)`;
    return phone.replace(new RegExp(regStr), (num, $1, $2, $3) => ($1 + $2.replace(/./g, '*') + $3));
};
