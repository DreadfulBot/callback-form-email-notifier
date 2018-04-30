/**
 * Created by RiskyWorks on 05.02.2018.
 */
import paths from './webpack.paths';
import udf from './webpack.udf';

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const common = require('./webpack.config.common.babel');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    entry: {
        index: path.resolve(path.join(paths.example, '/index.js')),
    },

    output: {
        path: path.join(__dirname, paths.build),
        filename: '[name].bundle.js',
    },

    watch: true,
    watchOptions: {
        aggregateTimeout: 100
    },

    devServer: {
        host: udf.localIpAddress,
        port: 8081,
    },

    devtool: 'cheap-inline-module-source-map',

    plugins: [
        new CleanWebpackPlugin(
            paths.build, {
                verbose: true
            }),
        new HtmlWebpackPlugin({
            chunks: ['index', 'commons'],
            template: paths.example + '/index.html',
            filename: 'index.html',
        }),
    ]
});