/**
 * @description Date操作类
 */
export default class utilsDate {
    /**
     * 日期格式化制定格式字符串
     * @param {Date} date  日期
     * @param {String} fmt  转换的格式 如 yyyy-MM-dd
     */
    static format(date, fmt) {
        var o = {
            "M+": date.getMonth() + 1, //月份   
            "d+": date.getDate(), //日   
            "h+": date.getHours(), //小时   
            "m+": date.getMinutes(), //分   
            "s+": date.getSeconds(), //秒   
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
            "S": date.getMilliseconds() //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    /**
     * @param {any} date 结束时间2019-01-08 00:00:00
     * @returns  
     * 
     * @memberOf utilsDate
     */
    static Countdown(date) {
        const now = new Date();
        const to = new Date(date)
        let second = to.getTime() - now.getTime();
        if (second <= 0) return '已结束';
        let selfSecond = second;
        const day = Number.parseInt(selfSecond / (1000 * 3600 * 24), 10);
        selfSecond %= 1000 * 3600 * 24; //除去整天之后剩余的时间
        const hour = Number.parseInt(selfSecond / (1000 * 3600), 10);
        selfSecond %= 1000 * 3600; //除去整小时之后剩余的时间
        const minute = Number.parseInt(selfSecond / (1000 * 60), 10);
        selfSecond %= 1000 * 60; //除去整分钟之后剩余的时间
        return `${day}days${hour}hours${minute}minutes${Number.parseInt(
          selfSecond / 1000,
          10
        )}seconds`;
    }
}