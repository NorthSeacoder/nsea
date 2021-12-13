<!-- @author xiaodongyu -->
<!-- @email xiaodongyu@yangqianguan.com -->
<!-- @date 2020-11-19 16:55:12 -->
<!-- @desc inline-font-size-btn.vue -->

<template>
    <div class="inline-font-size-btn">
        <a-icon
            class="icon"
            type="font-size"
            @click="onChange()"
        />
        <select
            v-model="fontSize"
            size="small"
            class="font-size-select"
            @change="onChange"
        >
            <option
                v-for="(title, value) in optionMap"
                :key="value"
                :value="value"
            >
                {{ title }}
            </option>
        </select>
    </div>
</template>

<script type="text/babel">
export default {
    name: 'InlineFontSizeBtn',

    props: {
        initSize: {
            type: String,
            default: 'unset'
        }
    },

    data() {
        return {
            fontSize: this.initSize
        };
    },

    computed: {
        optionMap() {
            const min = 12;
            const arr = new Array(11).fill('').map((item, idx) => min + idx * 2).concat(36, 48, 72);

            return arr.reduce(
                (map, size) => ({...map, [`${size}px`]: size}),
                {unset: this.$t('rich.auto')}
            );
        }
    },

    methods: {
        onChange() {
            this.$emit('change', this.fontSize);
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.inline-font-size-btn {
    .icon {
        margin: -.2rem 0 -.2rem -.5rem;
        padding: .2rem 0 .2rem .5rem;
    }

    .font-size-select {
        width: 45px;
        height: 16px;
        font-size: 12px;
        outline: none;
        border: none;
    }
}
</style>
