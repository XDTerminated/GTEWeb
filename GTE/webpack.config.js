const path = require('path');

module.exports = {
    mode: 'development',
    entry: './static/js/script.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'static/dist'),
        library: 'lib',   // add this!
    },
    module: {
        rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
            },
            },
        },
        ],
    },
};
