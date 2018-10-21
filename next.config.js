
const path = require('path')

const withSass = require('@zeit/next-sass')
const StyleLintPlugin = require('stylelint-webpack-plugin')

module.exports = withSass({
  cssModules: true,
  webpack (config, { isDev, isClient }) {
    // if development then add styling middleware to webpack
    if (isDev && isClient) {
      config.plugins.push(new StyleLintPlugin({
        files: ['**/*.scss']
      }))

      config.module.rules.push({
        enforce: 'pre',
        test: /\.(js)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules)/
      })
    }

    // set the module paths for resolving file modules
    config.resolve.modules = [
      './components',
      './styles',
      './node_modules'
    ].map((relativePath) => path.resolve(relativePath))

    return config
  }
})
