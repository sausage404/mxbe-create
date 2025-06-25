const path = require('path');
const { default: common } = require('@mxbe/common');

/** @type {import('webpack').Configuration} */
module.exports = {
    entry: './src/index',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'behavior', 'scripts'),
        filename: 'bundle.js',
        module: true,
        library: {
            type: 'module'
        }
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    externals: common.pkg.modules.map(module => ({
        [module]: module
    })),
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
        ],
    },
    experiments: {
        outputModule: true
    }
};