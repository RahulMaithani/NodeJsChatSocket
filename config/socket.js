// sockets.js

const chatController = require('../controllers/ChatController')
const User = require('../models/UserModel')
const Message = require('../models/MessageModel')
var ObjectId = require('mongoose').Types.ObjectId;

module.exports.listen = function(io){

    // io = socketio.listen(app)

    io.on('connection', (socket) => {
      console.log('A user connected, Socket %id', socket.id);

      socket.on('message', async (data) => {
        console.log('message:::: ', data);
        try{
          var message = new Message(data);

          var savedMessage = await message.save()
            console.log('saved');

          var censored = await Message.findOne({message:'badword'});
            if(censored)
              await Message.remove({_id: censored.id})
            else {
              console.log('emitting message');
              // app.io.emit('message', savedMessage);
              io.sockets.in(message.senderId).emit('message', savedMessage);
              io.sockets.in(message.receiverId).emit('message', savedMessage);
            }
        }
        catch (error){
          return console.log('error',error);
        }
        finally{
          console.log('Message Posted')
        }
      });

      socket.on('joinRoom', async function (room) {
        console.log('User joined room: ', room.userId);
        socket.join(room.userId);
        socket.id = room.userId;
        // updating user online status
        try {
          const condition = { '_id': room.userId };
          const posts = await User.updateOne(condition, { isOnline: true })
          .then((users) => {
            io.sockets.emit('onlineStatus', {"userId":room.userId,"isOnline":true});
          });
       }
       catch (error){
         console.log('error',error);
       }
      })

      socket.on('createChatId', function (request) {

        chatController.createChatId(request, function(chat){
          console.log('created chat id: ', chat);
          io.sockets.in(request.userId1).emit('createChatId', chat);
          io.sockets.in(request.userId2).emit('createChatId', chat);
        })
      })

      socket.on('typing', function(user) {
          console.log('typing::::', user);
          io.sockets.in(user.receiverId).emit('typing', { "status": "typing", "isTyping": user.isTyping, "receiverId": user.receiverId });
        });


      socket.on('disconnect', async () => {
        var connectionMessage = socket.id + " Disconnected from Socket ";
        console.log(connectionMessage)
        // updating user online status
        try {
          const condition = { '_id': socket.id };

          const posts = await User.updateOne(condition, { isOnline: false })
          .then((users) => {
            io.sockets.emit('onlineStatus', {"userId":socket.id,"isOnline":true});
          });
       }
       catch (error){
         console.log('error',error);
       }
       });
    });


    // return io
}
