/*
 * @Author: mengpeng
 * @Date: 2021-12-18 10:17:10
 * @Last Modified by: mengpeng 
 * @Last Modified time: 2021-12-18 14:48:52 
 */
export const test = /\.vue$|\.js$|\.ts$/

export default function (ast) {
    return ast
        .find('<template></template>')
        .replace(
            `<el-popover open-delay="$_$" $$$1>$$$2</el-popover>`,
            `<el-popover show-after="$_$" $$$1>$$$2</el-popover>`
        )
        .replace(
            `<el-popover close-delay="$_$" $$$1>$$$2</el-popover>`,
            `<el-popover hide-after="$_$" $$$1>$$$2</el-popover>`
        )
        .replace(
            `<el-popover hide-after="$_$" $$$1>$$$2</el-popover>`,
            `<el-popover auto-close="$_$" $$$1>$$$2</el-popover>`
        )
        .root('sfc');
}

