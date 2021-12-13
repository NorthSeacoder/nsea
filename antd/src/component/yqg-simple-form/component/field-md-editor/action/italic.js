/*
 * @Author: chengyuzhang
 * @Date: 2020-05-12 20:19:05
 * @Last Modified by: chengyuzhang
 * @Last Modified time: 2020-07-24 16:04:46
 */

export default {
    name: 'italic',

    icon: {
        type: 'icon',
        value: 'italic'
    },

    insert(selectionText = '') {
        if (!selectionText.trim()) return '*italic*';
        const matched = selectionText.match(/\*(.+)\*/);
        return matched ? selectionText.replace(matched[0], matched[1]) : `*${selectionText}*`;
    }
};
