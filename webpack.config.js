const path = require('path');
const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const sharedConfig = {
    entry: './build/esm/index.js',
    output: {
        path: path.resolve(__dirname, 'build/webpack'),
        library: "axiosrx",
        libraryTarget: "umd"
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }
        ]
    },
    externals: {
        rxjs: "Rx"
    }
};

// Lib
const libConfig = Object.assign({}, sharedConfig, {
    output: Object.assign({}, sharedConfig.output, {
        filename: 'axiosrx.js',
    }),
    externals: Object.assign({}, sharedConfig.externals, {
        axios: "axios"
    }),
    plugins: [
    ]
});

const libMinConfig = Object.assign({}, libConfig, {
    output: Object.assign({}, libConfig.output, {
        filename: 'axiosrx.min.js',
    }),
    plugins: libConfig.plugins.concat([
        new UglifyJsPlugin({
            sourceMap: true
        })
    ])
});

const bundleConfig = Object.assign({}, sharedConfig, {
    output: Object.assign({}, sharedConfig.output, {
        filename: 'axiosrx.bundle.js',
    }),
    plugins: [
    ]
});

const bundleMinConfig = Object.assign({}, bundleConfig, {
    output: Object.assign({}, bundleConfig.output, {
        filename: 'axiosrx.bundle.min.js',
    }),
    plugins: bundleConfig.plugins.concat([
        new UglifyJsPlugin({
            sourceMap: true
        })
    ])
})

module.exports = [
    libConfig,
    libMinConfig,
    bundleConfig,
    bundleMinConfig,
];
