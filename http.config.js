module.exports = {
    devServer: {
       host: "localhost",
       port: 8088, // 端口号
       https: false, // https:{type:Boolean}
       open: true, //配置自动启动浏览器
      //  proxy: 'http://192.168.75.133:9091/psys-master-service/' // 配置跨域处理,只有一个代理
      proxy: { //多个代理
        '/api': {
          target: 'http://api.portzj.com',   //正式地址
          changeOrigin: true,
          pathRewrite: {
            '^/api': '/'    //代理的路径
          }
        },
       "/foo": {
          target: "http://api-dev.portzj.com",// 测试地址
          ws: true,
          changeOrigin: true,
          pathRewrite: {
          '^/foo': '/'
      }
      },
      }
    }
}