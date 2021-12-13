/*
 * @Author: xiaodongyu
 * @Date 2020-11-17 14:31:28
 * @Last Modified by: xiaodongyu
 * @Last Modified time: 2020-12-01 13:57:45
 */

import {Mark} from 'tiptap';
import {updateMark, removeMark} from 'tiptap-commands';

export default function InlineStyle(styleAttr, extraStyle = '') {
    return class extends Mark {

        get name() {
            return `inline-${styleAttr}`;
        }

        get defaultOptions() {
            return {
                unsetValue: 'unset'
            };
        }

        get schema() {
            return {
                attrs: {
                    [styleAttr]: {
                        default: null
                    }
                },
                parseDOM: [
                    {
                        style: styleAttr,
                        getAttrs: value => ({
                            [styleAttr]: value
                        })
                    }
                ],
                toDOM: mark => ['span', {
                    style: `${styleAttr}: ${mark.attrs[styleAttr]};${extraStyle}`
                }, 0]
            };
        }

        commands({type}) {
            return attrs => {
                const {unsetValue} = this.options;
                if (attrs[styleAttr] === unsetValue) {
                    return removeMark(type);
                }

                return updateMark(type, attrs);
            };
        }

    };
}
