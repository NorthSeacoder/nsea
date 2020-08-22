import map from 'lodash.map';
import longest from 'longest';
import path from 'path';
import fs from 'fs';

interface Option {
    types?: Object;
    defaultType?: String;
    defaultScope?: String;
}
interface Type {
    description?: String;
    title?: String;
}
interface Answer {
    type?: String;
    scope?: String;
    message?: String;
}
export const getConfig = (projectPath: string = process.cwd()) => {
    const configPath = path.join(projectPath, 'czrc.json');
    const file = fs.readFileSync(configPath);
    return JSON.parse(file.toString('utf8'));
};
//[type][scope] message
export const setCommit = (options: Option) => {
    const types = options.types;

    const length = longest(Object.keys(types)).length + 1;

    var choices = map(types, function (type: Type, key: String) {
        return {
            name: (key + ':').padEnd(length) + ' ' + type.description,
            value: key,
        };
    });

    return {
        prompter: (cz: any, commit: any) => {
            cz.prompt([
                {
                    type: 'list',
                    name: 'type',
                    message: '选择次提交的改动类型:',
                    choices: choices,
                    default: options.defaultType,
                },
                {
                    type: 'input',
                    name: 'scope',
                    message: '本次改动涉及范围 (e.g. 组件 or 文件名):',
                    default: options.defaultScope,
                },
                {
                    type: 'input',
                    name: 'message',
                    message: '本次修改的概要信息',
                },
            ]).then((answer: Answer) => {
                const {type, scope, message} = answer;
                const head = `[${type}][${scope}] ${message}`;
                commit(head);
            });
        },
    };
};
