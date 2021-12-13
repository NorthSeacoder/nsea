<!-- @author xiaodongyu -->
<!-- @email xiaodongyu@yangqianguan.com -->
<!-- @date 2019-12-16 14:46:43 -->
<!-- @desc field-file.vue -->

<template>
    <div :class="{'preview-file-wrap': customPreview}">
        <component
            :is="component"
            class="field-file"
            v-bind="antProp"
            @change="onChange"
            @preview="onPreview"
        >
            <component
                :is="def.props.draggable ? 'p' : 'a-button'"
            >
                <a-icon type="upload" />
                <span v-html="draggableText || $t('common.chooseFile')" />
                <div v-if="def.props.draggable && acceptTips">
                    {{ acceptTips }}
                </div>
            </component>
        </component>
        <div v-if="message" class="yqg-text-danger">
            {{ message }}
        </div>
        <template v-if="customPreview">
            <div v-for="file in fileList" :key="file.uid">
                <div v-if="file.response">
                    <p>
                        <a-icon type="link" />
                        <a @click="onPreview(file)">{{ decodeURIComponent(file.name) }}</a>
                        <a-button
                            v-if="isPdf(file.name) && getPreviewUrl(file)"
                            size="small"
                            class="ml10 mr10"
                            @click="onPreviewPdf(getPreviewUrl(file))"
                        >
                            预览
                        </a-button>
                        <a-icon type="delete" class="danger" @click="remove(file)" />
                    </p>
                    <img
                        v-if="isImage(file.name)"
                        :src="getFileUrl(file)"
                        :height="200"
                    >
                    <audio v-if="isAudio(file.name)" :src="getFileUrl(file)" controls />
                </div>
            </div>
        </template>
    </div>
</template>

<script type="text/babel">
import _ from 'underscore';

import {pickValue, evalProp} from '../../../util/object';

const getScope = (min, max, filter = x => x) => {
    const isExact = min === max;
    if (isExact) return `${filter(min)}`;
    if (min === 0) return `不大于${filter(max)}`;
    if (max === Infinity) return `不小于${filter(min)}`;
    return `${filter(min)}-${filter(max)}`;
};

const unitByte = size => {
    if (typeof size !== 'number' || size < 0) return 0;

    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const unitFactor = 1024;
    let result = `${size} B`;
    let index = 0;

    while (size >= unitFactor && index !== units.length - 1) {
        index += 1;
        size /= unitFactor;
        if (!Number.isInteger(size)) size = size.toFixed(2);
        result = `${size}${units[index]}`;
    }

    return result;
};

