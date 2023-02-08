const path = require('path')

module.exports = {
  mode: 'development',
  devServer: {
    static: './demo'
  },
  entry: './demo/app.js',
  output: {
    filename: 'app.dist.js',
    path: path.resolve(__dirname, '../demo')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "swc-loader"
        }
      }
    ]
  }
}
