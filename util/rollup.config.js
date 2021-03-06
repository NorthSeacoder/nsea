import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import scss from 'rollup-plugin-scss';
// import vue from 'rollup-plugin-vue';
import {uglify} from 'rollup-plugin-uglify';

export default {
    input: 'src/index.js',
    output: {
        file: 'lib/utils.min.js',
        format: 'cjs',
        name: 'nscUtils'
    },
    plugins: [
        // vue({
        //     autoStyles: false,
        //     styleToImports: true
        // }),
        // scss({
        //     output: 'dist/base-ui.css',
        //     outputStyle: 'compressed'
        // }),
        babel({
            presets: [['env', {modules: false}], 'stage-3'],
            exclude: 'node_modules/**',
            plugins: ['external-helpers'],
            babelrc: false
        }),
        commonjs(),
        resolve({
            extensions: ['.js', '.json'],
            jsnext: true,
            main: true,
            browser: true
        }),
        uglify()
    ]
};
