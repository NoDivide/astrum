const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './_template/app/js/main.js',
    output: {
        path: path.resolve(__dirname, '_template/app/js'),
        filename: 'main.min.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        })
    ],
    node: {
        fs: "empty"
    }
};