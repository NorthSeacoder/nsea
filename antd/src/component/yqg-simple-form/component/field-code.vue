<!-- @author xiaodongyu -->
<!-- @email xiaodongyu@yangqianguan.com -->
<!-- @date 2020-02-15 10:03:47 -->
<!-- @desc field-code.vue -->

<template>
    <div class="field-code">
        <div class="code-wrapper">
            <pre class="lang-json line-numbers" :style="preStyle"><code
                 ref="code"
                 v-text="value"
             /></pre>
            <a-textarea :value="value" class="textarea" @change="onChange" @scroll="onScroll" />
        </div>
        <a-button @click="format()" v-text="$t('common.format')" />
    </div>
</template>

<script type="text/babel">
import Prism from 'prismjs';

export default {
    name: 'FieldCode',

    model: {
        prop: 'value',
        event: 'change'
    },

    props: {
        value: {
            type: String,
            default: ''
        },
        def: {
            type: Object,
            required: true
        }
    },

    computed: {
        preStyle() {
            let {def: {height: maxHeight}} = this;

            if (!maxHeight) return {};

            if (typeof maxHeight === 'number') {
                maxHeight = `${maxHeight}px`;
            }

            return {maxHeight};
        }
    },

    watch: {
        value: {
            handler: 'highlightHandler',
            immediate: true
        }
    },

    methods: {
        highlightHandler() {
            this.$nextTick(() => {
                if (!this.$refs.code) return;

                Prism.highlightElement(this.$refs.code);
            });
        },

        format() {
            if (!this.value) return;

            try {
                let tmp; // eslint-disable-line
                const formatedValue = JSON.stringify(eval(`tmp=${this.value}`), null, 2); // eslint-disable-line
                this.$emit('change', formatedValue);
            } catch (err) {
                this.$message.error(this.$t('common.formatFailed'));
            }
        },

        onChange(event) {
            const {target, target: {value, selectionStart}, inputType} = event;
            if (inputType === 'insertLineBreak') {
                const preString = value.substring(0, selectionStart - 1);
                const preLine = preString.substring(preString.lastIndexOf('\n') + 1);
                const preWhitespace = (preLine.match(/^(\s*).*$/) || [])[1] || '';
                if (preWhitespace) {
                    this.$emit('change', `${preString}\n${preWhitespace}${value.substring(selectionStart)}`);
                    this.$nextTick(() => {
                        target.selectionStart = selectionStart + preWhitespace.length;
                        target.selectionEnd = target.selectionStart;
                    });
                    return;
                }
            }

            this.$emit('change', value);
        },

        onScroll(event) {
            this.$refs.code.parentElement.scrollLeft = event.target.scrollLeft;
            this.$refs.code.parentElement.scrollTop = event.target.scrollTop;
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.field-code {
    .code-wrapper {
        position: relative;
        margin-bottom: .4em;

        .textarea {
            position: absolute;
            padding: 1em;
            padding-left: 3.8em;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
            color: transparent;
            caret-color: black;
            line-height: 1.5;
            white-space: pre;
            background: transparent;
        }
    }

    pre {
        min-height: 100px;
        border: 1px solid transparent;
        overflow: auto;
        margin: 0;
    }
}
</style>
