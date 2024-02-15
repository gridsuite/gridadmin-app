const { createProxyMiddleware } = require('http-proxy-middleware');
const GATEWAY_URL = 'http://localhost:9000';
module.exports = function (app) {
    app.use(
        createProxyMiddleware(process.env.REACT_APP_API_GATEWAY, {
            target: GATEWAY_URL,
            pathRewrite: { [`^${process.env.REACT_APP_API_GATEWAY}/`]: '/' },
        })
    );
    app.use(
        createProxyMiddleware(process.env.REACT_APP_WS_GATEWAY, {
            target: GATEWAY_URL,
            pathRewrite: { [`^${process.env.REACT_APP_WS_GATEWAY}/`]: '/' },
            ws: true,
        })
    );
};
