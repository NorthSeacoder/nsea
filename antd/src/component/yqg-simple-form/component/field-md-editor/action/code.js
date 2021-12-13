/*
 * @Author: chengyuzhang
 * @Date: 2020-05-12 20:18:50
 * @Last Modified by:   chengyuzhang
 * @Last Modified time: 2020-05-12 20:18:50
 */

export default {
    name: 'code',

    icon: {
        type: 'icon',
        value: 'code'
    },

    insert(selectionText = '') {
        if (!selectionText.trim()) return '\n```\ncode\n```\n';
        const matched = selectionText.match(/\n```\n(.+)\n```\n/);
        return matched ? selectionText.replace(matched[0], matched[1]) : `\n\`\`\`\n${selectionText}\n\`\`\`\n`;
    }
};
