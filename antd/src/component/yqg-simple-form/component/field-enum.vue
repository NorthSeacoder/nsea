<!-- @author ruiwang -->
<!-- @email ruiwang@yangqianguan.com -->
<!-- @date 2019-11-18 20:05:49 -->
<!-- @desc index.vue -->

<template>
    <component
        :is="comp"
        v-model="compValue"
        v-bind="{
            ...compProps,
            ...def.props,
            enumType,
            def
        }"
        @change="onChange"
    />
</template>

<script>
import Enum from '@yqg/enum';

import DefType from '../../../constant/def-type';
import {numbersToStr} from '../../../util/object';

import FieldMap from '../constant/field-map';

export default {
    name: 'FieldEnum',

    model: {
        prop: 'value',
        event: 'change'
    },

    props: {
        value: {
            type: [String, Number, Array, Boolean],
            default: undefined
        },
        enumType: {
            type: [String, Object],
            required: true
        },
        def: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            compValue: numbersToStr(this.value),
            map: null,
            mapKey: '',
            list: []
        };
    },

    computed: {
        comp() {
            const {def} = this;
            return FieldMap[def.type || DefType.select];
        },

        compProps() {
            const {def, mapKey} = this;
            let {map} = this;
            if (mapKey) {
                map = this.$t(mapKey);
                if (map.constructor === Array) {
                    map = Enum.fromArray(map, def.enumOptions).MAP;
                }
            }

            if (def.type === DefType.tree) {
                const {list, formatTreeData} = this;
                return {treeData: formatTreeData(list)};
            }

            return {
                options: Object.keys(map || {}).map(key => ({
                    label: map[key],
                    value: key
                }))
            };
        }
    },

    watch: {
        value(val) {
            if (val === this.compValue) return;

            this.compValue = numbersToStr(val);
        },

        enumType() {
            this.initData();
        }
    },

    mounted() {
        this.initData();
    },

    methods: {
        onChange(val) {
            this.$emit('change', val);
        },

        async initData() {
            const {enumType} = this;

            if (typeof enumType === 'string') {
                this.mapKey = enumType;
                return;
            }

            if (enumType.query) {
                await enumType.query();
            }

            this.map = enumType.MAP || enumType;
            this.list = enumType.LIST;
        },

        formatTreeData(list) {
            if (!list.length) {return list;}

            return list.map(({children, id, name}) => ({
                title: name,
                value: `${id}`,
                key: `${id}`,
                children: children ? this.formatTreeData(children) : null
            }));
        }
    }

};
</script>
