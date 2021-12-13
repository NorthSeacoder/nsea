/*
 * @Author: chengyuzhang
 * @Date: 2020-05-14 18:03:10
 * @Last Modified by: xiaodongyu
 * @Last Modified time: 2021-04-14 13:55:15
 */

import {merge, qiniuImageDef} from '../../../constant/fields';
import Fields from './fields';

export default ({imageDef = qiniuImageDef, multiple = false}) => {
    const fieldImage = merge(imageDef, Fields.image);
    const acceptArr = ['JPG', 'JPEG', 'PNG', 'BMP'];
    if (multiple) {
        fieldImage.props = merge(fieldImage.props, {
            single: !multiple,
            draggable: true,
            imageOnly: true,
            accept: acceptArr.map(ext => `.${ext.toLowerCase()}`).join(','),
            // 上传多个不支持设置描述，所以直接吐对象
            valueField: ''
        });
    }

    return {
        layout: 'horizontal',
        fieldDefs: [
            Fields.isLocal,
            fieldImage,
            Fields.imageUrl,
            // 上传多个不支持设置描述，直接使用文件名
            merge(Fields.imageDesc, {
                hide: ({values: {isLocal}}) => isLocal && multiple
            })
        ]
    };
};
