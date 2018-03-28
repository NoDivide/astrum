const webpack = require('webpack');
const path = require('path');

module.exports = (env, argv) => {

    return {
        entry: {
            'main': './_template/app/js/main.js'
        },
        output: {
            path: path.resolve(__dirname, '_template/app/js'),
            filename: '[name].bundle.js',
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js' // Use the full build
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: `"${argv.mode}"`
                }
            })
        ],
        node: {
            fs: "empty"
        },
        devServer: {
            port: 9000,
            contentBase: [
                path.join(__dirname, "_template"),
                path.join(__dirname, "_template/app")
            ],
            compress: true // enable gzip compression
            // ...
        }
    }
};