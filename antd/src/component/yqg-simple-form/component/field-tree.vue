<!-- @author ruiwang -->
<!-- @email ruiwang@yangqianguan.com -->
<!-- @date 2020-9-7 18:37:27 -->
<!-- @desc field-tree.vue -->

<template>
    <a-tree-select
        v-model="compValue"
        v-bind="compProps"
        @change="onChange"
    />
</template>

<script>
import {enumType} from '../../../mixin';
import {numbersToStr} from '../../../util/object';

export default {
    name: 'FieldTree',

    mixins: [enumType],

    props: {
        value: {
            type: [Number, String, Array],
            default: undefined
        },

        def: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            compValue: numbersToStr(this.value)
        };
    },

    computed: {
        compProps() {
            const {list, def: {props}} = this;
            const treeData = this.formatTreeData(list);
            return {...props, treeData};
        }
    },

    watch: {
        value(val) {
            if (val === this.compValue) return;

            this.compValue = numbersToStr(val);
        }
    },

    methods: {
        formatTreeData(list) {
            if (!list.length) {return list;}

            return list.map(({children, id, name, disabled, selectable}) => ({
                title: name,
                value: `${id}`,
                key: `${id}`,
                disabled,
                selectable,
                children: children ? this.formatTreeData(children) : null
            }));
        },

        onChange(val) {
            this.$emit('change', val);
        }
    }
};
</script>
