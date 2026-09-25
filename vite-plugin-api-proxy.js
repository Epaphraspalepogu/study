import http from 'node:http';

// Keep the API key server-side while proxying /api calls during dev.
export default function apiProxyPlugin(target = 'http://localhost:3001') {
  return {
    name: 'api-proxy',
    configureServer(server) {
      server.middlewares.use('/api', (req, res) => {
        const proxyReq = http.request(
          target + '/api' + req.url,
          {
            method: req.method,
            headers: { ...req.headers, host: new URL(target).host },
          },
          (proxyRes) => {
            res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
            proxyRes.pipe(res);
          }
        );
        proxyReq.on('error', () => {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Something went wrong while generating your study session.' }));
        });
        req.pipe(proxyReq);
      });
    },
  };
}
