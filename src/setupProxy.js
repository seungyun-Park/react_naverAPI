// setupProxy.js

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://naveropenapi.apigw.ntruss.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
      onProxyReq: function(proxyReq, req, res) {
        proxyReq.setHeader('X-NCP-APIGW-API-KEY-ID', process.env.MY_CLIENT_ID);
        proxyReq.setHeader('X-NCP-APIGW-API-KEY', process.env.REACT_APP_NAVER_CLIENT_SECRET);
      },
    })
  );
};