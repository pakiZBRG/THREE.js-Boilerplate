const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./src/three.js",
    output: {
        assetModuleFilename: "images/[hash].[ext]"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template.html'
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