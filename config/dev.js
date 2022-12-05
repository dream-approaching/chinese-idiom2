module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    devServer: {
      hot: false,
      proxy: {
        '/cidian-api/': {
          target: "http://localhost:7001/",
          changeOrigin: true
        }
      },
    }
  }
}
