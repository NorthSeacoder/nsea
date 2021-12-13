/*
 * @Author: chengyuzhang
 * @Date: 2020-05-12 20:19:24
 * @Last Modified by:   chengyuzhang
 * @Last Modified time: 2020-05-12 20:19:24
 */

export default {
    name: 'quote',

    icon: {
        type: 'text',
        value: '”'
    },

    modify({text, selectionStart, selectionEnd}) {
        const lineFirstCharIndex = text.lastIndexOf('\n', selectionStart - 1) + 1;
        const headText = text.slice(0, lineFirstCharIndex);
        const remainText = text.slice(lineFirstCharIndex).trimStart();
        const newText = remainText.startsWith('> ')
            ? `${headText}${remainText.slice(2)}` // remove
            : `${headText}> ${remainText}`; // add
        const lengthRevise = newText.length - text.length;
        return {
            text: newText,
            selectionStart: selectionStart + lengthRevise,
            selectionEnd: selectionEnd + lengthRevise
        };
    }
};
