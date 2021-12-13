<!-- @author xiaodongyu -->
<!-- @email xiaodongyu@yangqianguan.com -->
<!-- @date 2019-11-20 10:18:31 -->
<!-- @desc index -->

<template>
    <a-config-provider v-if="records" :render-empty="renderEmpty">
        <div :class="['yqg-simple-table', renderEmpty ? 'custom-empty-table' : '']">
            <a-row>
                <a-col :span="$listeners['export-current-page'] ? 16 : 24">
                    <a-input-search
                        v-if="options.search && records.length"
                        :placeholder="$t('table.searchPlaceholder')"
                        class="search-input"
                        @change="onSearch"
                    />
                    <p v-if="options.enableClientSort && $listeners.change" class="client-sort-tip">
                        *{{ $t('table.clientSortTip') }}
                    </p>
                </a-col>
                <a-col v-if="$listeners['export-current-page']" :span="8" style="text-align: right">
                    <a-button size="small" @click="onExportCurrentPage">
                        {{ $t('table.exportCurrentPage') }}
                    </a-button>
                </a-col>
            </a-row>
            <a-table
                ref="yst"
                :data-source="renderRecords"
                v-bind="tableOptions"
                @change="onChange"
                @expand="onExpand"
                @expandedRowsChange="onExpandedRowsChange"
            />
        </div>
    </a-config-provider>
</template>

<script type="text/babel">
import _ from 'underscore';

import genText from '../mixin/gen-text';
import {evalProp, pickValue} from '../util/object';

const DEFULT_PAGINATION = {
    pageSizeOptions: ['10', '20', '50', '100', '200'],
    showSizeChanger: true
};
const DEFULT_TABLE_OPTIONS = {
    bordered: true,
    scroll: {x: true},
    rowKey: 'id'
};
const ClientSorterMap = {
    number: field => (record1, record2) => {
        const val1 = pickValue(record1, field) || 0;
        const val2 = pickValue(record2, field) || 0;
        return val1 - val2;
    },
    string: field => (record1, record2) => {
        const val1 = pickValue(record1, field) || '';
        const val2 = pickValue(record2, field) || '';
        return `${val1}`.localeCompare(`${val2}`);
    }
};

