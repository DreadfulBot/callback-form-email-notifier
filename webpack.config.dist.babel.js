/* eslint-disable no-console */
/**
 * Created by RiskyWorks on 05.02.2018.
 */

/**
 * Created by RiskyWorks on 05.02.2018.
 */
import paths from './webpack.paths';

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const common = require('./webpack.config.common.babel');
const merge = require('webpack-merge');

module.exports = merge(common, {
    entry: {
        index: path.resolve(path.join(paths.src, '/index.js')),
    },

    output: {
        path: path.join(__dirname, paths.dist),
        filename: '[name].bundle.js',
    },

    plugins: [
        new CleanWebpackPlugin(
            paths.dist, {
                verbose: true
            }),
    ]
});


