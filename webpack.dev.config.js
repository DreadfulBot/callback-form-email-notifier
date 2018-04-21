/* eslint-disable no-console */
/**
 * Created by RiskyWorks on 05.02.2018.
 */
const udf = require('./webpack.udf');
const common = require('./webpack.common');
const merge = require('webpack-merge');

module.exports = merge(common, {

	watch: true,
	watchOptions: {
		aggregateTimeout: 100
	},

	devServer: {
		host: udf.localIpAddress,
		port: 8081,
	},

	devtool: 'cheap-inline-module-source-map',
});

