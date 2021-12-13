<!-- @author xiaodongyu -->
<!-- @email xiaodongyu@yangqianguan.com -->
<!-- @date 2019-12-12 18:30:12 -->
<!-- @desc field-child-form.vue -->

<script type="text/babel">
import _ from 'underscore';

import {evalProp} from '../../../util/object';

export default {
    name: 'FieldChildForm',

    props: {
        def: {
            type: Object,
            required: true
        },

        value: {
            type: Array,
            default: () => [{}]
        },

        ctx: {
            type: Object,
            default: () => ({})
        }
    },

    data() {
        const curValues = this.value ? [...this.value] : [];

        return {
            curValues
        };
    },

    computed: {
        canAdd() {
            const {def: {hasAdd = true}, ctx} = this;
            return evalProp(hasAdd, {ctx});
        },
        canDelete() {
            const {def: {hasDelete = true}, ctx} = this;
            return evalProp(hasDelete, {ctx});
        }
    },
    watch: {
        value(value) {
            if (this.def.formOptions.sync && value !== this.curValues) {
                this.curValues = value;
            }
        }
    },

    methods: {
        singleHasDelete(value) {
            const {def: {formOptions: {hasDelete = true}}} = this;

            return evalProp(hasDelete, {value});
        },

        async asyncValidator() {
            const {$refs, getChildForms} = this;
            const childForms = getChildForms($refs);
            const results = await Promise.all(
                childForms.map(
                    ({form}) => new Promise(
                        resolve => form.validateFields(error => resolve(!error))
                    )
                )
            );

            return results.every(valid => valid);
        },

        childKey(values = {}, idx) {
            const {def: {childKey = ({record}) => (record.id || record.$timestamp)}, ctx} = this;
            return `${evalProp(childKey, {values, record: values, ctx}) || ''}-${idx}`;
        },

        onAdd() {
            const {ctx, def: {getInitialValue, extendAdd}} = this;
            const initialValue = evalProp(getInitialValue, {ctx}) || {};
            initialValue.$timestamp = new Date().getTime();

            if (extendAdd) {
                extendAdd(this.curValues, {initialValue, ctx});
            } else {
                this.curValues.push(initialValue);
            }
            this.$nextTick(() => {
                this.onChange();
            });
        },

        onChange(idx, {record} = {}) {
            if (idx >= 0) {
                this.curValues.splice(idx, 1, record);
            }

            if (this.def.formOptions.sync) {
                this.$emit('change', this.curValues);
            }
        },

        onDelete(idx) {
            this.curValues.splice(idx, 1);
            this.$nextTick(() => {
                this.onChange();
            });
        },

        getChildForms(refs) {
            return Object.keys(refs).reduce((acc, cur) => {
                if (/childForm-(?=.*[\d]$)/.test(cur) && refs[cur]) {
                    acc.push(refs[cur]);
                }
                return acc;
            }, []);
        },

        getItemTitle(itemIndex) {
            const {def: {itemTitle}, ctx} = this;
            if (!itemTitle) return null;

            if (_.isFunction(itemTitle)) {
                return evalProp(itemTitle, {ctx, itemIndex});
            }

            return `${itemTitle} ${itemIndex + 1}`;
        },

        async onConfirm() {
            const {def, def: {formOptions: {sync}}, $refs, getChildForms} = this;
            const childForms = getChildForms($refs);

            if (!childForms.length) return {err: null, def, values: [], record: []};

            const results = await Promise.all(childForms.map(ref => ref.onConfirm()));
            const err = results.reduce((acc, cur) => acc || cur.err, null);
            const valueArr = results.map(({values}) => values);
            const records = results.map(({record}) => record);
            if (!sync) this.$emit('change', records); // 给没配sync的过校验

            return {err, values: valueArr, record: records, def};
        },

        renderSlot(name, props = {}) {
            const {$scopedSlots} = this;
            return $scopedSlots[name] && $scopedSlots[name](props);
        },

        renderSoltBtns({formCtx, idx, child}) {
            const {
                curValues, def, onChange, canDelete, singleHasDelete, onDelete, $t, renderSlot
            } = this;
            const fragment = [];
            const childFormExtraBtnNode = renderSlot('childFormExtraBtn', {...formCtx, onChange, idx});
            if (childFormExtraBtnNode) {
                fragment.push(childFormExtraBtnNode);
            }
            if (
                (curValues.length > 1 || !def.required)
                && canDelete && singleHasDelete(child)
                && !def.childCard
            ) {
                fragment.push(
                    <a-button
                        type="danger"
                        vOn:click={() => onDelete(idx)}
                    >
                        {$t('common.delete')}
                    </a-button>
                );
            }
            return fragment;
        },

        renderAddBtn() {
            const {$t, def, onAdd} = this;
            return (
                <a-button
                    type="primary"
                    icon={def.addIcon}
                    vOn:click={onAdd}
                >
                    { def.addText || $t('common.create') }
                </a-button>
            );
        },

        renderChildForm({idx, child}) {
            const {ctx, def, childKey, renderSoltBtns, onChange} = this;
            return (
                <yqg-simple-form
                    key={childKey(child, idx)}
                    ref={`childForm-${idx}`}
                    ctx={ctx}
                    values={child}
                    options={def.formOptions}
                    scopedSlots={{
                        extraBtns: formCtx => renderSoltBtns({formCtx, idx, child})
                    }}
                    vOn:change={formValues => onChange(idx, formValues)}
                />
            );
        },

        renderForm() {
            const {
                def, def: {childCard}, canAdd, canDelete,
                curValues, singleHasDelete, renderChildForm, getItemTitle, onDelete
            } = this;
            if (childCard) {
                return (
                    <div>
                        {
                            curValues.map((child, idx) => (
                                <a-card key={idx} class="child-form-card">
                                    <div class="card-header">
                                        <div class="yqg-form-title title">{getItemTitle(idx)}</div>
                                        {
                                            (curValues.length > 1 || !def.required)
                                            && canDelete && singleHasDelete(child)
                                            && (
                                                <a-icon
                                                    class="close"
                                                    type="close"
                                                    vOn:click={() => onDelete(idx)}
                                                />
                                            )
                                        }
                                    </div>
                                    {renderChildForm({idx, child})}
                                </a-card>
                            ))
                        }
                        {canAdd && this.renderAddBtn()}
                    </div>
                );
            }
            return (
                <a-card>
                    {curValues.map((child, idx) => (
                        <div>
                            {renderChildForm({idx, child})}
                            <a-divider class="divider" />
                        </div>
                    ))}
                    {canAdd && this.renderAddBtn()}
                </a-card>
            );
        }
    },

    render() {
        const {renderSlot, renderForm} = this;
        return (
            <a-config-provider autoInsertSpaceInButton={false}>
                <div class="field-child-form">
                    {renderSlot('head')}
                    {renderForm()}
                    {renderSlot('foot')}
                </div>
            </a-config-provider>
        );
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.field-child-form {
    .divider {
        margin: 10px 0;
    }

    .yqg-simple-form {
        .ant-form-inline {
            .ant-form-item-label {
                justify-content: flex-start;
            }
        }
    }

    .child-form-card {
        margin-bottom: 16px;

        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;

            .title {
                color: rgba(0,0,0,0.6);
            }

            .close {
                font-size: 18px;
            }
        }
    }
}
</style>
