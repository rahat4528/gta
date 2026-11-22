import 'dotenv/config';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initSocketServer } from './server/socket/index';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3003', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Attach real-time Socket.IO server to the same HTTP server
  initSocketServer(server);

  server.listen(port, () => {
    console.log(`> Real-Time Crew Chat ready on http://${hostname}:${port}`);
    console.log(`> Socket.IO WebSocket endpoint mounted on ws://${hostname}:${port}`);
  });
});
