/*
 * @Author: chengyuzhang
 * @Date: 2020-05-12 20:18:39
 * @Last Modified by: chengyuzhang
 * @Last Modified time: 2020-07-24 16:05:20
 */

export default {
    name: 'bold',

    icon: {
        type: 'text',
        value: 'B'
    },

    insert(selectionText = '') {
        if (!selectionText.trim()) return '**bold**';
        const matched = selectionText.match(/\*\*(.+)\*\*/);
        return matched ? selectionText.replace(matched[0], matched[1]) : `**${selectionText}**`;
    }
};
