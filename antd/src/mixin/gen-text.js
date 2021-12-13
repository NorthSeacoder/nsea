/*
 * @Author: chengyuzhang
 * @Date: 2021-04-07 15:27:57
 * @Last Modified by: chengyuzhang
 * @Last Modified time: 2021-04-07 16:38:32
 */

import Vue from 'vue';
import {mapGetters} from 'vuex';
import Enum from '@yqg/enum';

import DefType from '../constant/def-type';

const getText = ({map, enumType, value, seperator = '\n'}) => {
    if (value === null || value === undefined) return value;

    if (value.constructor === Array) {
        return value.map(val => (enumType?.getText(val) || map?.[val] || val)).join(seperator);
    }

    return enumType?.getText(value) || map?.[value] || value;
};

export default {
    computed: {
        ...mapGetters(['timezone'])
    },

    methods: {
        genText({
            defaultText, enumType, mapKey, value: text,
            def: {type, seperator, enumOptions, timezone: defTz, filter}
        }) {
            const {timezone} = this;
            if (enumType) {
                text = getText({enumType, value: text, seperator});
            }

            if (mapKey) {
                let tMap = this.$t(mapKey);
                if (tMap.constructor === Array) {
                    tMap = Enum.fromArray(mapKey, enumOptions).MAP;
                }

                text = getText({map: tMap, value: text, seperator});
            }

            // date
            if (type === DefType.date) {
                filter = filter || 'date';
            }

            // dateTime
            if (type === DefType.dateTime) {
                filter = 'dateTime';
            }

            // time
            if (type === DefType.time) {
                filter = 'time';
            }

            if (filter) {
                text = Vue.filter(filter)(text, defTz || timezone);
            }

            return (text || text === 0 || text === false) ? text : defaultText;
        }
    }
};
