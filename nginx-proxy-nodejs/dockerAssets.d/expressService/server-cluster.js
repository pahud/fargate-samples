'use strict';

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');
const morgan = require('morgan');
const process = require('process');


if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  console.log(`numCPUs=${numCPUs}`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  const HOST = '0.0.0.0';
  const app = express();
  app.use(morgan('combined'));
  app.get('/', (req, res) => {
    res.send(`Pid ${process.pid}\n`);
  });
  app.set('port', process.env.PORT || 3000);
  const PORT = app.get('port');
  app.listen(PORT, HOST);
  console.log(`Worker ${process.pid} started. Running on http://${HOST}:${PORT}`);

}



