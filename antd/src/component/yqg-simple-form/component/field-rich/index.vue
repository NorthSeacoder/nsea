<!-- @author xiaodongyu -->
<!-- @email xiaodongyu@yangqianguan.com -->
<!-- @date 2020-10-15 13:08:17 -->
<!-- @desc index.vue -->

<template>
    <div class="field-rich">
        <template v-if="!disabled">
            <editor-menu-bar v-slot="{commands, isActive}" :editor="editor">
                <div class="menubar">
                    <div class="row">
                        <a-tooltip
                            v-for="{icon, cmd} in $options.CmdIcon.action"
                            :key="cmd"
                            :title="$t(prefix(cmd))"
                        >
                            <button
                                class="menubar__button"
                                @click="commands[cmd]"
                            >
                                <a-icon :type="icon" />
                            </button>
                        </a-tooltip>
                        <a-tooltip
                            v-for="{cmd, icon, text, arg, title} in $options.CmdIcon.active.row1"
                            :key="text || icon || cmd"
                            :title="$t(prefix(title || cmd))"
                        >
                            <button
                                :class="{'is-active': isActive[cmd](arg)}"
                                class="menubar__button"
                                @click="commands[cmd](arg)"
                            >
                                <a-icon v-if="icon" :type="icon" />
                                <template v-else>
                                    {{ text }}
                                </template>
                            </button>
                        </a-tooltip>
                    </div>
                    <div class="row">
                        <a-tooltip
                            v-for="{cmd, icon, text, arg, title} in $options.CmdIcon.active.row2"
                            :key="text || icon || cmd"
                            :title="$t(prefix(title || cmd))"
                        >
                            <button
                                :class="{'is-active': isActive[cmd](arg)}"
                                class="menubar__button"
                                @click="commands[cmd](arg)"
                            >
                                <a-icon v-if="icon" :type="icon" />
                                <template v-else>
                                    {{ text }}
                                </template>
                            </button>
                        </a-tooltip>
                        <a-tooltip :title="$t(prefix('fontSize'))">
                            <button
                                :class="{'is-active': isActive['inline-font-size']()}"
                                class="menubar__button"
                            >
                                <inline-font-size-btn
                                    @change="onInlineStyleChange(commands, 'font-size', $event)"
                                />
                            </button>
                        </a-tooltip>
                        <a-tooltip :title="$t(prefix('fontColor'))">
                            <button
                                :class="{'is-active': isActive['inline-color']()}"
                                class="menubar__button no-padding"
                            >
                                <inline-color-btn
                                    @change="onInlineStyleChange(commands, 'color', $event)"
                                >
                                    <template #default="{color}">
                                        <a-icon
                                            :style="`color: ${color};`"
                                            class="inline-style-btn-icon"
                                            type="font-colors"
                                            @click="onInlineStyleChange(commands, 'color', color)"
                                        />
                                    </template>
                                </inline-color-btn>
                            </button>
                        </a-tooltip>
                        <a-tooltip :title="$t(prefix('backgroundColor'))">
                            <button
                                :class="{'is-active': isActive['inline-background-color']()}"
                                class="menubar__button no-padding"
                            >
                                <inline-color-btn
                                    @change="onInlineStyleChange(commands, 'background-color', $event)"
                                >
                                    <template #default="{color}">
                                        <a-icon
                                            :style="`color: ${color};`"
                                            class="inline-style-btn-icon"
                                            type="bg-colors"
                                            @click="onInlineStyleChange(commands, 'background-color', color)"
                                        />
                                    </template>
                                </inline-color-btn>
                            </button>
                        </a-tooltip>
                        <a-tooltip :title="$t(prefix('link'))">
                            <button
                                class="menubar__button"
                                @click="openLinkModal(commands.anchor)"
                            >
                                <a-icon type="link" />
                            </button>
                        </a-tooltip>
                        <a-tooltip :title="$t(prefix('image'))">
                            <button
                                class="menubar__button"
                                @click="openImageUploadModal(commands.image, commands.hard_break)"
                            >
                                <a-icon type="file-image" />
                            </button>
                        </a-tooltip>
                        <a-tooltip :title="$t(prefix('file'))">
                            <button
                                class="menubar__button"
                                @click="openFileUploadModal(commands.anchor, commands.hard_break)"
                            >
                                <a-icon type="file" />
                            </button>
                        </a-tooltip>
                        <a-tooltip :title="$t(prefix('table'))">
                            <button
                                class="menubar__button"
                                @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
                            >
                                <a-icon type="custom-table" />
                            </button>
                        </a-tooltip>
                        <template v-if="isActive.table()">
                            <a-tooltip
                                v-for="{icon, cmd} in $options.CmdIcon.table"
                                :key="cmd"
                                :title="$t(prefix(cmd))"
                            >
                                <button
                                    class="menubar__button"
                                    @click="commands[cmd]"
                                >
                                    <a-icon :type="icon" />
                                </button>
                            </a-tooltip>
                        </template>
                    </div>
                </div>
            </editor-menu-bar>
            <div class="search">
                <input
                    v-model="searchTerm"
                    :placeholder="$t(prefix('search'))"
                    type="text"
                    @keydown.enter.prevent="onSearch(editor.commands.find)"
                >
                <input
                    v-model="replaceWith"
                    :placeholder="$t(prefix('replace'))"
                    type="text"
                >
                <a-button
                    size="small"
                    class="search-btn"
                    @click="onSearch(editor.commands.find)"
                >
                    {{ $t(prefix('search')) }}
                </a-button>
                <a-button
                    size="small"
                    class="search-btn"
                    @click="onClear(editor.commands.clearSearch)"
                >
                    {{ $t(prefix('clear')) }}
                </a-button>
                <a-button
                    size="small"
                    :disabled="!searchTerm ||!replaceWith"
                    class="search-btn"
                    @click="onReplace(editor.commands.find, editor.commands.replace)"
                >
                    {{ $t(prefix('replace')) }}
                </a-button>
                <a-button
                    size="small"
                    :disabled="!searchTerm ||!replaceWith"
                    class="search-btn"
                    @click="onReplace(editor.commands.find, editor.commands.replaceAll)"
                >
                    {{ $t(prefix('replaceAll')) }}
                </a-button>
            </div>
        </template>
        <editor-content class="editor__content" :editor="editor" />
    </div>
