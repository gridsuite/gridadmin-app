const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        createProxyMiddleware('http://localhost:9000/api/gateway', {
            pathRewrite: { [`^${process.env.REACT_APP_API_GATEWAY}`]: '/' },
        })
    );
    app.use(
        createProxyMiddleware('http://localhost:9000/ws/gateway', {
            pathRewrite: { [`^${process.env.REACT_APP_WS_GATEWAY}`]: '/' },
            ws: true,
        })
    );
};
