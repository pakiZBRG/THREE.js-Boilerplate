const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: "./src/js/three_raycaster.js",
    output: {
        assetModuleFilename: "images/[hash].[ext]"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../static') }
            ]
        })
    ],
    module: {   
        rules: [
            {
                // instead of src use import for images
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.(svg|png|jpe?g|gif)$/,
                type: "asset/resource"
            }
        ]
    }
} 