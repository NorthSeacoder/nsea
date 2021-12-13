<!-- @author xiaodongyu -->
<!-- @date 2019/11/15-10:47 -->
<!-- @desc yqg-simple-modal -->

<template>
    <div>
        <a-modal
            v-for="({
                visible,
                isForegroundWatermark,
                modalComponent,
                componentProps,
                dialogProps,
                close,
                dismiss,
                afterClose,
                watermarkStyle
            }, key) in modalMap"
            :key="key"
            v-bind="{
                visible,
                afterClose,
                destroyOnClose: true,
                maskClosable: false,
                footer: modalComponent.onlyClose ? undefined : null,
                width: 768,
                style: {overflowX: 'hidden', overflowY: 'auto'},
                bodyStyle: !isForegroundWatermark ? watermarkStyle : {},
                getContainer: () => $el,
                ...modalComponent.dialogProps,
                ...dialogProps
            }"
            @cancel="dismiss"
        >
            <component
                :is="modalComponent"
                v-bind="getModalComponentProps({
                    modalComponent,
                    componentProps,
                    close,
                    dismiss
                })"
                v-on="{
                    close,
                    dismiss,
                    ...(componentProps && componentProps.vOn)
                }"
            />
            <div
                v-if="isForegroundWatermark"
                :style="watermarkStyle"
                class="watermark-foreground"
            />
            <template v-if="modalComponent.onlyClose" v-slot:footer>
                <a-button @click="close" v-text="$t('common.close')" />
            </template>
        </a-modal>
    </div>
</template>
<script type="text/babel">
import Vue from 'vue';

import {watermark, modal} from '../mixin';

import {hasBaseUi} from './util';

let count = 0;

export default {
    name: 'YqgSimpleModal',

    mixins: [watermark],

    props: {
        disableWatermark: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            modalMap: {}
        };
    },

    beforeCreate() {
        this.$nextTick(() => {
            if (count > 1) {
                throw new Error('YqgSimpleModal is singleton pattern!');
            }
        });

        count += 1;
    },

    created() {
        const {open, clearModals, $router} = this;
        const modalKey = hasBaseUi() ? '$amodal' : '$modal';
        Vue.prototype[modalKey] = {
            open,
            clearModals
        };
        $router.beforeEach((from, to, next) => {
            clearModals();
            next();
        });
    },

    beforeDestroy() {
        count -= 1;
    },

    methods: {
        open(modalComponent, componentProps, options) {
            const {modalMap, closeModal, clearModal, disableWatermark} = this;
            const {dialogProps} = options || {};

            return new Promise((resolve, reject) => {
                const key = `${modalComponent.name}-${Object.keys(modalMap).length}`;
                const close = (...args) => {
                    closeModal(key);
                    resolve(...args);
                };
                const dismiss = (...args) => {
                    closeModal(key);
                    reject(...args);
                };
                const afterClose = () => clearModal(key);
                const watermarkStyle = disableWatermark ? {} : this.getBackgroundImage();
                this.modalMap = {
                    ...modalMap,
                    [key]: {
                        key,
                        visible: true,
                        isForegroundWatermark: modalComponent.watermark === 'foreground',
                        modalComponent,
                        componentProps,
                        dialogProps,
                        close,
                        dismiss,
                        afterClose,
                        watermarkStyle
                    }
                };
            });
        },

        getModalComponentProps({modalComponent, componentProps, close, dismiss}) {
            const {vOn, ...restProps} = componentProps ?? {}; // eslint-disable-line no-unused-vars
            if (modalComponent.mixins?.includes(modal) || modalComponent.functional) {
                return {
                    ...restProps,
                    close,
                    dismiss
                };
            }

            Object.entries({close, dismiss}).forEach(([propName, func]) => {
                if (modalComponent.props?.[propName]) {
                    restProps[propName] = func;
                }
            });

            return restProps;
        },

        closeModal(key) {
            const {modalMap} = this;
            if (modalMap[key]) {
                this.$set(modalMap, key, {
                    ...modalMap[key],
                    visible: false
                });
            }
        },

        clearModal(key) {
            this.$delete(this.modalMap, key);
        },

        clearModals() {
            this.modalMap = {};
        }
    }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.watermark-foreground {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: none;
}
</style>
