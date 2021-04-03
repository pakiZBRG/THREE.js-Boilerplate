const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const ip = require('internal-ip');
const portFinderSync = require('portfinder-sync');

const infoColor = _message => {
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`
}

module.exports = merge(common, {
    mode: "development",
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "../", "build")
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                     "sass-loader"
                ]
            }
        ]
    },
    devServer: {
            host: '0.0.0.0',
            port: portFinderSync.getPort(8080),
            contentBase: '../build',
            watchContentBase: true,
            open: true,
            https: false,
            useLocalIp: true,
            disableHostCheck: true,
            overlay: true,
            noInfo: true,
            after: (app, server, compiler) => {
                const port = server.options.port
                const https = server.options.https ? 's' : ''
                const localIp = ip.v4.sync()
                const domain1 = `http${https}://${localIp}:${port}`
                const domain2 = `http${https}://localhost:${port}`
                
                console.log(`Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(domain2)}`)
            }
        }
});