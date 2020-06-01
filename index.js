var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

//call from client side
app.get('/', (req, res) => {
  res.sendFile(__dirname +'/index.html');
});

//socket connections
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.broadcast.emit('hi');

  socket.on('chat message', (msg) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' })// This will emit the event to all connected sockets



//server connection
http.listen(3000, () => {
  console.log('Server is running on 3000');
});
