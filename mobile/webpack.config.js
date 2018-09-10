const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

const postcssOpts = {
    ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
    plugins: () => [
        autoprefixer({
            browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
        }),
        pxtorem({ rootValue: 100, propWhiteList: [] })
    ],
};

module.exports = {
    devtool: 'source-map', // or 'inline-source-map'
    devServer: {
        disableHostCheck: true,
        proxy: {
            '/mobile/*': {
                target: 'http://127.0.0.1:3000',
                changeOrigin: true,
                secure: false
            }
        }
    },

    entry: { "index": path.resolve(__dirname, 'src/index') },

    output: {
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
        path: path.join(__dirname, '/dist'),
        publicPath: '/dist/'
    },
    resolve: {
        alias: {
            src: path.join(__dirname, '../src/')
        },
        modules: [path.resolve(__dirname, 'node_modules'), path.join(__dirname, 'src')],
        extensions: ['.web.js', '.jsx', '.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.jsx$|\.js$/, exclude: /node_modules/, loader: 'babel-loader',
                options: {
                    plugins: [
                        'external-helpers', // why not work?
                        ["transform-runtime", { polyfill: false }],
                        ["transform-decorators-legacy"],
                        ["import", [{ "style": "css", "libraryName": "antd-mobile" }]]
                    ],
                    presets: [['es2015', { modules: false }], 'stage-0', 'react'] // tree-shaking
                }
            },
            { test: /\.(jpg|png)$/, loader: "url-loader?limit=8192" },
            {
                test: /\.less$/i, use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader?sourceMap&modules=true&localIdentName=[local]_[hash:base64:5]', { loader: 'postcss-loader', options: postcssOpts }, 'less-loader'
                    ]
                })
            },
            {
                test: /\.css$/i, use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader', { loader: 'postcss-loader', options: postcssOpts }
                    ]
                })
            }
        ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'shared',
            filename: 'shared.js'
        }),
        new ExtractTextPlugin({ filename: '[name].css', allChunks: true })
    ]
}
