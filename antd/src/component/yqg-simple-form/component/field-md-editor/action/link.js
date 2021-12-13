/*
 * @Author: chengyuzhang
 * @Date: 2020-05-12 20:19:16
 * @Last Modified by:   chengyuzhang
 * @Last Modified time: 2020-05-12 20:19:16
 */

export default {
    name: 'link',

    icon: {
        type: 'icon',
        value: 'link'
    },

    insert(selectionText = '') {
        if (!selectionText) return '[description](url)';
        const matched = selectionText.match(/\[(.+)]\(.+\)/);
        return matched ? selectionText.replace(matched[0], matched[1]) : `[${selectionText}](url)`;
    }
};
