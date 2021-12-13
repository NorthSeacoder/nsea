<!-- @author ruiwang -->
<!-- @email ruiwang@yangqianguan.com -->
<!-- @date 2020-3-13 14:12:44 -->
<!-- @desc yqg-info-table.vue -->

<template>
    <div class="ant-table ant-table-bordered">
        <div class="ant-table-body">
            <table class="info-table" style="table-layout: fixed;">
                <template v-for="(group, groupIdx) in tableOptions">
                    <thead :key="groupIdx" class="ant-table-thead">
                        <tr :key="groupIdx">
                            <th v-for="({label}, idx) in group" :key="idx">
                                {{ $t(label) }}
                            </th>
                        </tr>
                    </thead>
                    <tbody :key="`tbody-${groupIdx}`" class="ant-table-tbody">
                        <tr>
                            <td v-for="(def, idx) in group" :key="idx">
                                <slot :name="def.field" v-bind="{def, value: tableData[def.field], record: tableData}">
                                    <def-value
                                        default-text="/"
                                        v-bind="{def, value: pickValue(tableData, def.field)}"
                                    />
                                </slot>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </table>
        </div>
    </div>
</template>

<script>
    import _ from 'underscore';

    import {pickValue} from '../util/object';

    export default {
        name: 'YqgInfoTable',

        props: {
            colNum: {
                type: Number,
                default: 6
            },

            tableTitle: {
                type: [Array],
                default: () => []
            },

            tableData: {
                type: [Object],
                default: () => ({})
            },

            options: {
                type: Object,
                default: () => ({})
            }
        },

        computed: {
            tableOptions() {
                const {colNum, options} = this;
                let {tableTitle} = this;
                tableTitle = tableTitle.map(({field, value, ...rest}) => ({field: field || value, ...rest}));
                return _.chunk((tableTitle.length && tableTitle) || options.colDefs, colNum);
            }
        },

        methods: {
            pickValue
        }
    };
</script>

<style lang="scss">
.info-table {
    th,
    td {
        font-size: .9em;
        white-space: unset !important;
        word-wrap: break-word;
    }
}
</style>
