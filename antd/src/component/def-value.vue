<!-- @author xiaodongyu -->
<!-- @date 2019/11/1-17:18 -->
<!-- @desc def-value -->

<script type="text/babel">
import Enum from '@yqg/enum';

import genText from '../mixin/gen-text';
import DefType from '../constant/def-type';
import {evalProp, spreadProps} from '../util/object';

export default {
    name: 'DefValue',

    mixins: [genText],

    props: {
        ctx: {
            type: Object,
            default: () => ({})
        },
        def: {
            type: Object,
            required: true
        },
        value: {
            type: [String, Number, Array, Boolean, Object],
            default: ''
        },
        values: {
            type: Object,
            default: () => ({})
        },
        record: {
            type: Object,
            default: () => ({})
        },
        defaultText: {
            type: String,
            default: ''
        }
    },

    data() {
        return {
            mapKey: '',
            enumType: null
        };
    },

    computed: {
        comp() {
            const {value, def: {type}} = this;

            return (value && value.constructor === Array)
                || type === DefType.textarea
                || type === DefType.code ? 'pre' : 'span';
        },

        text() {
            // from mixin
            return this.genText(this);
        },

        staticProps() {
            const {def: {staticProps}} = this;
            return evalProp(staticProps, this);
        }
    },

    async mounted() {
        const {field} = this.def;
        let {enumType} = this.def;

        if (enumType) {
            enumType = evalProp(enumType, this);

            if (typeof enumType === 'string') {
                this.mapKey = enumType;
                this.$emit('enumLoaded', {
                    field,
                    mapKey: enumType
                });
                return;
            }

            const {QUERY_PROMISE, query} = enumType;
            const queryPromise = QUERY_PROMISE || (query && query());
            if (queryPromise) {
                await queryPromise;
            }

            // 传对象
            if (enumType.constructor !== Enum) {
                enumType = Enum.from(enumType);
            }

            this.enumType = enumType;
            this.$emit('enumLoaded', {
                field,
                enumType
            });
        }
    },

    render() {
        const {
            $scopedSlots: {default: defaultSlot},
            comp: Comp, def: {type, formOptions}, staticProps, text, value, defaultText
        } = this;
        if (defaultSlot) {
            return defaultSlot({...this, ...this.staticProps});
        }

        if (type === 'rich') {
            return (
                <div
                    class="def-value-rich"
                    domPropsInnerHTML={value}
                    {...(staticProps && spreadProps(staticProps))}
                />
            );
        }

        if (formOptions) {
            const list = value?.map?.((formVal, idx) => (
                <yqg-static-form
                    key={idx}
                    options={{layout: 'inline', ...formOptions}}
                    values={formVal}
                />
            ));
            return (
                <div>{list || defaultText}</div>
            );
        }

        return (
            <Comp
                class="def-value"
                {...(staticProps && spreadProps(staticProps))}
            >
                {text}
            </Comp>
        );
    }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import './yqg-simple-form/component/field-rich/rich.scss';

.def-value {
    margin: 0;

    &-rich ::v-deep {
        line-height: 1.5;

        @include rich;
    }
}
</style>