</template>

<script type="text/babel">
import {Editor, EditorContent, EditorMenuBar} from 'tiptap';
import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    HorizontalRule,
    OrderedList,
    BulletList,
    ListItem,
    TodoItem,
    TodoList,
    Bold,
    Code,
    Image,
    Italic,
    Strike,
    Underline,
    History,
    Table,
    TableHeader,
    TableCell,
    TableRow,
    Search
} from 'tiptap-extensions';

import ImageUploadModal from '../../modal/image-upload-modal';
import FileUploadModal from '../../modal/file-upload-modal';
import Anchor from './node/anchor';
import Alignment from './mark/alignment';
import InlineStyle from './mark/inline-style';
import InlineColorBtn from './inline-color-btn';
import InlineFontSizeBtn from './inline-font-size-btn';

export default {
    name: 'FieldRich',

    components: {
        EditorMenuBar,
        EditorContent,
        InlineColorBtn,
        InlineFontSizeBtn
    },

    model: {
        props: 'value',
        event: 'change'
    },

    props: {
        value: {
            type: String,
            default: undefined
        },

        disabled: {
            type: Boolean,
            default: false
        },

        fileDef: {
            type: Object,
            default: undefined
        },

        imageDef: {
            type: Object,
            default: undefined
        }
    },

    CmdIcon: {
        action: [
            {cmd: 'undo', icon: 'undo'},
            {cmd: 'redo', icon: 'redo'},
            {cmd: 'horizontal_rule', icon: 'minus'}
        ],
        active: {
            row1: [
                {cmd: 'paragraph', text: 'P'},
                {cmd: 'heading', arg: {level: 1}, text: 'H1', title: 'h1'},
                {cmd: 'heading', arg: {level: 2}, text: 'H2', title: 'h2'},
                {cmd: 'heading', arg: {level: 3}, text: 'H3', title: 'h3'},
                {cmd: 'heading', arg: {level: 4}, text: 'H4', title: 'h4'},
                {cmd: 'heading', arg: {level: 5}, text: 'H5', title: 'h5'},
                {cmd: 'heading', arg: {level: 6}, text: 'H6', title: 'h6'},
                {cmd: 'bullet_list', icon: 'unordered-list'},
                {cmd: 'ordered_list', icon: 'ordered-list'},
                {cmd: 'blockquote', text: '”'},
                {cmd: 'code', text: '``'},
                {cmd: 'code_block', text: '<>'},
                {cmd: 'left', icon: 'align-left', title: 'tal'},
                {cmd: 'center', icon: 'align-center', title: 'tac'},
                {cmd: 'right', icon: 'align-right', title: 'tar'}
            ],
            row2: [
                {cmd: 'bold', icon: 'bold'},
                {cmd: 'italic', icon: 'italic'},
                {cmd: 'strike', icon: 'strikethrough'},
                {cmd: 'underline', icon: 'underline'}
            ]
        },
        table: [
            {cmd: 'deleteTable', icon: 'custom-delete-table'},
            {cmd: 'addColumnBefore', icon: 'custom-add-col-before'},
            {cmd: 'addColumnAfter', icon: 'custom-add-col-after'},
            {cmd: 'deleteColumn', icon: 'custom-delete-col'},
            {cmd: 'addRowBefore', icon: 'custom-add-row-before'},
            {cmd: 'addRowAfter', icon: 'custom-add-row-after'},
            {cmd: 'deleteRow', icon: 'custom-delete-row'},
            {cmd: 'toggleCellMerge', icon: 'custom-combine-cells'}
        ]
    },

    data() {
        const InlineColor = InlineStyle('color');
        const InlineBgc = InlineStyle('background-color', 'display: inline-block;');
        const InlineFontSize = InlineStyle('font-size');
        const AlignLeft = Alignment('left');
        const AlignCenter = Alignment('center');
        const AlignRight = Alignment('right');
        const {disabled} = this;

        return {
            searchTerm: '',
            replaceWith: '',
            editor: new Editor({
                extensions: [
                    new Anchor(),
                    new Blockquote(),
                    new BulletList(),
                    new CodeBlock(),
                    new HardBreak(),
                    new Heading(),
                    new HorizontalRule(),
                    new ListItem(),
                    new OrderedList(),
                    new TodoItem(),
                    new TodoList(),
                    new Bold(),
                    new Code(),
                    new Image(),
                    new Italic(),
                    new Strike(),
                    new Underline(),
                    new History(),
                    new Table({resizable: true}),
                    new TableHeader(),
                    new TableCell(),
                    new TableRow(),
                    new Search({disableRegex: false}),
                    new InlineColor(),
                    new InlineBgc(),
                    new InlineFontSize(),
                    new AlignLeft(),
                    new AlignCenter(),
                    new AlignRight()
                ],

                content: this.value || '<p/>'.repeat(3),

                onUpdate: evt => this.$emit('change', evt.getHTML()),

                editable: !disabled
            })
        };
    },

    watch: {
        value(val) {
            if (val !== this.editor.getHTML()) {
                this.editor.setContent(val);
            }
        }
    },

    methods: {
        prefix(cmd) {
            const i18nKey = cmd.replace(/_(.)/g, (match, letter) => letter.toUpperCase());
            return `rich.${i18nKey}`;
        },

        async openImageUploadModal(imageCmd, brCmd) {
            const {imageDef} = this;
            const {file = {}, imageUrl} = await this.$modal.open(ImageUploadModal, {imageDef, multiple: true});
            [].concat(file).forEach(({id, url}) => {
                imageCmd({src: url || imageUrl, title: id});
                brCmd();
            });
        },

        async openFileUploadModal(anchorCmd, brCmd) {
            const {fileDef} = this;
            const {file = {}, fileUrl, fileDesc} = await this.$modal.open(FileUploadModal, {fileDef, multiple: true});
            [].concat(file).forEach(({id, url, name}) => {
                const href = url || fileUrl;
                anchorCmd({href, text: ` ${name || fileDesc || href} `, title: id, target: '_blank', icon: 'file'});
                brCmd();
            });
        },

        async openLinkModal(anchorCmd) {
            const options = {
                layout: 'horizontal',
                fieldDefs: [
                    {field: 'url', label: this.prefix('linkUrl'), required: true},
                    {field: 'desc', label: this.prefix('linkDesc')}
                ]
            };
            const LinkModal = ({props: {close, dismiss}}) => (
                <yqg-simple-form
                    title={this.$t(this.prefix('insertLink'))}
                    options={options}
                    vOn:confirm={close}
                    vOn:cancel={dismiss}
                />
            );
            const {values: {url, desc}} = await this.$modal.open(LinkModal);
            anchorCmd({href: url, text: ` ${desc || url} `, target: '_blank'});
        },

        onInlineStyleChange(cmds, styleAttr, value) {
            cmds[`inline-${styleAttr}`]({[styleAttr]: value});
        },

        onSearch(searchCmd) {
            const {searchTerm} = this;
            if (!searchTerm) return;

            searchCmd(searchTerm);
        },

        onClear(clearCmd) {
            Object.assign(this, {
                searchTerm: '',
                replaceWith: ''
            });
            clearCmd();
        },

        onReplace(searchCmd, replaceCmd) {
            const {searchTerm, replaceWith} = this;
            searchCmd(searchTerm);
            replaceCmd(replaceWith);
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import './rich.scss';

$color-black: #000000;
$color-white: #ffffff;
$color-grey: #dddddd;

.field-rich {
    position: relative;
    line-height: 1.5;

    .menubar {
        transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;
        line-height: 1;

        &.is-hidden {
            visibility: hidden;
            opacity: 0;
        }

        &.is-focused {
            visibility: visible;
            opacity: 1;
            transition: visibility 0.2s, opacity 0.2s;
        }

        .row {
            margin: 10px 0;
        }

        &__button {
            display: inline-flex;
            background: transparent;
            border: 0;
            color: $color-black;
            padding: 0.2rem 0.5rem;
            margin-right: 0.2rem;
            border-radius: 3px;
            cursor: pointer;
            outline: none;

            &:hover {
                background-color: rgba($color-black, 0.05);
            }

            &.is-active {
                background-color: rgba($color-black, 0.1);
            }

            &.no-padding {
                padding: 0;
            }
        }

        .inline-style-btn-icon {
            padding: .2rem 0 .2rem .5rem;
        }

        span#{&}__button {
            font-size: 13.3333px;
        }
    }

    .search {
        margin-bottom: 10px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        background-color: rgba($color-black, 0.1);
        padding: 0.5rem;
        border-radius: 5px;

        input {
            padding: 0.25rem;
            border: 0;
            border-radius: 3px;
            margin-right: 0.2rem;
            color: #000;
            font: inherit;
            font-size: 0.8rem;
            width: 20%;
            flex: 1;
            outline: none;
        }

        &-btn {
            margin-right: .2rem;
        }
    }

    ::v-deep .find {
        background: rgba(255, 213, 0, 0.5);
    }

    .editor__content {
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        padding: 10px;
        border: 1px solid #eee;
        max-height: 500px;
        overflow-y: auto;

        ::v-deep {
            @include rich;

            a {
                text-decoration: underline;
            }

            * {
                caret-color: currentColor;
                outline: none;
            }

            .resize-cursor {
                cursor: ew-resize;
                cursor: col-resize;
            }
        }
    }
}
</style>
