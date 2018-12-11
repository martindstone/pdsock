'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const SECRET = process.env.SECRET || 'secret';

const app = express();

app.use(bodyParser.json({type: "*/*"}));

var server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(server);

app.get('/', (req, res) => res.sendFile(INDEX));

app.post('/webhook', (req, res) => {
	console.log(req.body);
	io.emit('response', req.body);
	res.end();
});

io.on('connection', (socket) => {
  console.log(socket.handshake.query.secret);
  if ( socket.handshake.query.secret != SECRET ) {
  	console.log("Incorrect secret, connection refused");
  	socket.disconnect('incorrect secret');
  	return;
  }
  socket.on('disconnect', () => console.log('Client disconnected'));
  console.log('Client connected');
});
