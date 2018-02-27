/**
 * Created by RiskyWorks on 05.02.2018.
 */

const NODE_ENV = process.env.NODE_ENV;

console.log("Script running in " + NODE_ENV + " mode");
console.log("isDev: " + isDev());

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let paths = {
    build: '/build',
    buildRoot: './build',
    vendor: './vendor',

    appRoot: './app',
    appBackend: './app/backend/',
    appJs: './app/assets/js/',
    appStyles: './app/assets/css/',
    appEmail: './app/email/',
    appForms: './app/forms/'
};

function isDev() {
    return NODE_ENV.localeCompare("development") === 0;
}

function getPlugins() {
    const plugins = [
        new webpack.DefinePlugin({
            NODE_ENV:   JSON.stringify(NODE_ENV),
            LANG:       JSON.stringify('ru'),
            isDev: isDev()
        }),
        new CleanWebpackPlugin(
            paths.buildRoot, {
                verbose: true
            }),
        new ExtractTextPlugin({
            filename: './tc-email-notifier.css',
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            template: './app/index.html'
        }),
        new CopyWebpackPlugin([
            {from: paths.vendor, to: 'vendor'},
            {from: paths.appEmail, to: 'email'},
            {from: paths.appBackend + '/core.php', to: 'tc-email-notifier.php'}
        ])
    ];

    if(isDev()) {
        plugins.push(new HtmlWebpackPlugin({
            template: './app/index.html'
        }));
    } else {
        plugins.push(new UglifyJsPlugin());
        plugins.push(new webpack.LoaderOptionsPlugin({
            minimize: true,
            options: {
                postcss: [autoprefixer]
            }
        }));
    }

    return plugins;
}

module.exports = {


    context: __dirname,
    entry: {
        index: paths.appJs + '/index.js'
    },
    output: {
        path: __dirname + paths.build,
        filename: './tc-email-notifier.js',
    },

    watch: isDev(),
    watchOptions: {
        aggregateTimeout: 100
    },

    devServer: {
        contentBase: './build',
        host: 'localhost',
        port: 8081,
    },

    devtool: isDev() ? 'cheap-inline-module-source-map' : 'inline-source-map',

    plugins: getPlugins(),

    module: {
        rules : [{
            test: /\.js$/,
            loader: 'babel-loader'
        }, {
            test: /\.pug$/,
            loader: 'pug-loader',
            options: {
                pretty: isDev()
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
            test:/\.(eot|svg|ttf|woff|woff2)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    outputPath: paths.buildFonts
                }
            }]
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    outputPath: paths.buildImages
                }
            }]
        }]
    }
};

