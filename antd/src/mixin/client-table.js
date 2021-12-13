/*
 * @Author: ruiwang
 * @Date: 2020-09-18 14:00:04
 * @Last Modified by: ruiwang
 * @Last Modified time: 2020-09-18 14:32:02
 */

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
            this.cond = values;
            this.onRefresh();
        },

        onTableChange({pageSize, pageNo}) {
            Object.assign(this.pagination, {pageSize, pageNo});
        }
    }
};
