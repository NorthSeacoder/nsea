const path = require('path');

module.exports = {
    entry: './src/index.js',
    target: 'node',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: 'commonjs2',
            export: 'default'
        }
    },
    resolve: {
        alias: {
            '@common': path.resolve(__dirname, 'src/common/'),
            '@': path.resolve(__dirname, 'src/')
        }
    }
};
