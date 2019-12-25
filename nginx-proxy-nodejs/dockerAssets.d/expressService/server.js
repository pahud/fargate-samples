'use strict';

const express = require('express');
const morgan = require('morgan');
const process = require('process');

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




