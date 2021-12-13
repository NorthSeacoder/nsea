/*
 * @Author: qxy
 * @Date: 2020-04-20 16:16:52
 * @Last Modified by: xiaodongyu
 * @Last Modified time: 2020-06-29 23:01:07
 */

/**
 *
 * @param pDigitNum 百分数保留几位小数
 */
const decimalToPercent = (pDigitNum = 2) => ({
    // 0.101 => 10.1%
    filter: x => x && (x = +x) && (Math.round(x * (10 ** (pDigitNum + 2))) / (10 ** pDigitNum)),

    // 10.11% => 0.101
    reverseFilter: x => x && (x = +x) && (Math.round(x * (10 ** pDigitNum)) / (10 ** (pDigitNum + 2)))
});


export default input => ((input !== null && input === +input && !isNaN(input))
    ? `${decimalToPercent().filter(input).toFixed(2)}%` : '/');
