/*
 * @Author: xiaodongyu
 * @Date 2019-11-22 10:49:59
 * @Last Modified by: ruiwang
 * @Last Modified time: 2020-07-16 18:43:31
 */
import date from './date';
import phoneMask from './phone-mask';
import percent from './percent';
import countToTime from './count-to-time';

const numberWithCommas = x => {
    if (!x && x !== 0 && x !== '0') return '';

    const parts = x.toString().trim().split('.');
    parts[0] = parts[0] && parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
};

const numberWithCommasFixed2 = x => ((x === +x) ? numberWithCommas((x).toFixed(2)) : x);

const numberWithCommasFixed4 = x => ((x === +x) ? numberWithCommas((x).toFixed(4)) : x);

export default {
    install(Vue) {
        Vue.filter('date', date());
        Vue.filter('dateTime', date('YYYY-MM-DD HH:mm:ss'));
        Vue.filter('time', date('HH:mm:ss'));
        Vue.filter('numberCommasFixed4', numberWithCommasFixed4);
        Vue.filter('numberCommasFixed2', numberWithCommasFixed2);
        Vue.filter('numberWithCommas', numberWithCommas);
        Vue.filter('phoneMask', phoneMask);
        Vue.filter('percent', percent);
        Vue.filter('countToTime', countToTime);
    }
};
