var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
const User = require('./models/UserModel')
const Message = require('./models/MessageModel')

app.use(express.static(__dirname));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mbs", extended: true, parameterLimit:50000}));

require('./routes/UserRoute.js')(app);
require('./routes/MessageRoute.js')(app);

var dbUrl = 'mongodb+srv://rahul2:test123@cluster0-81syp.mongodb.net/test?retryWrites=true&w=majority'

// socket connection
io.on('connection', (socket) => {
  console.log('a user is connected')
  socket.on('message', async (data) => {
    console.log('message:: ', data)

    try{
      var message = new Message(data);

      var savedMessage = await message.save()
        console.log('saved');

      var censored = await Message.findOne({message:'badword'});
        if(censored)
          await Message.remove({_id: censored.id})
        else
          io.emit('message', savedMessage);
    }
    catch (error){
      return console.log('error',error);
    }
    finally{
      console.log('Message Posted')
    }
  });
  socket.on('disconnect', () => {
    console.log('a user is disconnected')
   });
});

// database connection
mongoose.connect(dbUrl,{useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true } ,(err) => {
  console.log('mongodb connected',err);
})

//server connection
var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});
