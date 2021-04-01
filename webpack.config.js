module.exports = {
    entry: {
      index: __dirname + "/src/index.js",
    },
    output: {
      path: __dirname + "/dist",//打包后的文件存放的地方
      filename: "[name].js", //打包后输出文件的文件名
      chunkFilename: '[name].js',
    },
    mode: 'development',
    devtool: false,
  
    devServer: {
      contentBase: "./dist",//本地服务器所加载的页面所在的目录
      historyApiFallback: true,//不跳转
      inline: true//实时刷新
    },
  }
  