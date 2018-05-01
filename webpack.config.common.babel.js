/* eslint-disable no-console */
/**
 * Created by RiskyWorks on 05.02.2018.
 */

import udf from './webpack.udf';
import paths from './webpack.paths';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const poststylus = require('poststylus');
const autoprefixer = require('autoprefixer');

module.exports = {
    context: path.resolve(__dirname),

    plugins: [
        require('autoprefixer'),
        new webpack.DefinePlugin({
            NODE_ENV:   udf.NODE_ENV,
            LANG:       JSON.stringify('ru'),
            isDev: udf.isDev,
            localIpAddress: udf.localIpAddress
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
        }),

        new webpack.ProvidePlugin({
            $: path.resolve('./node_modules/jquery/dist/jquery.min.js'),
            jQuery: path.resolve('./node_modules/jquery/dist/jquery.min.js'),
            'window.jQuery': path.resolve('./node_modules/jquery/dist/jquery.min.js')
        }),
        new CopyWebpackPlugin([
            {from: path.join(paths.src, '/email'), to: './email'},
            {from: path.join('./vendor'), to: './vendor'},
            {from: path.join(paths.src, '/assets/core.js'), to: './tc-email-notifier.js'},

            {from: path.join(paths.src, '/backend/email'), to: './email'},
			{from: path.join(paths.src, '/backend/core.php'), to: './tc-email-notifier.php'},
        ]),
        new webpack.LoaderOptionsPlugin({
            options: {
                stylus: {
                    use: [poststylus([ autoprefixer({browsers: 'last 2 versions', grid: true}), 'rucksack-css' ])]
                }
            }
        }),
        new ExtractTextPlugin({
            filename: path.join(paths.assets, '[name].css')
        }),
    ],

    module: {
        rules : [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader',
                options: {
                    pretty: true
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
                test: /\.css/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader'],
                    publicPath: '../../'
                })
            },
            {
                test: /\.(pdf|doc|docx)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: paths.assets
                    }
                }]
            },{
                test:/\.(eot|svg|ttf|woff|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: paths.assets
                    }
                }]
            },{
                test: /\.ico$/,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: paths.assets
                        }
                    }
                ]
            },{
                test: /\.(png|jpe?g|gif)$/,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: paths.assets
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