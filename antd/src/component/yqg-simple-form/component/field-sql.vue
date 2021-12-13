<!-- @author xiaodongyu -->
<!-- @email xiaodongyu@yangqianguan.com -->
<!-- @date 2020-3-9 18:51:49 -->
<!-- @desc field-sql.vue -->

<template>
    <yqg-code-textarea
        class="field-sql"
        mode="text/x-sql"
        :value="value"
        :options="options"
        @input="onChange"
    />
</template>

<script type="text/babel">
export default {
    name: 'FieldSql',

    props: {
        value: {
            type: String,
            default: ''
        },
        def: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            options: {
                enableAutocomplete: true,
                lineNumbers: true,
                ...this.def.options
            }
        };
    },

    watch: {
        'def.options': function(defOptions) { // eslint-disable-line
            this.options = {
                enableAutocomplete: true,
                lineNumbers: true,
                ...defOptions
            };
        }
    },

    methods: {
        onChange(sql) {
            this.$emit('change', sql);
        }
    }
};
</script>
