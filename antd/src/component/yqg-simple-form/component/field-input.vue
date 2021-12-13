<!-- @author wenxiujiang -->
<!-- @email wenxiujiang@yangqianguan.com -->
<!-- @date 2020-9-7 18:51:49 -->
<!-- @desc field-input.vue -->

<template>
    <a-input
        :value="value"
        :type="type"
        v-bind="def.props"
        @change="onChange"
        @pressEnter="onPressEnter"
        @blur="onBlur"
    >
        <a-icon
            v-if="isPassword"
            slot="suffix"
            :type="invisible ? 'beauty-eye-invisible-o' : 'beauty-eye-o'"
            @click="toggleType"
        />
        <slot slot="prefix" name="prefix" />
        <slot slot="suffix" name="suffix" />
        <slot slot="addonAfter" name="addonAfter" />
        <slot slot="addonBefore" name="addonBefore" />
    </a-input>
</template>

<script type="text/babel">
    export default {
        name: 'FieldInput',

        model: {
            prop: 'value',
            event: 'change'
        },

        props: {
            value: {
                type: [String, Number],
                default: ''
            },
            def: {
                type: Object,
                required: true
            }
        },

        data() {
            return {
                invisible: true
            };
        },

        computed: {
            isPassword() {
                return this.def.props.type === 'password';
            },

            type() {
                if (this.isPassword) {
                    return this.invisible ? 'password' : 'text';
                }

                return 'text';
            }
        },

        methods: {
            toggleType() {
                this.invisible = !this.invisible;
            },

            onChange(val) {
                this.$emit('change', val);
            },

            onPressEnter(evt) {
                this.$emit('pressEnter', evt);
            },

            onBlur(evt) {
               this.$emit('blur', evt.target.value);
            }
        }
    };
</script>
