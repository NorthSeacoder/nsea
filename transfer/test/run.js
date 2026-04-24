const $ = require('gogocode');
const t = require('../dist/index');
const path = require('path');
const fs = require('fs');
const inputPath = path.resolve(__dirname, './input.js');
const outputPath = path.resolve(__dirname, './output.js');

fs.readFile(inputPath, function read(err, code) {
    if (err) {
        throw err;
    }
    const outputCode = t(
        {
            source: code.toString(),
            path: inputPath
        },
        {
            gogocode: $
        },
        {type: 'resource'}
    );

    fs.writeFile(outputPath, outputCode, function (err) {
        if (err) {
            throw err;
        }
        console.log('The file was saved!');
    });
});
