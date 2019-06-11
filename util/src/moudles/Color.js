/**
 * @description 渐变色
 */
class Intensity {
    /**
     * @constructor Intensity
     * description 获取渐变色阶/size
     * @param {Object} options 
     * @param {Object} options.gradient 色阶 {0.1:red,0.5:'#fff'}
     * @param {Number} options.maxSize 最大size
     * @param {Number} options.minSize 最小size
     * @param {Number} options.max 最大值
     * @param {String} options.colorType 返回颜色类型 'binary'||'rgb'
     * @returns {Object} 当前对象实例
     */
    constructor(options) {
        options = options || {};
        this.gradient = options.gradient || {
            0.25: "rgba(0, 0, 255, 1)",
            0.55: "rgba(0, 255, 0, 1)",
            0.85: "rgba(255, 255, 0, 1)",
            1.0: "rgba(255, 0, 0, 1)"
        };
        this.maxSize = options.maxSize || 35;
        this.minSize = options.minSize || 0;
        this.max = options.max || 100;
        this.colorType = options.colorType || 'rgb';
        this.initPalette();
    }

    initPalette() {

        var gradient = this.gradient;

        if (typeof document === 'undefined') {
            // var Canvas = require('canvas');
            // var paletteCanvas = new Canvas(256, 1);
        } else {
            var paletteCanvas = document.createElement('canvas');
        }

        paletteCanvas.width = 256;
        paletteCanvas.height = 1;

        var paletteCtx = this.paletteCtx = paletteCanvas.getContext('2d');

        var lineGradient = paletteCtx.createLinearGradient(0, 0, 256, 1);

        for (var key in gradient) {
            lineGradient.addColorStop(parseFloat(key), gradient[key]);
        }
        paletteCtx.fillStyle = lineGradient;
        paletteCtx.fillRect(0, 0, 256, 1);
    }

    /**
     * 根据value获取色阶颜色
     * @param {Number} value  
     * @returns {String}
     */
    getColor(value) {

        var max = this.max;

        if (value > max) {
            value = max;
        }

        var index = Math.floor(value / max * (256 - 1)) * 4;

        var imageData = this.paletteCtx.getImageData(0, 0, 256, 1).data;

        var color = "rgba(" + imageData[index] + ", " + imageData[index + 1] + ", " + imageData[index + 2] + ", " + imageData[index + 3] / 256 + ")";

        return this.colorType == 'binary' ? utilsColor.rgb2binary(color) : color;
    }



    /**
     * 根据value获取size
     * @param {Number} value  
     */
    getSize(value) {

        var size = 0;
        var max = this.max;
        var maxSize = this.maxSize;
        var minSize = this.minSize;

        if (value > max) {
            value = max;
        }

        size = minSize + value / max * (maxSize - minSize);

        return size;
    }
}

/**
 * @description 颜色转换
 */
export default class utilsColor {
    /**
     * 根据rbg颜色转换成二进制网页色
     * @param {String} color  rgb颜色
     * @returns {String} 二进制网页色
     */
    static rgb2binary(color) {
        color = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (color && color.length === 4) ? '#' +
            ('0' + parseInt(color[1], 10).toString(16)).slice(-2) +
            ('0' + parseInt(color[2], 10).toString(16)).slice(-2) +
            ('0' + parseInt(color[3], 10).toString(16)).slice(-2) : '';
    }

    /**
     * 
     * @param {Object} options 
     * @param {Object} options.gradient 色阶 {0.1:red,0.5:'#fff'}
     * @param {Number} options.maxSize 最大size
     * @param {Number} options.minSize 最小size
     * @param {Number} options.max 最大值
     * @param {String} options.colorType 返回颜色类型 'binary'||'rgb'
     * @returns {Object} 当前对象实例
     */
    static intensity(options) {
        return new Intensity(options);
    }
}