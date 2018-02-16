// Karma configuration
// Generated on Thu Feb 15 2018 21:44:38 GMT-0300 (Hora oficial do Brasil)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai'],


        // list of files / patterns to load in the browser
        files: [
            // '__test__/test/specs/pure.spec.js',
            "./build/browser/axios-rx.bundle.js",
            './__test__/test/specs/**/*.js',
            // 'test/**/*.ts',
            // '__test__/**/*.map',
            // 'src/**/*.ts',
            // 'test/**/basic.spec.ts'
        ],


        // list of files / patterns to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // 'test/**/basic.spec.ts': ['karma-typescript']
            '__test__/test/specs/**/*.js': ['rollup'],
            // 'src/**/*.ts': ['karma-typescript'],
            // 'test/**/*.ts': ['commonjs'],
            // 'src/**/*.ts': ['commonjs'],
            // '**/*.js': ['commonjs']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        karmaTypescriptConfig: {

            tsconfig: "test/tsconfig.json"

        },

        rollupPreprocessor: {
            // plugins: [require('rollup-plugin-buble')()],
            plugins: [
                require('rollup-plugin-node-resolve')({
                    jsnext: true,
                    main: true,
                    preferBuiltins: true,
                    browser: true
                }),
                require('rollup-plugin-sourcemaps')(),
                require('rollup-plugin-commonjs')(),
                require('rollup-plugin-json')(),
            ],
            output: {
                format: 'iife',
                name: 'axiosrx_tests',
                sourcemap: 'inline',
                globals: {
                    "../../src": "axiosrx"
                }
            },
            external: [
                "../../src",
                'axiosrx'
            ],
        }
    })
}
