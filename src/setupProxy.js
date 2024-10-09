const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    // Configura el proxy para cualquier ruta que comience con '/api' en desarrollo local
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://ws.synchroteam.com', // URL objetivo al que se redirigirán las solicitudes
            changeOrigin: true, // Cambia el origen de las solicitudes para coincidir con el dominio del destino
            pathRewrite: {
                // Reescribe las rutas de la API. Reemplaza '/api' por '/v3' en las solicitudes
                '^/api': '/v3',
            },
        })
    );
};