export default {
    name: 'FieldFile',

    props: {
        def: {
            type: Object,
            required: true
        },

        value: {
            type: [File, Array, Number, String, Object],
            default: undefined
        },

        previewValue: {
            type: [File, Array, Number, String],
            default: undefined
        }
    },

    data() {
        return {
            fileList: [].concat(this.previewValue || []),
            isValid: true,
            message: null
        };
    },

    computed: {
        multiple() {
            const {def: {props: {single = true} = {}}} = this;
            return !single;
        },

        component() {
            return this.def.props.draggable ? 'a-upload-dragger' : 'a-upload';
        },

        acceptTips() {
            const {def: {props: {accept} = {}}} = this;
            return accept ? `仅支持${accept.replace(/,/g, '、')}格式` : '';
        },

        antProp() {
            const {
                def: {props = {}},
                fileList, multiple, beforeUpload, remove
            } = this;
            return {
                ...props,
                draggable: undefined,
                raw: undefined,
                fileList,
                multiple,
                beforeUpload,
                remove
            };
        },

        draggableText() {
            const {def: {props}} = this;
            return evalProp(props.draggableText, props);
        },

        customPreview() {
            return this.def.props.preview || false;
        }
    },

    watch: {
        value(val) {
            if (!val) {
                this.fileList = [];
            }
        }
    },

    methods: {
        validateFile(file) {
            const {name, size} = file;
            if (size === 0) {
                return {isValid: false, message: '文件不能为空，请重新上传'};
            }

            const {def: {props: {minSize = 0, maxSize = Infinity, accept, imageOnly = false} = {}}} = this;
            const isImg = this.isImage(name);
            const accepts = accept?.split(',') || [];

            if (accepts.length && !accepts.some(ext => new RegExp(`${ext}$`, 'i').test(name))) {
                return {isValid: false, message: `仅支持${accepts.join('、')}格式`};
            }

            if (imageOnly && !isImg) {
                return {isValid: false, message: '仅支持上传图片'};
            }

            if (size < minSize || size > maxSize) {
                const fileType = isImg ? '图片' : '文件';

                return {
                    isValid: false,
                    // eslint-disable-next-line max-len
                    message: `当前${fileType}大小为${unitByte(size)}，请上传大小为${getScope(minSize, maxSize, unitByte)}的${fileType}`
                };
            }

            return {isValid: true, message: null};
        },

        beforeUpload(file) {
            const {def: {props: {raw, imageOnly = false}}, validateFile, multiple} = this;

            // eslint-disable-next-line
            return new Promise(async (resolve, reject) => {
                const {isValid, message} = validateFile(file);

                if (!isValid) {
                    this.message = message;
                    reject();
                    return;
                }

                if (imageOnly) {
                    const reader = new FileReader();
                    await new Promise((imgResolve, imgReject) => {
                        reader.onload = ({target: {result}}) => {
                            const image = new Image();
                            image.onerror = () => {
                                this.message = '文件有误，请重新上传';
                                imgReject();
                            };
                            image.onload = imgResolve;
                            image.src = result;
                        };
                        reader.readAsDataURL(file);
                    });
                }

                this.message = null;

                if (raw) {
                    this.fileList = multiple ? [...this.fileList, file] : [file];
                    this.$emit('change', multiple ? this.fileList : file);
                    reject();
                    return;
                }

                resolve();

            });
        },

        onChange(info) {
            const {multiple, def: {props: {raw}}} = this;
            const {file, file: {uid, status}} = info;

            if (multiple) {
                this.fileList = _.find(this.fileList, item => item.uid === uid)
                    ? this.fileList : [...this.fileList, file];
            } else {
                this.fileList = [file];
            }

            if (!raw && status === 'done') {
                const values = this.getFileListValues();
                this.$emit('change', multiple ? values : values[0]);
            }
        },

        onPreview({response}) {
            const {def: {props = {}}} = this;
            if (props.urlField) {
                window.open(pickValue(response.body || response, props.urlField));
            }
        },

        onPreviewPdf(url) {
            window.open(url);
        },

        getFileListValues() {
            const {def: {props: {valueField} = {}}, fileList} = this;
            return fileList
                .filter(item => item.response)
                .map(item => {
                    const {response} = item;
                    const {body = response} = response;
                    if (valueField) return pickValue(body, valueField);

                    // 方便一些中间组件如field-rich的上传，既能拿到url又能拿到id 还能拿到file name
                    return {...item, ...body};
                });
        },

        remove(file) {
            const {multiple, def: {props = {}}} = this;
            const index = this.fileList.indexOf(file);
            this.fileList.splice(index, 1);
            if (multiple) {
                this.$emit('change', props.raw ? this.fileList : this.getFileListValues());
            } else {
                this.$emit('change', undefined);
            }
        },

        getFileUrl({response}) {
            const {def: {props: {urlField} = {}}} = this;

            return pickValue(response.body, urlField);
        },

        getPreviewUrl({response}) {
            const {def: {props: {previewField, urlField, setCustomerPreviewUrl} = {}}} = this;
            const previewUrl = pickValue(response.body, previewField || urlField);

            if (setCustomerPreviewUrl) {
                return setCustomerPreviewUrl(previewUrl);
            }

            return previewUrl;
        },

        isImage(name) {
            const IMG_TESTER = /\.(img|jpg|jpeg|png|gif)$/i;

            return IMG_TESTER.test(name);
        },

        isPdf(name) {
            return /\.pdf$/i.test(name);
        },

        isAudio(name) {
            return /\.wav$/i.test(name);
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.field-file {
    .ant-upload-drag {
        padding: 20px 0;
    }
}

.preview-file-wrap {
    .ant-upload-list {
        display: none;
    }
}
</style>