export default {
    name: 'YqgSimpleTable',

    inject: {
        timezoneKey: {default: ''},
        isValidDef: {default: () => x => x}
    },

    mixins: [genText],

    props: {
        options: {
            type: Object,
            default: () => ({})
        },
        records: {
            type: Array,
            default: null
        },
        pagination: {
            type: [Boolean, Object],
            default: () => ({})
        },
        simpleEmpty: {
            type: Boolean,
            default: false
        },
        defaultPagination: {
            type: Object,
            default: () => DEFULT_PAGINATION
        },
        fontSize: {
            type: Number,
            default: 13
        },
        cellHorizontalPadding: {
            type: Number,
            default: 20
        }
    },

    data() {
        const {options: {colDefs = []}} = this;

        return {
            searchText: '',
            visibleMap: colDefs.filter(def => def.child).reduce((map, {field: key, child}) => {
                map[key] = !!child.defaultVisible;
                return map;
            }, {}),
            loadedEnumMap: {},
            defEnumTotal: 0,
            parsedRecords: {}
        };
    },

    computed: {
        validDefColumns() {
            const {options: {colDefs}} = this;

            const isValidDef = this.$app?.isValidDef || this.isValidDef;
            const realColumns = _.flatten(_.map(colDefs, def => {
                const {field: key, child} = def;
                if (child && child.colDefs && child.colDefs.length) {
                    if (this.visibleMap[key]) {
                        return [def, ...child.colDefs];
                    }
                }
                return def;
            }));

            return realColumns.filter(def => def && isValidDef(def));
        },

        tableOptions() {
            const {
                options: {enableClientSort, scroll = DEFULT_TABLE_OPTIONS.scroll, ...rest},
                records,
                simpleEmpty,
                $scopedSlots,
                defaultPagination,
                validDefColumns
            } = this;
            const columns = validDefColumns.map(def => {
                const {field: key, label, labelParam, column = {}, child, rowSpan, colSpan} = def;
                const title = typeof label === 'string' ? this.$t(label, labelParam) : label;
                return {
                    key,
                    dataIndex: key,
                    title: () => {
                        if ($scopedSlots.title) return $scopedSlots.title({title, def});
                        if (child) {
                            const visible = this.visibleMap[key];

                            return (
                                <div>
                                    {title}
                                    <a-icon
                                        type={!visible ? 'custom-plus' : 'custom-minus'}
                                        class="ml10 yqg-text-primary"
                                        vOn:click_stop={() => this.changeVisible({key, visible: !visible})}
                                    />
                                </div>
                            );
                        }
                        return title;
                    },
                    customRender: (text, record, index) => {
                        const props = {
                            def,
                            value: text,
                            record,
                            values: record,
                            index,
                            defaultText: '/'
                        };

                        let cell = $scopedSlots[key]?.(props);
                        if (!cell) {
                            const comp = def.staticComp || 'def-value';
                            cell = <comp {...{props}} vOn:enumLoaded={this.handleEnumLoaded} />;
                        }

                        if (rowSpan || colSpan) {
                            const attrs = {
                                rowSpan: evalProp(rowSpan, props),
                                colSpan: evalProp(colSpan, props)
                            };
                            return {children: cell, attrs};
                        }

                        return cell;
                    },
                    ...(enableClientSort || def.clientSort ? {
                        sorter: this.getClientSorter(def)
                    } : {}),
                    ...(scroll.y ? {width: this.getColumnWidth({def, column, records})} : {}),
                    ...column
                };
            });
            let {pagination} = this;
            if (pagination) {
                if (this.$listeners.change) pagination.current = pagination.pageNo;
                pagination = {
                    ...defaultPagination,
                    showTotal: (total, range) => `${[
                        range.join('-'),
                        this.$t('pagination.line'),
                        ', ',
                        this.$t('pagination.total'),
                        total,
                        this.$t('pagination.line')
                    ].join('')}`,
                    ...pagination
                };
                /*
                const {total = 0, pageSizeOptions} = pagination;
                pagination = Math.max(total, 0 || (records && records.length)) > Math.min(...pageSizeOptions)
                    && pagination;
                */
            }

            return {
                ...DEFULT_TABLE_OPTIONS,
                showHeader: !simpleEmpty || !!(records && records.length),
                columns,
                pagination,
                scroll,
                ...rest
            };
        },

        renderRecords() {
            const {searchText, options: {colDefs}, parsedRecords, records} = this;
            if (!this.searchText) {
                return this.records;
            }

            return records.filter((record, index) => colDefs.some(
                def => String(pickValue(parsedRecords[index], def.field))
                    .toLowerCase().includes(searchText.toLowerCase())
            ));
        },

        renderEmpty() {
            const {simpleEmpty, $slots} = this;
            let emptyVNode;
            if (simpleEmpty) emptyVNode = this.$t('common.noData');
            if ($slots.renderEmpty) emptyVNode = $slots.renderEmpty;
            return emptyVNode && (() => <div className="custom-empty-view">{emptyVNode}</div>);
        }
    },

    watch: {
        records() {
            this.genParsedRecords();
        }
    },

    mounted() {
        const {validDefColumns} = this;
        this.defEnumTotal = validDefColumns.reduce((acc, {enumType}) => {
            if (enumType) acc += 1;
            return acc;
        }, 0);
        if (!this.defEnumTotal) this.genParsedRecords();
    },

    methods: {
        getClientSorter(def) {
            const {field, type, filter} = def;
            let {column: {sorter} = {}} = def;
            if (!sorter) {
                sorter = 'string';
                if (/^(number|date)$/.test(type) || /^(date(Time)?$|numberCommas)/.test(filter)) {
                    sorter = 'number';
                }
            }

            return sorter.constructor === String ? ClientSorterMap[sorter](field) : sorter;
        },

        getColumnWidth({def, records}) {
            const {label, field, column, filter} = def;
            if (column?.width) return column.width;

            const {fontSize, cellHorizontalPadding} = this;
            const maxLen = Math.max(label.length, ...records.map(record => {
                let val = pickValue(record, field);
                val = !val && val !== 0 ? '' : val;
                if (filter) {
                    return `${this.$options.filters[filter](val)}`.length * 0.6;
                }
                return `${val}`.length;
            }));

            return maxLen * fontSize + cellHorizontalPadding;
        },

        onChange(pagination, filters, sorter) {
            const {pageNo, current, pageSize} = pagination;
            if (pageNo === current && pageSize === this.pagination.pageSize && this.options.enableClientSort) return;

            pagination.pageNo = current;
            this.$emit('change', pagination, filters, sorter);
        },

        onExpand(...args) {
            this.$emit('expand', ...args);
        },

        onExpandedRowsChange(...args) {
            this.$emit('expandedRowsChange', ...args);
        },

        onSearch({target: {value}}) {
            this.searchText = value && value.trim();
        },

        changeVisible({key, visible}) {
            this.visibleMap = {
                ...this.visibleMap,
                [key]: visible
            };
        },

        onExportCurrentPage() {
            const el = this.$refs.yst.$el;
            const header = [].map.call(el.querySelectorAll('th'), item => item.textContent);
            const data = [].map.call(el.querySelectorAll('tbody tr'), row => {
                const tdList = row.children;
                return [].map.call(tdList, td => td.textContent);
            });
            this.$emit('export-current-page', {header, data});
        },

        handleEnumLoaded({field, ...enumType}) {
            const {loadedEnumMap} = this;
            if (loadedEnumMap[field]) return;
            this.loadedEnumMap = {
                ...loadedEnumMap,
                [field]: {
                    ...enumType
                }
            };
            if (Object.keys(this.loadedEnumMap).length === this.defEnumTotal) {
                this.genParsedRecords();
            }
        },

        genParsedRecords() {
            const {options: {search}, loadedEnumMap, records, validDefColumns, defEnumTotal} = this;
            if (
                !search
                || !records?.length
                || (defEnumTotal && Object.keys(loadedEnumMap).length < defEnumTotal)
            ) return;

            const colDefsMap = validDefColumns.reduce((acc, def) => {
                acc[def.field] = def;
                return acc;
            }, {});

            this.parsedRecords = records?.map(record => Object.keys(record).reduce((parsedRecord, field) => {
                const {mapKey, enumType} = loadedEnumMap[field] || {};
                const props = {
                    defaultText: '/',
                    def: colDefsMap[field] || {},
                    value: record[field]
                };
                if (mapKey) {
                    props.mapKey = mapKey;
                } else if (enumType) {
                    props.enumType = enumType;
                }
                parsedRecord[field] = this.genText(props);
                return parsedRecord;
            }, {}));
        }
    }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.yqg-simple-table {
    margin-top: 20px;

    .search-input {
        margin-bottom: 10px;
        width: 200px;
    }

    .client-sort-tip {
        margin-bottom: 10px;
        font-size: 12px;
        color: #999;
    }

    &.custom-empty-table {
        .ant-table-placeholder {
            padding: 0;
            text-align: left;
            background-color: transparent;
            border: none !important;
        }
    }

    .ant-table {
        &-thead,
        &-tbody {
            tr {
                th,
                td {
                    padding: 10px;
                    white-space: nowrap;
                    text-align: center;
                    color: rgba(0, 0, 0, 0.95);

                    pre {
                        display: inline-block;
                        min-width: 100px;
                        max-width: 300px;
                        white-space: pre-wrap;
                        word-break: break-word;
                        overflow: unset;
                    }
                }
            }
        }

        &-pagination {
            &.ant-pagination {
                float: none;
            }
        }
    }

    &.yqg-common-table {
        .ant-table-empty {
            .ant-table-thead {
                display: none;
            }

            .ant-table-placeholder {
                border-top: 1px solid #e8e8e8;
            }
        }
    }
}
</style>
