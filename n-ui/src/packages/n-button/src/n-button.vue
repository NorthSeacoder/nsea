<template>
    <div :class="className" class="n-button">
        <button
            :autofocus="autofocus"
            :disabled="disabled"
            :name="name"
            :style="ntnStyle"
            :type="type"
            @click="handleClick">
            <slot></slot>
        </button>
    </div>

</template>

<script>
import {isValidTheme, isValidType, isValidShape, isValidSize} from './options';

export default {
    name: 'NButton',

    props: {
        autofocus: {
            type: Boolean,
            default: false
        },

        ntnStyle: {
            type: Object,
            default: () => {}
        },

        disabled: {
            type: Boolean,
            default: false
        },

        theme: {
            type: String,
            validator: isValidTheme,
            default: 'normal'
        },

        name: {
            type: String,
            default: null
        },

        shape: {
            type: String,
            validator: isValidShape,
            default: 'normal'
        },

        size: {
            type: String,
            validator: isValidSize,
            default: 'md'
        },

        type: {
            type: String,
            validator: isValidType,
            default: 'submit'
        }
    },

    computed: {
        className() {
            const vm = this;
            const {theme, shape, size} = vm;

            return [
                `theme-${theme}`,
                `shape-${shape}`,
                `size-${size}`
            ];
        }
    },

    methods: {
        handleClick(event) {
            const vm = this;
            vm.$emit('click', event);
        }
    }
};

</script>
