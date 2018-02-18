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
    appJs: './app/assets/js/',
    appStyles: './app/assets/css/',
    appEmail: './app/email/',
    appForms: './app/forms/'
};

function isDev() {
    return NODE_ENV.localeCompare("development") === 0;
}

function getPlugins() {
    let plugins = [
        new webpack.DefinePlugin({
            NODE_ENV:   JSON.stringify(NODE_ENV),
            LANG:       JSON.stringify('ru')
        }),
        new CleanWebpackPlugin(
            paths.buildRoot, {
                verbose: true
            }),
        new ExtractTextPlugin({
            filename: isDev() ? './[name][hash].css' : './tc-email-notifier.css',
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new CopyWebpackPlugin([
            {from: paths.vendor, to: './vendor/'},
            {from: paths.appEmail, to: './email/'},
            {from: paths.appRoot + '/core.php', to: './tc-email-notifier.php'}
        ]),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            "window.jQuery": "jquery",
        }),
    ];

    if(!isDev()) {
        plugins.push(new UglifyJsPlugin());
        plugins.push(new webpack.LoaderOptionsPlugin({
            minimize: true,
            options: {
                postcss: [autoprefixer]
            }
        }));
    } else {
        plugins.push(new HtmlWebpackPlugin({
            template: './app/index.html',
            filename: './index.html' //relative to root of the application
        }));
    }

    return plugins;
}

module.exports = {

    /* main */
    context: __dirname,
    entry: {
        index: paths.appJs + '/index.js'
    },
    output: {
        path: __dirname + paths.build,
        filename: isDev() ? './[name][hash].js' : './tc-email-notifier.js',
    },

    /* devtools */
    watch: isDev(),
    watchOptions: {
        aggregateTimeout: 100
    },

    devServer: {
        host: 'localhost',
        port: 8081,
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
    },

    devtool: isDev() ? 'cheap-inline-module-source-map' : false,

    /* plugins */
    plugins: getPlugins(),
    module: {
        rules : [ {
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

