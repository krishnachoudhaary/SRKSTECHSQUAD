const app = require('./app');
const { initDatabase } = require('./config/db');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5001;

const listenOnPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 EventHub Server Running on Port ${port}`);
      console.log(`🌐 Web App & API URL: http://localhost:${port}`);
      console.log(`📡 Health Check: http://localhost:${port}/api/health`);
      console.log(`======================================================\n`);
      resolve(server);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        reject(err);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
  });
};

const startServer = async () => {
  try {
    // Initialize Database
    await initDatabase();

    const candidatePorts = [DEFAULT_PORT, 5002, 8080, 3001];
    for (const port of candidatePorts) {
      try {
        await listenOnPort(port);
        return;
      } catch (err) {
        if (err.code === 'EADDRINUSE') {
          console.warn(`[EventHub] Port ${port} is currently in use. Trying port fallback...`);
        } else {
          throw err;
        }
      }
    }
  } catch (error) {
    console.error('Failed to start EventHub server:', error);
    process.exit(1);
  }
};

startServer();
