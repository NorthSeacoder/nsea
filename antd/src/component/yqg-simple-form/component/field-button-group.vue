<template>
    <a-button-group>
        <a-button
            v-if="needAll"
            :type="!active && active !== 0 ? 'primary' : 'default'"
            @click="onClick()"
        >
            {{ $t('common.all') }}
        </a-button>
        <a-button
            v-for="opt in options"
            :key="opt.value"
            :type="active === opt.value ? 'primary' : 'default'"
            @click="onClick(opt.value)"
        >
            {{ opt.label }}
        </a-button>
    </a-button-group>
</template>

<script>
    import {enumType} from '../../../mixin';

    export default {
        name: 'FieldButtonGroup',

        mixins: [enumType],

        model: {
            prop: 'value',
            event: 'change'
        },

        props: {
            value: {
                type: [String, Number],
                default: undefined
            },

            needAll: {
                type: Boolean,
                default: true
            }
        },

        data() {
            return {
                active: this.value
            };
        },

        watch: {
            value(val) {
                if (this.active === val) {return;}
                this.active = val;
            }
        },

        methods: {
            onClick(val) {
                if (this.active === val) {return;}

                this.active = val;
                this.$emit('change', val);
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
