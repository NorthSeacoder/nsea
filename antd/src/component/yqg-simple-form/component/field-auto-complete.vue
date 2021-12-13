<!-- @author ruiwang -->
<!-- @email ruiwang@yangqianguan.com -->
<!-- @date 2020-11-30 17:44:11 -->
<!-- @desc field-auto-complete.vue -->

<template>
    <a-auto-complete
        :value="value"
        v-bind="def.props"
        :filter-option="filterOption"
        :data-source="list"
        allow-clear
        option-label-prop="value"
        @change="onChange"
    />
</template>

<script>
import enumType from '../../../mixin/enum-type';

export default {
    name: 'FieldAutoComplete',

    mixins: [enumType],

    props: {
        value: {
            type: [String],
            default: undefined
        },

        def: {
            type: Object,
            required: true
        }
    },

    methods: {
        onChange(val) {
            this.$emit('change', val);
        },

        filterOption(input, option) {
            const {def: {props: {filterOption} = {}}} = this;
            if (typeof filterOption === 'function') return filterOption(input, option);

            const text = this.wrappedEnumType.getText(option.key);
            return text.includes(input);
        }
    }
};
</script>
