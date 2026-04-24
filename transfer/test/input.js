/*
 * @Author: pengmeng@yangqianguan.com
 * @Date: 2019-09-23 16:06:41
 * @Last Modified by: mengpeng 
 * @Last Modified time: 2021-12-18 14:57:08 
 */

import Resource from 'yqg-common/resource';

export const api = {
    url: '/admin/common/bank_account',

    getBankAccountByCode: {
        url: '/admin/common/enterprise/company_code/:companyCode/bank_account',
        method: 'get'
    },

    getBankAccount: {
        url: '/admin/common/enterprise/:id/bank_account',
        method: 'get'
    },

    getPaymentChannel: {
        url: '/admin/account/payment_channel',
        method: 'get'
    }
};

export default Resource.create(api);
