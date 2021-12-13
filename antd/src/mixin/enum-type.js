/*
 * @Author: ruiwang
 * @Date: 2020-09-07 17:29:02
 * @Last Modified by: ruiwang
 * @Last Modified time: 2021-07-15 11:53:13
 */

import Enum from '@yqg/enum';

export default {
    model: {
        prop: 'value',
        event: 'change'
    },

    props: {
        enumType: {
            type: [String, Object],
            default: ''
        }
    },

    data() {
        return {
            list: [],
            wrappedEnumType: null
        };
    },

    computed: {
        options() {
            const {list} = this;
            return list.map(({text, value, ...rest}) => ({
                ...rest,
                label: text,
                value: `${value}`
            }));
        }
    },

    watch: {
        enumType() {
            this.initData();
        }
    },

    mounted() {
        this.initData();
        const {enumType} = this;
        if (enumType?.query) {
            enumType.onRefresh?.(this.initData);
        }
    },

    beforeDestroy() {
        const {enumType} = this;
        if (enumType?.query) {
            enumType.offRefresh?.(this.initData);
        }
    },

    methods: {
        async initData() {
            const {def} = this;
            let {enumType} = this;
            if (!enumType) {
                enumType = Enum.from({});
                return;
            }

            switch (true) {
                case enumType.constructor === Enum:
                    if (enumType.query) await enumType.query();

                    break;
                case enumType.constructor === Object:
                    enumType = Enum.from(enumType);
                    break;
                case typeof enumType === 'string':
                    if (this.$t(enumType).constructor === Array) {
                        enumType = Enum.fromArray(this.$t(enumType), def.enumOptions);
                    } else {
                        enumType = Enum.from(this.$t(enumType));
                    }

                    break;
                default: break;
            }

            this.wrappedEnumType = enumType;
            this.list = enumType.LIST;
            if (!this.value && def.defaultFirstItem) {
                let value;
                if (typeof (def.defaultFirstItem) === 'function') {
                    value = def.defaultFirstItem(enumType);
                } else if (enumType.LIST[0] !== undefined) {
                    ([{value}] = enumType.LIST);
                }
                this.$emit('change', value);
            }
        }
    }
};
