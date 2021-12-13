/*
 * @Author: xiaodongyu
 * @Date 2020-11-19 23:39:01
 * @Last Modified by: xiaodongyu
 * @Last Modified time: 2020-12-19 11:11:18
 */

import {Mark} from 'tiptap';
import {toggleMark} from 'tiptap-commands';

export default function Alignment(align) {
    return class extends Mark {

        get name() {
            return align;
        }

        get schema() {
            return {
                attrs: {
                    align: {
                        default: null
                    }
                },
                parseDOM: [
                    {
                        style: 'text-align',
                        getAttrs: value => ({
                            align: value
                        })
                    }
                ],
                toDOM: mark => ['span', {
                    style: `text-align: ${mark.attrs.align};display: block;`
                }, 0]
            };
        }

        commands({type}) {
            return () => toggleMark(type, {align});
        }

    };
}
