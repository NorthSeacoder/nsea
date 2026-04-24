/*
 * @Author: mengpeng
 * @Date: 2021-12-18 14:35:18
 * @Last Modified by: mengpeng 
 * @Last Modified time: 2021-12-18 14:50:29 
 */

import prettier from 'prettier';
import rules from './rules';

/**
 * 转换入口导出一个函数，按照如下函数签名
 * @param {*} fileInfo 包含 source 和 path 属性
 * @param {*} api 包含 gogocode 作为转换工具
 * @param {*} options 其他 option 由此传入
 * @returns {string} 返回转换后的代码
 */
export default function (fileInfo, api, options) {
    const {type} = options;
    const {path, source: sourceCode} = fileInfo;
    const {gogocode: $} = api;
    console.log(rules);
    if (!type) {
        console.log('缺少参数 type');
        return sourceCode;
    }
    if (!/\.vue$|\.js$|\.ts$|\.json$/.test(path) || /node_modules/.test(path)) {
        return sourceCode;
    }
    const ast = /\.json$/.test(fileInfo.path)
        ? sourceCode
        : /\.vue$/.test(fileInfo.path)
        ? $(sourceCode, {parseOptions: {language: 'vue'}})
        : $(sourceCode);

    const outAst = rules[type].reduce((ast, ruleCfg) => {
        if (!ruleCfg.test.test(fileInfo.path)) {
            return ast;
        }
        try {
            return ruleCfg.rule(ast, api, options);
        } catch (error) {
            console.log(`文件转换异常,类型:${type}, 规则:${ruleCfg.name},文件:${fileInfo.path}`, error);
            return ast;
        }
    }, ast);
    // 命令行的params参数没有配置format=true 则默认格式化代码，如果命令行的params配置了format参数则使用该配置
    const format = options.format === undefined || options.format === true;

    return /\.json$/.test(fileInfo.path)
        ? outAst
        : format
        ? prettier.format(outAst.generate(), {
              tabWidth: 4,
              printWidth: 120,
              singleQuote: true,
              arrowParens: 'always',
              jsxSingleQuote: true,
              bracketSpacing: false,
              useEditorConfig: false,
              trailingComma: 'none',
              parser: /\.vue$/.test(fileInfo.path) ? 'vue' : 'typescript'
          })
        : outAst.generate();
}
