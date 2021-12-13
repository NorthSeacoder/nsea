/*
 * @Author: pengmeng
 * @Date: 2020-04-20 17:34:39
 * @Last Modified by: pengmeng
 * @Last Modified time: 2020-04-20 20:09:40
 */

const current = 'Asia/Shanghai';

export default {
    state: {
        current
    },

    getters: {
        timezone: state => state.current
    }
};
