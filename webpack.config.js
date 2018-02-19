const clone = require('clone');
const path = require('path');
const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');

const TS_CONFIG_FILE = "./src/tsconfig.bundles.json";

function cloneConfig(source) {
    const result = {};

    for (var name in source) {
        result[name] = (name == "plugins") ? source[name].slice(0) : clone(source[name]);
    }

    return result;
}

const sharedConfig = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'build/browser'),
        library: "axiosrx",
        libraryTarget: "umd"
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{
                    loader: "awesome-typescript-loader",
                    options: {
                        configFileName: TS_CONFIG_FILE,
                        useCache: true
                    }
                }]
            }, {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    externals: {
        rxjs: "Rx"
    },
    plugins: [
        new CheckerPlugin(),
        new HardSourceWebpackPlugin(),

        // Caso façamos uso de paths nas configuracoes do compilador do typescript
        // new TsconfigPathsPlugin({ configFile: TS_CONFIG_FILE })
    ]
};

// Lib
const libConfig = cloneConfig(sharedConfig);
libConfig.output.filename = 'axiosrx.js';
libConfig.externals.axios = "axios";

// Lib min
const libMinConfig = cloneConfig(libConfig);
libMinConfig.output.filename = 'axiosrx.min.js';
libMinConfig.plugins.push(
    new UglifyJsPlugin({
        sourceMap: true
    })
);

// Bundle
const bundleConfig = cloneConfig(sharedConfig);
bundleConfig.output.filename = 'axiosrx.bundle.js';

// Bundle min
const bundleMinConfig = cloneConfig(bundleConfig);
bundleMinConfig.output.filename = 'axiosrx.bundle.min.js';
bundleMinConfig.plugins.push(
    new UglifyJsPlugin({
        sourceMap: true
    })
);

module.exports = [
    libConfig,
    libMinConfig,
    bundleConfig,
    bundleMinConfig,
];
