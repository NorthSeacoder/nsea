<!-- @author ruiwang -->
<!-- @email ruiwang@yangqianguan.com -->
<!-- @date 2020-9-7 17:46:10 -->
<!-- @desc field-select.vue -->

<template>
    <a-select
        v-model="compValue"
        v-bind="def.props"
        @change="onChange"
        @search="onSearch"
    >
        <a-select-option
            v-for="{label, value: val, pinyin} in selectOptions"
            :key="val"
            :value="val"
            :pinyin="pinyin"
        >
            {{ label }}
        </a-select-option>
    </a-select>
</template>

<script>
import {enumType} from '../../../mixin';
import {numbersToStr} from '../../../util/object';

export default {
    name: 'FieldSelect',

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
        const {def: {props: {mode}}, value} = this;
        const compValue = mode === 'multiple' && !value ? undefined : numbersToStr(value);
        return {
            compValue,
            searchText: undefined,
            changed: false
        };
    },

    computed: {
        selectOptions() {
            const {def: {validateSearch}, compValue, searchText, options} = this;
            if (validateSearch) {
                return options.filter(({value, pinyin}) => {
                    if (searchText) {
                        return pinyin.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
                    }
                    return [].concat(compValue).includes(value);
                });
            }
            return options;
        }
    },

    watch: {
        value(val) {
            if (val === this.compValue) return;

            const {def: {props: {mode}}} = this;
            if (mode === 'multiple' && !val) val = undefined;

            this.getSuperText(val);
        },

        wrappedEnumType() {
            const {value} = this;
            this.getSuperText(value);
        }
    },

    methods: {
        onChange(val) {
            const {wrappedEnumType, changed} = this;

            if (!changed && Array.isArray(val)) {
                val = val.filter(item => wrappedEnumType.MAP[item]);
                this.changed = true;
            }

            this.$emit('change', val);
        },

        onSearch(val) {
            this.searchText = val;
            this.$emit('search', val);
        },

        getSuperText(value) {
            const {wrappedEnumType} = this;
            let res;
            const getText = key => {
                if (wrappedEnumType && !wrappedEnumType.MAP[key]) {
                    return wrappedEnumType.getText(key);
                }
                return key;
            };
            if (Array.isArray(value)) {
                res = value.map(item => getText(item));
            } else {
                res = getText(value);
            }

            this.compValue = numbersToStr(res);
        }
    }
};
</script>
