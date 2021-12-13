<!-- @author ruiwang -->
<!-- @email ruiwang@yangqianguan.com -->
<!-- @date 2019-12-11 11:32:23 -->
<!-- @desc index.vue -->

<template>
    <div>
        <template v-if="!single">
            <a-checkbox
                v-if="!def.checkAllInvisible"
                v-bind="def.props"
                :indeterminate="indeterminate"
                :checked="checkAll"
                :class="{'block-item': !!def.checkAllLabel}"
                @change="onCheckAllChange"
            >
                {{ def.checkAllLabel || $t('common.checkAll') }}
            </a-checkbox>
            <a-checkbox-group v-model="checkedList" v-bind="def.props" :options="options" @change="onChange" />
        </template>
        <a-checkbox v-else v-bind="def.props" :checked="checked" @change="onChange">
            {{ $t(single) }}
        </a-checkbox>
    </div>
</template>

<script type="text/babel">
import {enumType} from '../../../mixin';
import {numbersToStr} from '../../../util/object';

export default {
    name: 'FieldCheckbox',

    mixins: [enumType],

    props: {
        value: {
            type: [Boolean, Array, String],
            default: undefined
        },
        single: {
            type: String,
            default: ''
        },
        parseFun: {
            type: Function,
            default: val => val
        },
        def: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            checked: false,
            checkedList: [],
            checkAll: false,
            indeterminate: false
        };
    },

    watch: {
        options() {
            this.setIndeterminateAndCheckAll();
        },

        value: {
            handler: 'valueHandler',
            immediate: true
        }
    },

    methods: {
        valueHandler(val) {
            const {parseFun, single} = this;

            if (val === this.checkedList || (single && val === this.checked)) return;

            if (this.single) {
                this.checked = parseFun(val);
            } else {
                this.checkedList = numbersToStr(val);
                this.setIndeterminateAndCheckAll(val);
            }
        },

        setIndeterminateAndCheckAll(val) {
            const {options, single, value} = this;
            val = val || value;
            const len = val && val.length;
            if (!single) {
                this.indeterminate = !!len && len < options.length;
                this.checkAll = !!len && len === options.length;
            }
        },
        onChange(event) {
            const {checked} = this;
            event = event.target ? event.target.checked : event;

            if (this.single) {
                event = !checked;
            } else {
                this.setIndeterminateAndCheckAll(event);
            }

            this.$emit('change', event);
        },
        onCheckAllChange(event) {
            const {options} = this;

            Object.assign(this, {
                checkedList: event.target.checked ? this.getValues(options) : [],
                indeterminate: false,
                checkAll: event.target.checked
            });

            this.$emit('change', this.checkedList);
        },
        getValues(arr) {
            return arr.map(item => item.value || item);
        }
    }
};
</script>

<style lang="scss" scoped>
.block-item {
    display: block;
}
</style>
