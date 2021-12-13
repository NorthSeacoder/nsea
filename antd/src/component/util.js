/*
 * @Author: xiaodongyu
 * @Date 2020-04-17 18:34:26
 * @Last Modified by: xiaodongyu
 * @Last Modified time: 2020-04-20 08:59:01
 */

import Vue from 'vue';

export function hasBaseUi() {
    return !!Vue.component('b-button');
}
