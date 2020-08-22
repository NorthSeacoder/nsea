export const defaultTypes = {
    types: {
        feat: {
            description: '增加新功能',
            title: 'Features',
        },
        fix: {
            description: '修复bug',
            title: 'Bug Fixes',
        },
        docs: {
            description: '仅修改文档',
            title: 'Documentation',
        },
        style: {
            description:
                '不会影响代码含义的更改（空格，格式，缺少分号等）',
            title: 'Styles',
        },
        refactor: {
            description: '代码重构',
            title: 'Code Refactoring',
        },
        perf: {
            description: '性能优化',
            title: 'Performance Improvements',
        },
        test: {
            description: '增加测试文件或修改现有测试文件',
            title: 'Tests',
        },
        build: {
            description:
                '修改构建脚本',
            title: 'Builds',
        },
        ci: {
            description:
                '修改持续集成相关配置文件',
            title: 'Continuous Integrations',
        },
    },
};
