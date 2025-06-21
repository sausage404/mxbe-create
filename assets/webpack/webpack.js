const path = require('path');
const { default: common } = require('@mxbe/common');

/** @type {import('webpack').Configuration} */
module.exports = {
    entry: './src/index',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'scripts'),
        filename: 'bundle.js'
    },
    externals: common.pkg.modules.map(module => ({
        [module]: module
    })),
    resolve: {
        extensions: ['.js'],
    },
    experiments: {
        outputModule: true
    }
};