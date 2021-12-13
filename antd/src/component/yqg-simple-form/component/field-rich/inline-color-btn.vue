<!-- @author xiaodongyu -->
<!-- @email xiaodongyu@yangqianguan.com -->
<!-- @date 2020-11-17 18:54:38 -->
<!-- @desc inline-style-btn.vue -->

<template>
    <div class="inline-color-btn">
        <slot
            name="default"
            :color="color"
        />
        <a-popover
            v-model="visible"
            placement="bottom"
            trigger="click"
            overlay-class-name="rich-color-panel"
        >
            <template slot="content">
                <a-button
                    size="small"
                    block
                    class="auto-btn"
                    @click="onChange(initColor)"
                >
                    自动
                </a-button>
                <div class="color-title">
                    {{ $t('rich.primaryColor') }}
                </div>
                <div class="primary-color-list">
                    <div
                        v-for="(primaryColor, idx) in $options.PrimaryColors"
                        :key="primaryColor"
                        class="primary-color-column"
                    >
                        <div
                            :style="`background-color: ${primaryColor};`"
                            class="color-box primary-color-box"
                            @click="onChange(primaryColor)"
                        />
                        <div
                            v-for="rateColor in $options.PrimaryRateColors[idx]"
                            :key="rateColor"
                            :style="`background-color: ${rateColor};`"
                            class="color-box"
                            @click="onChange(rateColor)"
                        />
                    </div>
                </div>
                <div class="color-title">
                    {{ $t('rich.standardColor') }}
                </div>
                <div class="standard-color-list">
                    <div
                        v-for="standardColor in $options.StandardColors"
                        :key="standardColor"
                        :style="`background-color: ${standardColor};`"
                        class="color-box standard-color-box"
                        @click="onChange(standardColor)"
                    />
                </div>
            </template>
            <a-icon
                type="down"
                class="icon-down"
            />
        </a-popover>
    </div>
</template>

<script type="text/babel">
/* eslint-disable no-bitwise, no-floating-decimal */

function rate(num, percent) {
    const max = 255;
    num += Math.floor((percent > 0 ? max - num : num) * percent);
    num += max;
    return num % max;
}

function lighten(col, percent) {
    let usePrefix = false;
    if (col[0] === '#') {
        col = col.slice(1);
        usePrefix = true;
    }

    const num = parseInt(col, 16);
    const red = rate(num >> 16, percent);
    const green = rate((num >> 8) & 0x00FF, percent);
    const black = rate(num & 0x0000FF, percent);

    return `${usePrefix ? '#' : ''}${(black | (green << 8) | (red << 16)).toString(16).padStart(6, '0')}`;
}

const PrimaryColors = [
    '#ffffff',
    '#000000',
    '#e7e6e6',
    '#44536a',
    '#4372c3',
    '#ed7d31',
    '#a5a5a5',
    '#fec001',
    '#5b9bd5',
    '#70ad47'
];
// 加深darken传负的
const PrimaryRates = [
    [-.05, -.15, -.25, -.35, -.5],
    [.5, .35, .25, .15, .05],
    [-.1, -.25, -.5, -.75, -.9],
    [.8, .6, .4, -.25, -.5],
    [.8, .6, .4, -.25, -.5],
    [.8, .6, .4, -.25, -.5],
    [.8, .6, .4, -.25, -.5],
    [.8, .6, .4, -.25, -.5],
    [.8, .6, .4, -.25, -.5],
    [.8, .6, .4, -.25, -.5]
];
const PrimaryRateColors = PrimaryColors.map((color, idx) => PrimaryRates[idx].map(percent => lighten(color, percent)));

const StandardColors = [
    '#c00001',
    '#ff0100',
    '#fec001',
    '#ffff01',
    '#92cf50',
    '#00b04f',
    '#01b0ef',
    '#0070bf',
    '#00205f',
    '#7030a0'
];

export default {
    name: 'InlineColorBtn',

    props: {
        initColor: {
            type: String,
            default: 'unset'
        }
    },

    PrimaryColors,

    PrimaryRateColors,

    StandardColors,

    data() {
        return {
            color: this.initColor,
            visible: false
        };
    },

    methods: {
        onChange(color) {
            Object.assign(this, {color, visible: false});
            this.$emit('change', color);
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
$white: #fff;
$bgc: #323232;

.icon-down {
    padding: .2rem .5rem .2rem 0;
}

.rich-color-panel {
    .ant-popover-arrow {
        border-color: $bgc !important;
    }

    .ant-popover-inner {
        background-color: $bgc;
    }

    .auto-btn {
        color: $white;
        background-color: transparent;
    }

    .color-title {
        margin: 10px 0;
        font-weight: bold;
        color: $white;
    }

    .primary-color-list {
        display: flex;

        .primary-color-column {
            &:not(:last-of-type) {
                margin-right: 5px;
            }

            .primary-color-box {
                margin-bottom: 10px;
            }
        }
    }

    .standard-color-list {
        display: flex;

        .standard-color-box {
            margin-right: 5px;
        }
    }

    .color-box {
        width: 15px;
        height: 15px;
        cursor: pointer;
    }
}
</style>
