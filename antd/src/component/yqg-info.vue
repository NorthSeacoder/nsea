<!-- @author ruiwang-->
<!-- @email ruiwang@yangqianguan.com -->
<!-- @date 2021-04-15 13:48:35 -->
<!-- @desc yqg-info-table-next.vue -->

<script type="text/babel">
import {pickValue} from '../util/object';

export default {
    name: 'YqgInfo',

    inject: {
        isValidDef: {default: () => x => x}
    },

    props: {
        ctx: {
            type: Object,
            default: () => ({})
        },
        options: {
            type: Object,
            default: () => ({})
        },
        column: {
            type: Number,
            default: 6
        },
        values: {
            type: Object,
            default: () => ({})
        }
    },

    computed: {
        comProps() {
            const {column, options: {colDefs, layout = 'vertical', ...rest}} = this; // eslint-disable-line
            return {
                bordered: true,
                layout,
                column,
                ...rest
            };
        }
    },

    methods: {
        getDefValueProps(def) {
            const {ctx, values} = this;
            const {field} = def;
            const value = pickValue(values, field);

            return {
                ctx,
                def,
                value,
                values,
                record: values,
                defaultText: '/'
            };
        },

        renderCell(def) {
            const {$scopedSlots} = this;
            const {field: key} = def;
            const props = this.getDefValueProps(def);
            if ($scopedSlots[key]) return $scopedSlots[key](props);

            const comp = def.staticComp || 'def-value';
            return <comp {...{props}} />;
        }
    },

    render() {
        const {options: {colDefs}, comProps: props} = this;
        const items = colDefs.map(def => (
            <a-descriptions-item key={def.field} label={this.$t(def.label)}>
                {this.renderCell(def)}
            </a-descriptions-item>
        ));
        return (
            <a-descriptions {...{props}}>
                {items}
            </a-descriptions>
        );
    }
};
</script>
