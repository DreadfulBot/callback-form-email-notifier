/* eslint-disable no-console */
/**
 * Created by RiskyWorks on 05.02.2018.
 */

const udf = require('./webpack.udf');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const poststylus = require('poststylus');

let paths = {
	dist: '/dist',
	distRoot: './dist',
	distImages: './assets/images/',
	distFonts: './assets/fonts/',
	distStyles: './assets/styles/',
	distDocs: './docs/',
	srcRoot: './src',
	srcImages: './src/assets/images/',
	srcComponents: './src/components/',
	srcStatic: './src/static/',
	pages: './pages'
};

console.log('isDev - ' + udf.isDev);

module.exports = {
	context: path.resolve(__dirname),

	entry: {
		index: path.resolve(path.join(paths.srcRoot, '/assets/core.js'))
	},

	output: {
		path: path.join(__dirname, paths.dist),
		filename: udf.isDev ? '[name].bundle.js' : '[name].[hash].bundle.js' ,
	},

	plugins: [
		require('autoprefixer'),
		new webpack.DefinePlugin({
			NODE_ENV:   udf.NODE_ENV,
			LANG:       JSON.stringify('ru'),
			isDev: udf.isDev
		}),
		new CleanWebpackPlugin(
			paths.distRoot, {
				verbose: true
			}),
		new ExtractTextPlugin({
			filename: udf.isDev ? path.join(paths.distStyles, '[name].css') :
				path.join(paths.distStyles, '[name].[hash].css')

		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'commons',
		}),
		new webpack.ProvidePlugin({
			$: path.resolve('./node_modules/jquery/src/jquery.min.js'),
			jQuery: path.resolve('./node_modules/jquery/src/jquery.min.js'),
			'window.jQuery': path.resolve('./node_modules/jquery/src/jquery.min.js')
		}),
		new CopyWebpackPlugin([
			{from: path.join(paths.srcRoot, '/backend/core.php'), to: './tc-email-notifier.php'},
			{from: path.join('./vendor'), to: './vendor'},
			{from: path.join(paths.srcRoot, '/email'), to: './email'},
			{from: path.join(paths.srcRoot, '/assets/core.js'), to: './tc-email-notifier.js'},
		]),
		new webpack.LoaderOptionsPlugin({
			options: {
				stylus: {
					use: [poststylus([ 'autoprefixer', 'rucksack-css' ])]
				}
			}
		})
	],

	module: {
		rules : [
			{
				test: /\.js$/,
				loader: 'babel-loader'
			},
			{
				test: /\.pug$/,
				loader: 'pug-loader',
				options: {
					pretty: udf.isDev
				}
			}, {
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader'],
					publicPath: '../../'
				})
			}, {
				test: /\.sass$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader'],
					publicPath: '../../'
				})
			}, {
				test: /\.styl/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'stylus-loader'],
					publicPath: '../../'
				})
			}, {
				test: /\.(pdf|doc|docx)$/,
				use: [{
					loader: 'file-loader',
					options: {
						outputPath: paths.distDocs
					}
				}]
			},{
				test: /\.css/,
				use: ['style-loader', 'css-loader'],
			},{
				test:/\.(eot|svg|ttf|woff|woff2)$/,
				use: [{
					loader: 'file-loader',
					options: {
						outputPath: paths.distFonts
					}
				}]
			},{
				test: /\.ico$/,
				loaders: [
					{
						loader: 'file-loader',
						options: {
							outputPath: paths.distImages
						}
					}
				]
			},{
				test: /\.(png|jpe?g|gif)$/,
				loaders: [
					{
						loader: 'file-loader',
						options: {
							outputPath: paths.distImages
						}
					},{
						loader: 'imagemin-loader',
						options: {
							enabled: !udf.isDev,
							plugins: [
								{
									use: 'imagemin-pngquant',
									options: {
										quality: '50-60'
									}
								}
							]
						}
					},{
						loader: 'image-maxsize-webpack-loader',
						options: {
							'useImageMagick': false
						}
					}
				]
			}, {
				test: /\.vue$/,
				loader: 'vue-loader',
			}
		]
	}
};

