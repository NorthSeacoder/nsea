<!-- @author ruiwang -->
<!-- @email ruiwang@yangqianguan.com -->
<!-- @date 2020-9-7 19:06:59 -->
<!-- @desc field-radio.vue -->

<script type="text/babel">
import {enumType} from '../../../mixin';
import {numbersToStr} from '../../../util/object';

export default {
    name: 'FieldRadio',

    mixins: [enumType],

    props: {
        value: {
            type: [Number, String, Boolean],
            default: undefined
        },

        def: {
            type: Object,
            required: true
        },

        cancelable: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            compValue: numbersToStr(this.value)
        };
    },

    watch: {
        value(val) {
            if (val === this.compValue) return;

            this.compValue = numbersToStr(val);
        }
    },

    methods: {
        renderColOption(option) {
            const {def: {optionCol: column}} = this;
            const colProps = {
                key: option.value,
                ...column
            };
            return (
                <a-col {...{props: colProps}}>
                    {this.renderOption({option})}
                </a-col>
            );
        },

        renderOption({option, key}) {
            const {$scopedSlots, def, def: {radioButton}} = this;
            const {value, label} = option;
            const Comp = radioButton ? 'a-radio-button' : 'a-radio';
            return (
                <Comp key={key} value={value} vOn:click={() => this.onClick(value)}>
                    {$scopedSlots.optionLabel?.({def, option, value: this.value}) ?? label}
                </Comp>
            );
        },

        onChange(val) {
            this.$emit('change', val);
        },

        onClick(val) {
            if (!this.cancelable) return;

            if (val === this.compValue) {
                this.compValue = undefined;
                this.$emit('change', undefined);
            }
        }
    },

    render() {
        const {options, compValue, def: {props, optionCol}} = this;
        const optionItems = options.map(opt => (optionCol
            ? this.renderColOption(opt)
            : this.renderOption({option: opt, key: opt.value})));
        return (
            <a-radio-group value={compValue} {...{props}} vOn:change={this.onChange}>
                {optionCol ? (
                    <a-row>{optionItems}</a-row>
                ) : optionItems}
            </a-radio-group>
        );
    }
};
</script>
