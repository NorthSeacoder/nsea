/*
 * @Author: chengyuzhang
 * @Date: 2020-05-14 18:13:14
 * @Last Modified by: xiaodongyu
 * @Last Modified time: 2021-04-14 13:53:39
 */

import {merge, qiniuFileDef} from '../../../constant/fields';
import Fields from './fields';

export default ({fileDef = qiniuFileDef, multiple = false}) => {
    const fieldFile = merge(fileDef, Fields.file);
    if (multiple) {
        fieldFile.props = merge(fieldFile.props, {
            single: !multiple,
            draggable: true,
            // 上传多个不支持设置描述，所以直接吐对象
            valueField: ''
        });
        // 上传多个不支持设置描述，直接使用文件名
        fieldFile.onChange = null;
    }

    return {
        layout: 'horizontal',
        fieldDefs: [
            Fields.isLocal,
            Fields.fileUrl,
            fieldFile,
            merge(Fields.fileDesc, {
                hide: ({values: {isLocal}}) => isLocal && multiple
            })
        ]
    };
};
