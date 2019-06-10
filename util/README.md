# Usage

Install with npm

```
npm i nscutils
```

```javascript
const Utils = require("nscutils");
```

## the utils for Array

### sort

```javascript
const Utils = require("nscutils");
/**
 * @example utils.Array.order([{value:10},{value:20}],'desc','value')
 * @example utils.Array.order([10,20],'desc')
 * @param {Array} array source
 * @param {String} type sort type asc/desc  default asc
 * @param {String} column
 * @returns {Array} sorted Array
 */
const res = Utils.Array.order(array, type, column);
```

### de-duplication

```javascript
const Utils = require("nscutils");
/**
 * @example utils.Array.unique([{name:'zs'},{name:'zs'}],'name')
 * @example utils.Array.unique([10,10])
 * @param {Array} array
 * @param {String} column
 * @returns {Array}
 */
const res = Utils.Array.unique(array, column);
```

## the utils for String

### removeHTML

```javascript
const Utils = require("nscutils");
/**
 * @param {String} html
 * @returns {String}
 * @example 'string'=Utils.String.removeHTML(`<span class="gray7 mr20">string</span>`)
 */
const res = Utils.String.removeHTML(html);
```

### cut off string and append in the end

```javascript
const Utils = require("nscutils");
/**
 *  subString(`sadfsdafsd`,2,'...')
 * @param {String} val
 * @param {Number} len
 * @param {String} suffix
 * @example 'sa...'=Utils.String.subString(`sadfsdafsd`,2,'...')
 * @returns {String}
 */
const res = Utils.String.subString(val, len, suffix);
```

### String->Float

```javascript
const Utils = require("nscutils");
/**
 * @param {String} val
 * @param {Number} len  decimal length
 * @param {Boolean} fill   default =true
 * @returns {String}
 * @example '1.20'=Utils.String.toFixed('1.2',2)
 * @example '1.2'=Utils.String.toFixed('1.2',2,false)
 */
const res = Utils.String.toFixed(val, len, fill);
```

### delete f&p space

```javascript
const Utils = require("nscutils");
/**
 * @param {String} val
 * @returns {String}
 * @example "das das"=nscutils.String.trim(`   das das  `)
 */
const res = Utils.String.trim(val);
```

### replaceAll

```javascript
const Utils = require("nscutils");
/**
 * @param {String} val
 * @param {String} replacestr
 * @param {String} newstr
 * @returns {String}
 * @example "a|aa|aa"=nscutils.String.replaceAll(`asaasaa`,'s','|')
 */
const res = Utils.String.replaceAll(val, replacestr, newstr);
```

### String->Date

```javascript
const Utils = require("nscutils");
/**
 * @param {String} val
 * @param {String} split  '-'|'/'|... required default '-'
 * @returns {Date}
 * @example nscutils.String.toDate(`2015-01-01`,'-')
 */
const res = Utils.String.toDate(val, split);
```

## the utils for Date

### format

```javascript
const Utils = require("nscutils");
/**
 * @param {Date} date
 * @param {String} fmt   yyyy-MM-dd
 * "y+":year
 * "M+":month
 * "q+":quarter
 * "d+": day
 * "h+": hour
 * "m+": minute
 * "s+":second
 * "S": Millisecond
 * @returns {String}
 * @example "2018-11-14"=nscutils.Date.format(new Date(),'yyyy-MM-dd')
 */
const res = Utils.Date.format(date, fmt);
```

### countdown now -> date

```javascript
const Utils = require("nscutils");
/**
 * @param {Date} date 2019-01-08 00:00:00
 * @returns {String}
 * @example "2018-11-14"=nscutils.Date.format(2019-01-08 00:00:00)
 */
const res = Utils.Date.Countdown(date);
```

## the utils for Object/Array

### copy

```javascript
const Utils = require('nscutils');
/**
 * @param {Boolean} isDeep
 * @param {Object/Array} target
 * @param {Object/Array} src  one or more Object
 * @returns {Object/Array}
 * @example {a:1,b:2,d:4,f:5}=nscutils.Object.extend(true,{},{a:1,b:2},{d:4},{f:5})
 * also worked in Array
 * @example [4,1,5,4]nscutils.Object.extend(true,[],[1,2,3,4],[4,1,5])
 * @example [1,2,3,4]nscutils.Object.extend(true,[],[1,2,3,4])
 */
const res = Utils.Object.extend(isDeep,target,src...);
```

## the utils for color

### rgb->binary

```javascript
const Utils = require("nscutils");
/**
 * @param {String} color
 * @returns {String}
 */
const res = Utils.Color.rgb2binary(color);
```
