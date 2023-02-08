const path = require('path')

module.exports = {
  mode: 'development',
  devServer: {
    static: './dev'
  },
  entry: './dev/app.js',
  output: {
    filename: 'app.dist.js',
    path: path.resolve(__dirname, '../dev')
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
