/*
 * @Author: ruiwang
 * @Date: 2020-07-08 14:17:29
 * @Last Modified by: ruiwang
 * @Last Modified time: 2020-09-09 18:14:54
 */

import table from './table';

export default {
    ...table,

    data() {
        return {
            cond: null,
            pagination: {
                pageNo: 1,
                pageSize: 50,
                total: 0
            }
        };
    },

    mounted() {
        this.$watch('$i18n.locale', this.onRefresh);
    }
};
