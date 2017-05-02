var webpack = require('webpack')

module.exports = {
    entry: "./xrx.api.drawing.js",
    devtool: 'source-map',
    output: {
        path: __dirname + "/dist",
        filename: "xrx.js",
        library: "xrx",
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
        ],
    }
}
