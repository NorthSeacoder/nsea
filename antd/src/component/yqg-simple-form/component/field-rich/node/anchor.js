/*
 * @Author: xiaodongyu
 * @Date 2020-10-29 16:14:09
 * @Last Modified by: xiaodongyu
 * @Last Modified time: 2020-12-19 11:23:31
 */

import {InputRule} from 'prosemirror-inputrules';
import {Node, Plugin} from 'tiptap';
import {getMarkAttrs} from 'tiptap-utils';

/**
 * Matches following attributes in Markdown-typed anchor: [, alt, src, title]
 *
 * Example:
 * [Lorem](image.jpg) -> [, "Lorem", "image.jpg"]
 * [](image.jpg "Ipsum") -> [, "", "image.jpg", "Ipsum"]
 * [Lorem](image.jpg "Ipsum") -> [, "Lorem", "image.jpg", "Ipsum"]
 */
// ref: https://github.com/ueberdosis/tiptap/blob/main/packages/tiptap-extensions/src/nodes/Image.js
const ANCHOR_INPUT_REGEX = /\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

export default class Anchor extends Node {

    get name() {
        return 'anchor';
    }

    get defaultOptions() {
        return {
            openOnClick: true,
            target: null
        };
    }

    get schema() {
        return {
            content: 'inline*',
            group: 'inline',
            draggable: false,
            inline: true,
            attrs: {
                href: {
                    default: null
                },
                target: {
                    default: null
                },
                title: {
                    default: null
                },
                icon: {
                    default: null
                }
            },
            parseDOM: [
                {
                    tag: 'a[href]',
                    getAttrs: dom => ({
                        href: dom.getAttribute('href'),
                        target: dom.getAttribute('target'),
                        title: dom.getAttribute('title')
                    }),
                    preserveWhitespace: true
                }
            ],
            toDOM: node => ['a', {
                target: this.options.target,
                ...node.attrs,
                rel: 'noopener noreferrer nofollow'
            }, 0]
        };
    }

    commands({type, schema}) {
        return attrs => (state, dispatch) => {
            const {selection} = state;
            const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos;
            const node = type.create(attrs, [
                schema.nodes.anticon.create({type: attrs.icon ?? 'link'}),
                schema.text(attrs.text)
            ]);
            const transaction = state.tr.insert(position, node);
            dispatch(transaction);
        };
    }

    inputRules({type, schema}) {
        return [
            new InputRule(ANCHOR_INPUT_REGEX, (state, match, start, end) => {
                const [, text, href, title] = match;
                const attrs = {href, title};
                const {tr} = state;

                if (match[0]) {
                    tr.replaceWith(start - 1, end, type.create(attrs, [
                        schema.nodes.anticon.create({type: 'link'}),
                        schema.text(text)
                    ]));
                }

                return tr;
            })
        ];
    }

    get plugins() {
        if (!this.options.openOnClick) {
            return [];
        }

        return [
            new Plugin({
                props: {
                    handleClick: (view, pos, event) => {
                        const {schema} = view.state;
                        const attrs = getMarkAttrs(view.state, schema.marks.anchor);

                        if (attrs.href && event.target instanceof HTMLAnchorElement) {
                            event.stopPropagation();
                            window.open(attrs.href);
                        }
                    }
                }
            })
        ];
    }

}
