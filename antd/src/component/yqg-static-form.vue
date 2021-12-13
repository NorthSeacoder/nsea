<!-- @author xiaodongyu -->
<!-- @email xiaodongyu@yangqianguan.com -->
<!-- @date 2019-12-19 11:48:22 -->
<!-- @desc yqg-static-form.vue -->

<script type="text/babel">
import {evalProp, pickValue} from '../util/object';
import getFormat from '../util/format-map';

const DefaultLabelCol = {span: 4};

export default {
    name: 'YqgStaticForm',

    inject: {
        isValidDef: {default: () => x => x}
    },

    props: {
        ctx: {
            type: Object,
            default: () => ({})
        },
        title: {
            type: String,
            default: ''
        },
        values: {
            type: Object,
            default: () => ({})
        },
        options: {
            type: Object,
            required: true
        },
        hideInvalid: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        fieldDefs() {
            const {options: {fieldDefs}, hideInvalid, values, ctx} = this;
            const isValidDef = this.$app?.isValidDef || this.isValidDef;

            return fieldDefs.filter(isValidDef).filter(def => {
                const {field, hide} = def || {};
                const value = pickValue(values, field);
                const isInvalid = !value && value !== 0;
                return !evalProp(hide, {values, ctx, record: values}) && !(hideInvalid && isInvalid);
            });
        },

        formProps() {
            const {
                fieldDefs, staticItemProps, labelCol = DefaultLabelCol, wrapperCol, ...rest // eslint-disable-line
            } = this.options;

            return {
                layout: 'horizontal',
                column: {span: 24},
                ...rest,
                ...((!rest.layout || rest.layout === 'horizontal') ? {
                    labelCol,
                    wrapperCol: wrapperCol || {span: 24 - labelCol.span}
                } : {})
            };
        }
    },

    methods: {
        getItemProps(def) {
            const {label} = def;
            return {
                colon: false,
                ...this.options.staticItemProps,
                ...def.staticItemProps,
                label: typeof label === 'string' ? this.$t(label) : label
            };
        },

        getDefValueProps(def) {
            const {ctx, values} = this;
            const {field, format} = def;
            const formattor = getFormat(format);
            let value = pickValue(values, field);

            if (formattor) {
                value = formattor.format(value);
            }

            return {
                ctx,
                def,
                value,
                values,
                record: values,
                defaultText: '/'
            };
        },

        renderDefItem(def, key) {
            const {formProps: {layout, column}} = this;
            if (layout === 'inline') {
                return this.renderFormItem(def, key);
            }

            const colProps = {
                key,
                ...column,
                ...(def && def.staticCol)
            };
            const itemContent = !!def && (layout === 'vertical'
                ? this.renderFormItem(def)
                : this.renderHorizontalItem(def)
            );
            return (
                <a-col {...{props: colProps}}>
                    {itemContent}
                </a-col>
            );
        },

        renderFormItem(def, key) {
            const props = this.getItemProps(def);
            if (key) props.key = key;

            return (
                <a-form-item {...{props}}>
                    {this.renderDefValue(def)}
                </a-form-item>
            );
        },

        renderHorizontalItem(def) {
            const {formProps} = this;
            const {colon, labelCol, wrapperCol} = this.getItemProps(def);
            const label = def.label && (
                <a-col class="ant-form-item-label" {...{props: labelCol || formProps.labelCol}}>
                    <label class={colon ? '' : 'ant-form-item-no-colon'}>
                        {typeof def.label === 'string' ? this.$t(def.label) : def.label}
                    </label>
                </a-col>
            );
            const value = (
                <a-col class="ant-form-item-control-wrapper" {...{props: wrapperCol || formProps.wrapperCol}}>
                    <div class="ant-form-item-control">
                        <span class="ant-form-item-children">
                            {this.renderDefValue(def)}
                        </span>
                    </div>
                </a-col>
            );
            return (
                <a-row type="flex" class="ant-form-item">
                    {label}
                    {value}
                </a-row>
            );
        },

        renderDefValue(def) {
            const {$slots, $scopedSlots} = this;
            const {field: key} = def;
            if ($slots[key]) return $slots[key];

            const props = this.getDefValueProps(def);
            if ($scopedSlots[key]) return $scopedSlots[key](props);

            const comp = def.staticComp || 'def-value';
            return <comp {...{props}} />;
        }
    },

    render() {
        const {fieldDefs, formProps, title} = this;
        const {layout} = formProps;
        const items = fieldDefs.map((def, idx) => {
            if (layout === 'inline') {
                return this.renderFormItem(def, idx);
            }

            return this.renderDefItem(def, idx);
        });
        const titleEl = this.$scopedSlots.title?.(this) || (title && (
            <div class="yqg-form-title">
                {this.$t(title)}
            </div>
        ));
        return (
            <a-form class="yqg-static-form" {...{props: formProps}}>
                {titleEl}
                {layout !== 'inline' ? (
                    <a-row type="flex">
                        {items}
                    </a-row>
                ) : (
                    items
                )}
            </a-form>
        );
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.yqg-static-form {
    .ant-form-item {
        margin-bottom: 0;
        color: rgba(0, 0, 0, .95);
    }

    &.ant-form-horizontal {
        .ant-form-item {
            &-label,
            &-control {
                margin: 12px 0;
                line-height: 1.2;
                white-space: normal;
            }

            &-label {
                text-align: left;

                label:after {
                    margin: 0;
                }
            }

            &-control {
                padding-left: 5px;
            }
        }
    }
}
</style>
