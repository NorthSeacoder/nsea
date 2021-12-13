/*
 * @Author: chengyuzhang
 * @Date: 2020-05-14 18:00:42
 * @Last Modified by: xiaodongyu
 * @Last Modified time: 2020-12-03 13:48:17
 */

const required = true;
const isLocal = ({record}) => record.isLocal;
const notLocal = (...args) => !isLocal(...args);

export default {
    imageUrl: {
        field: 'imageUrl',
        label: 'common.imageUrl',
        hide: isLocal,
        required
    },
    imageDesc: {
        field: 'imageDesc',
        label: 'common.imageDesc'
    },
    fileUrl: {
        field: 'fileUrl',
        label: 'common.fileUrl',
        hide: isLocal,
        required
    },
    fileDesc: {
        field: 'fileDesc',
        label: 'common.fileDesc'
    },
    isLocal: {
        field: 'isLocal',
        label: 'common.uploadLocal',
        type: 'switch'
    },
    image: {
        field: 'file',
        label: 'common.uploadImage',
        hide: notLocal,
        required
    },
    file: {
        field: 'file',
        label: 'common.uploadFile',
        hide: notLocal,
        required,
        onChange({value: {name} = {}, form}) {
            form.setFieldsValue({fileDesc: name});
        }
    }
};
