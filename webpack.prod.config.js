/* eslint-disable no-console */
/**
 * Created by RiskyWorks on 05.02.2018.
 */
const common = require('./webpack.common');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
	plugins: [
		new UglifyJsPlugin(),
	],
});

