const project = require("./package.json");
const clone = require("clone");
const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const {
    CheckerPlugin
} = require("awesome-typescript-loader");

const TS_CONFIG_FILE = "./tsconfig.bundles.json";
const ENTRY = "./src/index.ts";
const OUTPUT_PATH = path.resolve(__dirname, "build/bundles");

const LIBRARY_NAME = project.name.replace(/^@[^\/]+\//g, "").replace(/\//g, "_").toLowerCase();
const OUTPUT_FILENAME = "lib";

const libExternals = [
    externalizeRxjs,
    "axios"
];

const libWithDepsExternals = [
    externalizeRxjs
];

function cloneConfig(source) {
    const result = {};

    for (var name in source) {
        result[name] = (name == "plugins") ? source[name].slice(0) : clone(source[name]);
    }

    return result;
}

function externalizeRxjs(context, request, callback) {

    const match = /^rxjs(?:$|\/$|\/(.+))/.exec(request);

    if (match) {
        let root = "Rx";

        if (match[1]) {
            root += "." + match[1].replace(/\//g, ".");
        }

        return callback(null, {
            commonjs: request,
            commonjs2: request,
            amd: request,
            root: root
        });
    }

    callback();
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
        rules: [{
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
        }]
    },
    resolve: {
        extensions: [".ts", ".js"]
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
libConfig.output.filename = `${OUTPUT_FILENAME}.umd.js`;
libConfig.externals = libExternals;

// Lib min
const libMinConfig = cloneConfig(libConfig);
libMinConfig.output.filename = `${OUTPUT_FILENAME}.umd.min.js`;
libMinConfig.plugins.push(
    new UglifyJsPlugin({
        sourceMap: true
    })
);

// Bundle
const libWithDepsConfig = cloneConfig(sharedConfig);
libWithDepsConfig.output.filename = `${OUTPUT_FILENAME}.withdeps.umd.js`;
libWithDepsConfig.externals = libWithDepsExternals;

// Bundle min
const libWithDepsMinConfig = cloneConfig(libWithDepsConfig);
libWithDepsMinConfig.output.filename = `${OUTPUT_FILENAME}.withdeps.umd.min.js`;
libWithDepsMinConfig.plugins.push(
    new UglifyJsPlugin({
        sourceMap: true
    })
);

module.exports = [
    libConfig,
    libMinConfig,
    libWithDepsConfig,
    libWithDepsMinConfig,
];
