/*
 * @Author: xiaodongyu
 * @Date 2020-04-03 21:22:02
 * @Last Modified by: mengpeng 
 * @Last Modified time: 2021-07-30 18:05:21 
 */

import {pickValue} from '../util/object';

export const zh = {
    common: {
        add: '新增',
        cancel: '取消',
        checkAll: '全选',
        chooseFile: '选择文件',
        close: '关闭',
        confirm: '确定',
        create: '添加',
        delete: '删除',
        edit: '编辑',
        fileUrl: '文件地址',
        format: '格式化',
        formatFailed: '格式化失败',
        imageUrl: '图片地址',
        noData: '暂无数据',
        op: '操作',
        uploadFile: '上传文件',
        uploadImage: '上传图片',
        uploadLocal: '本地上传',
        imageDesc: '图片描述',
        fileDesc: '文件描述',
        pleaseSelect: '请选择',
        query: '查询',
        reset: '重置'
    },
    pagination: {
        line: '行',
        total: '共'
    },
    rich: {
        auto: '自动',
        addColumnBefore: '前加列',
        addColumnAfter: '后加列',
        addRowBefore: '前加行',
        addRowAfter: '后加行',
        backgroundColor: '背景色',
        blockquote: '引用',
        bold: '加粗',
        bulletList: '无序列表',
        clear: '清除',
        code: '代码',
        codeBlock: '代码块',
        deleteColumn: '删除列',
        deleteRow: '删除行',
        deleteTable: '删除表格',
        file: '文件',
        fontColor: '字体色',
        fontSize: '字体大小',
        h1: '标题1',
        h2: '标题2',
        h3: '标题3',
        h4: '标题4',
        h5: '标题5',
        h6: '标题6',
        horizontalRule: '横线',
        image: '图片',
        insertLink: '插入链接',
        italic: '斜体',
        link: '链接',
        linkUrl: '链接地址',
        linkDesc: '链接描述',
        orderedList: '有序列表',
        paragraph: '段落',
        primaryColor: '主题颜色',
        redo: '重做',
        replace: '替换',
        replaceAll: '全部替换',
        search: '查找',
        standardColor: '标准色',
        strike: '中划线',
        table: '表格',
        tac: '居中',
        tal: '左对齐',
        tar: '右对齐',
        toggleCellMerge: '合并单元格',
        underline: '下划线',
        undo: '撤回'
    },
    rule: {
        required: '必填'
    },
    table: {
        searchPlaceholder: '表内搜索',
        clientSortTip: '当前排序仅针对本页数据，并非所有数据',
        exportCurrentPage: '导出本页'
    },
    ytalk: {
        verifyInfo: '不支持当前浏览器版本，外呼无法正常使用！',
        initializeFailed: '外呼初始化失败',
        microphoneEnabled: '请打开浏览器麦克风权限，并检查音频输入设备',
        pageClosed: '确定关闭页面?',
        loginSuccess: '外呼登录成功',
        logoutSuccess: '外呼登出成功',
        registerTips: '当前坐席已在其他设备或浏览器登录'
    }
};

export default {
    install(Vue) {
        Vue.prototype.$t = key => pickValue(zh, key) || key;
    }
};
