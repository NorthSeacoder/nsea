import  {defaultTypes} from './constant';
import {setCommit,getConfig} from './utils';

const config =getConfig();
const options = {
    types: config.types || defaultTypes.types,
    defaultType: process.env.CZ_TYPE || config.defaultType,
    defaultScope: process.env.CZ_SCOPE || config.defaultScope,
};

export default setCommit(options)