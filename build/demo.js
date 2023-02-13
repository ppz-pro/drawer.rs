const config = require('./')

module.exports = {
  mode: 'development',
  devServer: {
    static: './demo'
  },
  ...config
}
