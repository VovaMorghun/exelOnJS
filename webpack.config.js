const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = !isProduction



// console.log('is production', isProduction);
// console.log('is development', isDevelopment);

const filename = ext => isDevelopment ? `bundle.${ext}` : `bundle.[hash].${ext}`
const jsLoaders = () => {
    const loaders = [{
        loader: "babel-loader",
        options: {
            presets: ['@babel/preset-env']

        }
    }];
    if (isDevelopment) {
        loaders.push('eslint-loader');
    }
}

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: 'development',
    entry: ['@babel/polyfill', './index.js'],
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, 'dist', 'src'),
            '@core': path.resolve(__dirname, 'src/core')
        }
    },
    plugins: [

        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: 'index.html',
            minify: {
                removeComments: isProduction,
                collapseWhitespace: isProduction
            }
        }),

        new CopyPlugin({
            patterns: [{
                from: path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname, 'dist')
            }]
        }),

        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ],

    devtool: isDevelopment ? 'source-map' : false,
    target: process.env.NODE_ENV === "development" ? "web" : "browserslist",
    devServer: {
        port: 3000,
        contentBase: path.join(__dirname, 'src/'),
        watchContentBase: true,
        hot: true
    },

    module: {

        rules: [{
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
            },

            {
                test: /\.m?js$/,
                exclude: /node_modules/,

                use: jsLoaders(),

            }
        ],
    },
}