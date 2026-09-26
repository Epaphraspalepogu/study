import http from 'node:http';

export default function apiProxyPlugin(target = 'http://localhost:3001') {
  return {
    name: 'api-proxy',

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const targetUrl = new URL(req.url, target);

        const proxyReq = http.request(
          targetUrl,
          {
            method: req.method,
            headers: {
              ...req.headers,
              host: targetUrl.host,
            },
          },
          (proxyRes) => {
            res.writeHead(
              proxyRes.statusCode || 502,
              proxyRes.headers
            );

            proxyRes.pipe(res);
          }
        );

        proxyReq.on('error', (error) => {
          console.error('[API Proxy] Error:', error.message);

          if (!res.headersSent) {
            res.writeHead(502, {
              'Content-Type': 'application/json',
            });

            res.end(
              JSON.stringify({
                error:
                  'Unable to connect to the backend server.',
              })
            );
          }
        });

        req.pipe(proxyReq);
      });
    },
  };
}