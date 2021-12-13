<!-- @author ruiwang -->
<!-- @email ruiwang@yangqianguan.com -->
<!-- @date 2019-11-18 20:05:04 -->
<!-- @desc index.vue -->

<script>
import elementResizeDetectorMaker from 'element-resize-detector';
import {mapGetters} from 'vuex';

import DefType from '../../constant/def-type';
import getFormat from '../../util/format-map';
import {evalProp, setValue, pickValue, spreadProps} from '../../util/object';

import FieldChildForm from './component/field-child-form';
import FieldDate from './component/field-date';
import FieldMap, {defaultPropsMap} from './constant/field-map';

const DefaultLabelCol = {span: 4};

export default {
    name: 'YqgSimpleForm',

    inject: {
        timezoneKey: {default: ''},
        isValidDef: {default: () => x => x}
    },

    props: {
        ctx: {
            type: Object,
            default: null
        },
        title: {
            type: String,
            default: ''
        },
        confirmLabel: {
            type: String,
            default: 'common.confirm'
        },
        confirmProps: {
            type: Object,
            default: null
        },
        cancelLabel: {
            type: String,
            default: 'common.cancel'
        },
        resetLabel: {
            type: String,
            default: 'common.reset'
        },
        values: {
            type: Object,
            default: () => ({})
        },
        options: {
            type: Object,
            required: true
        },
        autoSearch: {
            type: Boolean,
            default: false
        },
        enterSubmit: {
            type: Boolean,
            default: true
        },
        autocomplete: {
            type: String,
            default: 'off'
        },
        layout: {
            type: String,
            default: ''
        }
    },

    data() {
        return {
            form: this.$form.createForm(this),
            btnItemLabel: ' '
        };
    },

    computed: {
        ...mapGetters(['timezone']),

        formLayout() {
            return this.layout || this.options.layout || 'inline';
        },

        colObj() {
            const {formLayout, options: {labelCol = DefaultLabelCol, wrapperCol}} = this;

            return formLayout === 'horizontal' ? {
                labelCol,
                wrapperCol: wrapperCol || {span: 24 - labelCol.span}
            } : {};
        },

        formOptions() {
            const {
                formLayout: layout,
                options: {
                    fieldDefs,
                    row = {type: 'flex', gutter: 10, justify: 'space-between'},
                    column = {span: 24},
                    commonItemProps: defItemProps = {},
                    ...rest
                },
                colObj
            } = this;
            const commonItemProps = {colon: false, ...defItemProps};
            const isValidDef = this.$app?.isValidDef || this.isValidDef;

            return {
                fieldDefs: fieldDefs.filter(def => def && isValidDef(def)),
                commonItemProps,
                row,
                column,
                formProps: {
                    layout,
                    ...rest,
                    ...colObj
                }
            };
        }
    },

    watch: {
        '$i18n.locale': function watchLocale() {
            if (this.erd) this.$nextTick(this.adjustBtnItemLabel);
        }
    },

    mounted() {
        if (this.autoSearch) this.onReset();
        if (this.formLayout === 'inline') {
            this.erd = elementResizeDetectorMaker({strategy: 'scroll'}); // For ultra performance.
            this.erd.listenTo(this.$el, this.adjustBtnItemLabel);
        }
    },

    beforeDestroy() {
        if (this.erd) this.erd.uninstall(this.$el);
    },

    methods: {
        adjustBtnItemLabel() {
            const {$refs: {btnItem}} = this;
            let label = ' ';
            if (btnItem) {
                const el = btnItem.$el;
                const parentEl = el.parentElement;
                if (el.getBoundingClientRect().x === parentEl.getBoundingClientRect().x) {
                    label = null;
                }
            }

            this.btnItemLabel = label;
        },

        getFormCtx() {
            const {ctx, form, values} = this;
            const formValues = form.isFieldsTouched() ? this.formatValues(form.getFieldsValue()) : values;

            return {
                ctx: ctx || this.$parent,
                ysf: this,
                form,
                values: formValues,
                record: {
                    ...values,
                    ...formValues
                }
            };
        },

        onChange(event, def) {
            const {field, onChange} = def;
            if (!onChange && !this.$listeners.change) return;

            this.$nextTick(() => {
                const {values, ...rest} = this.getFormCtx();
                const params = {
                    ...rest,
                    values,
                    value: pickValue(values, field),
                    def
                };
                this.$emit('change', params);

                if (onChange) {
                    onChange(params);
                }
            });
        },

        is({type, component, enumType, formOptions}) {
            if (!type && enumType) {
                type = 'select';
            }

            if (component) {
               return component;
            }

            if (formOptions) {
                return FieldChildForm;
            }

            const {date, dateTime, dateRange, time, month} = DefType;
            if ([date, dateTime, dateRange, time, month].includes(type)) {
                return FieldDate;
            }

            return FieldMap[type] || FieldMap.text;
        },

        getDecorator(def) {
            if (!def) return [];

            const {values} = this;
            const {field, required = false, rules: originRules = [], format} = def;
            const formCtx = this.getFormCtx();

            const formattor = getFormat(format);
            let initialValue = pickValue(values, field);
            const valuePropName = def.type === DefType.switch ? 'checked' : 'value';

            if (formattor) {
                initialValue = formattor.format(initialValue);
            }

            const rules = [
                {required: evalProp(required, formCtx), message: this.$t('rule.required')},
                ...originRules.map(rule => {
                    const {validator, message} = rule;
                    if (validator) {
                        return {
                            ...rule,
                            validator: (curRule, value, callback) => {
                                const msgKey = validator({rule: curRule, value, ...formCtx});
                                if (msgKey) {
                                    callback(this.$t(msgKey));
                                    return;
                                }

                                callback();
                            }
                        };
                    }

                    if (message) {
                        return {
                            ...rule,
                            message: message.constructor === Function ? message(rule) : this.$t(message)
                        };
                    }

                    return rule;
                })
            ];

            return [field, {initialValue, rules, valuePropName}];
        },

        getProps(def) {
            const {enumType, disabled, formOptions, field} = def;
            const formCtx = this.getFormCtx();
            formCtx.value = pickValue(formCtx.values, field);
            let {type, props = {}} = def;
            if (!type) {
                type = enumType ? DefType.select : DefType.text;
            }
            props = {
                ...defaultPropsMap[type],
                ...evalProp(props, formCtx),
                disabled: evalProp(disabled, formCtx)
            };
            if (enumType) {
                props.enumType = evalProp(enumType, formCtx);
            }

            if (formOptions) {
                props.ctx = formCtx.ctx;
            }

            const {placeholder} = props;
            if (placeholder) {
                props.placeholder = this.$t(placeholder);
            }

            if (type === DefType.file) {
                const {data, previewValue} = props;
                if (data) props.data = file => evalProp(data, {...formCtx, file});

                if (previewValue) {
                    props.previewValue = evalProp(previewValue, formCtx);
                }
            }

            return {
                ...props,
                def: {
                    ...def,
                    props
                }
            };
        },

        getListeners(def) {
            const {field, enumType, type, formOptions, component} = def;
            const {text, textarea, select} = DefType;
            const listeners = {};
            if ((!type && !enumType && !formOptions && !component) || [text, textarea].includes(type)) {
                listeners.pressEnter = () => {
                    this.$emit(`${field}PressEnter`, this.getFormCtx());
                    if (this.enterSubmit && type !== textarea && this.$listeners.confirm) { // input 回车 提交
                        this.onConfirm();
                    }
                };

                listeners.blur = val => {
                    this.$emit(`${field}Blur`, val);
                };
            }

            if ((!type && enumType) || select === type) {
                listeners.search = val => {
                    this.$emit(`${field}Search`, val);
                };
            }

            return listeners;
        },

        onReset() {
            const {values} = this;
            const formCtx = {...this.getFormCtx(), record: values, values};
            this.form.resetFields();
            this.$emit('reset', formCtx);
            this.$emit('change', formCtx);
        },

        onCancel() {
            this.$emit('cancel', {form: this.form});
        },

        formatValues(values, needTrim) {
            const {fieldDefs} = this.formOptions;
            fieldDefs.forEach(({field, format, notrim}) => {
                const formattor = getFormat(format);
                let value = pickValue(values, field);
                let handled = false;
                if (needTrim && !notrim && value && typeof value === 'string') {
                    value = value.trim();
                    handled = true;
                }

                if (formattor) {
                    value = formattor.unformat(value);
                    handled = true;
                }

                if (handled) values = setValue(values, field, value);
            });
            return values;
        },

        async onConfirm() {
            const refValidPromises = Object.values(this.$refs).filter(ref => ref && ref.onConfirm)
                .map(ref => ref.onConfirm());
            let results = await Promise.all(refValidPromises);
            const selfValidPromise = new Promise(resolve => {
                this.form.validateFields((err, values) => {
                    // 不管校验有没问题，还是要format下，以免把没format的值吐出去
                    values = this.formatValues(values, true);
                    resolve({err, values, record: {...this.values, ...values}});
                });
            });
            results = [await selfValidPromise].concat(results);
            const err = results.reduce((acc, cur) => acc || cur.err, null);
            let [{values, record}] = results;
            if (!err) {
                results.forEach(({def, record: refRecord, values: refValues}) => {
                    if (def) {
                        values = setValue(values, def.field, refValues);
                        record = setValue(record, def.field, refRecord);
                    }
                });
                this.$emit('confirm', {
                    ysf: this,
                    form: this.form,
                    values,
                    record
                });
            }

            return {err, values, record};
        },

        renderSlot(name, props, fallback) {
            return this.$scopedSlots[name]?.(props) || fallback;
        },

        hasSlot(name) {
            return !!this.$scopedSlots[name];
        },

        renderFormBtns(formCtx) {
            const {
                formLayout: layout,
                btnItemLabel,
                resetLabel,
                confirmLabel,
                confirmProps,
                cancelLabel,
                $listeners,
                onReset,
                onConfirm,
                onCancel
            } = this;
            const fallbackBtns = [$listeners.reset && (
                <a-button
                    vOn:click={onReset}
                >
                    {this.$t(resetLabel)}
                </a-button>
            ), $listeners.cancel && (
                <a-button
                    vOn:click={onCancel}
                >
                    {this.$t(cancelLabel)}
                </a-button>
            ), $listeners.confirm && (
                <a-button
                    {...spreadProps({type: 'primary', ...confirmProps})}
                    vOn:click={onConfirm}
                >
                    {this.$t(confirmLabel)}
                </a-button>
            )].filter(item => item);
            if (!fallbackBtns.length && !this.hasSlot('extraBtns') && !this.hasSlot('btns')) return null;

            let Comp = 'div';
            let ref = '';
            const props = {};
            if (layout === 'inline') {
                Comp = 'a-form-item';
                ref = 'btnItem';
                Object.assign(props, {
                    colon: false,
                    label: btnItemLabel
                });
            }

            return (
                <Comp class="yqg-form-btn-item" {...{props, ref}}>
                    {this.renderSlot('btns', formCtx, fallbackBtns)}
                    {this.renderSlot('extraBtns', formCtx)}
                </Comp>
            );
        },

        renderFormItem(def, formCtx) {
            const {
                timezone,
                formOptions: {commonItemProps}
            } = this;
            const itemLabel = this.$t(evalProp(def.label, formCtx));
            const itemProps = {
                key: def.field,
                ...commonItemProps,
                ...def.itemProps
            };
            const timezoneKey = this.$app?.timezoneKey || this.timezoneKey;
            const timezoneVisible = timezoneKey && def.label && ['date', 'dateTime'].includes(def.type);
            if (!timezoneVisible) {
                itemProps.label = itemLabel;
            }

            const Comp = this.is(def);
            const scopedSlots = [
                'head', 'foot', 'prefix', 'suffix', 'addonAfter', 'addonBefore', 'childFormExtraBtn', 'optionLabel'
            ].reduce((acc, name) => {
                const hasSlot = this.hasSlot(`${def.field}.${name}`);
                if (hasSlot) {
                    acc[name] = args => {
                        if (!Object.keys(args).length) return this.renderSlot(`${def.field}.${name}`, formCtx);
                        return this.renderSlot(`${def.field}.${name}`, {parent: formCtx, child: args});
                    };
                }
                return acc;
            }, {});

            const fallbackEl = (
                <Comp
                    {...{
                        directives: [{
                            name: 'decorator',
                            value: this.getDecorator(def)
                        }],
                        ...spreadProps(this.getProps(def)),
                        scopedSlots,
                        on: {
                            ...this.getListeners(def),
                            change: $event => this.onChange($event, def)
                        }
                    }}
                >
                </Comp>
            );
            const itemSuffixEl = this.renderSlot(`${def.field}.itemSuffix`, formCtx);
            if (itemSuffixEl) {
                const itemSuffixClass = 'yqg-form-item-has-suffix';
                const {class: className} = itemProps;
                if (!className) {
                    itemProps.class = itemSuffixClass;
                } else {
                    if (className.constructor === String) {
                        itemProps.class = `${itemProps.class} ${itemSuffixClass}`;
                    }
                    if (className.constructor === Object) {
                        className[itemSuffixClass] = true;
                    }
                    if (className.constructor === Array) {
                        className.push(itemSuffixClass);
                    }
                }
            }

            return (
                <a-form-item {...spreadProps(itemProps)}>
                    {timezoneVisible && (
                        <span slot="label">
                            {itemLabel}
                            <span class="yqg-text-danger">
                                {this.$t(timezoneKey)[timezone]}
                            </span>
                        </span>
                    )}
                    {this.renderSlot(def.field, formCtx, fallbackEl)}
                    {itemSuffixEl}
                </a-form-item>
            );
        },

        renderColItem(def, formCtx) {
            const {
                formOptions: {column}
            } = this;
            const colProps = {
                key: def.field,
                ...column,
                ...(def && def.col)
            };
            return (
                <a-col {...spreadProps(colProps)}>
                    {this.renderFormItem(def, formCtx)}
                </a-col>
            );
        }
    },

    render() {
        const {
            form,
            title,
            formLayout: layout,
            autocomplete,
            formOptions: {formProps, fieldDefs, row}
        } = this;
        const formCtx = this.getFormCtx();
        const items = fieldDefs
            .filter(def => !evalProp(def.hide, formCtx))
            .map(def => {
                if (layout === 'vertical') {
                    return this.renderColItem(def, formCtx);
                }

                return this.renderFormItem(def, formCtx);
            });
        return (
            <div class="yqg-simple-form">
                {this.renderSlot('title', formCtx, title && (
                    <div class="yqg-form-title">
                        {this.$t(title)}
                    </div>
                ))}
                {this.renderSlot('topBtns', formCtx)}
                <a-form {...{props: {...formProps, form}, attrs: {autocomplete}}}>
                    {layout !== 'vertical' ? items : (
                        <a-row {...spreadProps(row)}>
                            {items}
                        </a-row>
                    )}
                    {this.renderSlot('default', formCtx)}
                    {this.renderFormBtns(formCtx)}
                </a-form>
            </div>
        );
    }
};
</script>

<style lang="scss" src="./index.scss"></style>
