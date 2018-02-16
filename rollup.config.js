import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import sourcemaps from 'rollup-plugin-sourcemaps';
// import uglify from 'rollup-plugin-uglify';

export default [
    {
        input: 'build/esm/index.js',
        output: [/* {
            name: 'axiosrx',
            file: "build/browser/axios-rx.iife.js",
            format: 'iife',
            sourcemap: true,
            globals: {
                "axios": "axios"
            },
        }, */
            {
                name: 'axiosrx',
                file: "build/browser/axios-rx.umd.js",
                format: 'umd',
                sourcemap: true,
                globals: {
                    "axios": "axios",
                    "rxjs/Observable": "Rx.Observable"
                },
            }],
        external: ['axios', 'rxjs/Observable'],
        plugins: [
            resolve({
                jsnext: true,
                main: true,
                preferBuiltins: true,
                browser: true
            }),
            sourcemaps(),
            commonjs(),
            json(),
            // uglify(),
        ]
    }
];
