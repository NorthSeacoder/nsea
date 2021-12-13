/*
 * @Author: xiaodongyu
 * @Date 2019-12-13 17:27:37
 * @Last Modified by: xiaodongyu
 * @Last Modified time: 2019-12-13 17:28:28
 */

export default {
    props: {
        close: {
            type: Function,
            required: true
        },

        dismiss: {
            type: Function,
            required: true
        }
    }
};
