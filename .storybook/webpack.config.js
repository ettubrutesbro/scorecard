const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            },
          },
        ],
      },
      {
           test: /\.(png|jpg|gif|svg)$/,
           use: [ 'file-loader' ]
        }
    ],
  },
}