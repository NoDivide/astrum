const webpack = require('webpack');

module.exports = {
    entry: './_template/app/js/main.js',
    output: {
        path: './_template/app/js',
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