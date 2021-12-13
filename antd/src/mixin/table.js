/*
 * @Author: xiaodongyu
 * @Date 2019-12-05 15:12:11
 * @Last Modified by:   wenxiujiang
 * @Last Modified time: 2020-10-15 19:56:25
 */

import _ from 'underscore';

export default {
    data() {
        return {
            cond: null,
            pagination: {
                pageNo: 1,
                pageSize: 10,
                total: 0
            }
        };
    },

    computed: {
        params() {
            return {
                ...this.pagination,
                total: undefined,
                ...this.cond
            };
        }
    },

    methods: {
        onSearch({values} = {}) {
            this.pagination.pageNo = 1;
            this.cond = _.omit(values, value => value === '');
            this.onRefresh();
        },

        onTableChange({pageSize, pageNo}) {
            Object.assign(this.pagination, {pageSize, pageNo});
            this.onRefresh();
        }
    }
};
