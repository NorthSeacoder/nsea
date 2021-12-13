<template>
    <component
        :is="comp"
        v-model="date"
        v-bind="def.props"
        @change="onChange"
    />
</template>

<script>
import moment from 'moment';
import {mapGetters} from 'vuex';

import FieldMap from '../constant/field-map';

const ModeMethodMap = {
    dayStart: ['startOf', 'day'],
    dayEnd: ['endOf', 'day'],
    secondStart: ['startOf', 'second'],
    secondEnd: ['endOf', 'second']
};

export default {
    name: 'FieldDate',

    inject: {
        timestamp: {
            default: undefined
        }
    },

    model: {
        prop: 'value',
        event: 'change'
    },

    props: {
        value: {
            type: [Number, Array, String],
            default: undefined
        },

        def: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            date: null
        };
    },

    computed: {
        ...mapGetters(['timezone']),

        comp() {
            const {def} = this;
            return FieldMap[def.type];
        },

        isTimestamp() {
            return (this.$app?.timestamp ?? this.timestamp) !== false || this.def.timestamp === true;
        }
    },

    watch: {
        value() {
            this.setDate();
        },

        timezone() {
            if (!this.isTimestamp) return;

            this.setDate();
            this.onChange(this.date);
        }
    },

    mounted() {
        this.setDate();
    },

    methods: {
        setDate() {
            const {def, timezone} = this;
            let {value: date} = this;

            if (Array.isArray(date)) {
                date = date.map(item => (typeof item === 'number' ? moment.tz(date, def.timezone || timezone) : item));
            } else if (date) {
                if (def.type === 'time' && !this.isTimestamp) {
                    date = moment.tz(date, def.props.format || 'HH:mm:ss', def.timezone || timezone);
                } else {
                    date = moment.tz(date, def.timezone || timezone);
                }
            }

            this.date = date;
        },

        onChange(val, str) {
            let timestamp = null;
            if (this.isTimestamp) {
                if (Array.isArray(val)) {
                    timestamp = val.map(date => this.getTimestamp(date));
                } else {
                    timestamp = this.getTimestamp(val);
                }
            }

            this.$emit('change', timestamp || str);
        },

        getTimestamp(date) {
            if (!date) return date;

            const {type} = this.def;
            let {roundMode} = this.def;
            if (!roundMode && type === 'dateTime') {
                roundMode = 'secondStart';
            }

            if (roundMode && ModeMethodMap[roundMode]) {
                const [method, param] = ModeMethodMap[roundMode];
                return date[method](param).valueOf();
            }

            return date.valueOf();
        }
    }
};
</script>
