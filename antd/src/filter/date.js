/*
 * @Author: xiaodongyu
 * @Date 2019-11-22 10:51:02
 * @Last Modified by: ruiwang
 * @Last Modified time: 2020-07-20 19:16:04
 */

import moment from 'moment-timezone';

export default (format = 'YYYY-MM-DD') => (
    date,
    timezone = moment.tz.guess(true)
) => {
    if (!date && date !== 0) return null;

    return moment.tz(date, timezone).format(format);
};
