const path = require('path');

module.exports = {
    mode: "development",
    entry: {
        "csv-box": "./src/index.js",
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: "cbox"
    },

    devtool: "source-map",
};