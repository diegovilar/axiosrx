const clone = require("clone");
const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { CheckerPlugin } = require("awesome-typescript-loader");

const TS_CONFIG_FILE = "./src/tsconfig.bundles.json";
const ENTRY = "./src/index.ts";
const LIBRARY_NAME = "axiosrx";
const OUTPUT_PATH = path.resolve(__dirname, "build/browser");
const OUTPUT_FILENAME = "axiosrx";

function cloneConfig(source) {
    const result = {};

    for (var name in source) {
        result[name] = (name == "plugins") ? source[name].slice(0) : clone(source[name]);
    }

    return result;
}

const sharedConfig = {
    entry: ENTRY,
    output: {
        path: OUTPUT_PATH,
        library: LIBRARY_NAME,
        libraryTarget: "umd"
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
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
        extensions: [".ts", ".js"]
    },
    externals: {
        "rxjs": {
            commonjs: "rxjs",
            commonjs2: "rxjs",
            amd: "rxjs",
            root: "Rx"
        },
        "rxjs/operators": {
            commonjs: "rxjs/operators",
            commonjs2: "rxjs/operators",
            amd: "rxjs/operators",
            root: "Rx.operators"
        }
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
libConfig.output.filename = `${OUTPUT_FILENAME}.js`;
libConfig.externals["axios"] = "axios";

// Lib min
const libMinConfig = cloneConfig(libConfig);
libMinConfig.output.filename = `${OUTPUT_FILENAME}.min.js`;
libMinConfig.plugins.push(
    new UglifyJsPlugin({
        sourceMap: true
    })
);

// Bundle
const bundleConfig = cloneConfig(sharedConfig);
bundleConfig.output.filename = `${OUTPUT_FILENAME}.bundle.js`;

// Bundle min
const bundleMinConfig = cloneConfig(bundleConfig);
bundleMinConfig.output.filename = `${OUTPUT_FILENAME}.bundle.min.js`;
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
