const Message = require('../models/MessageModel')

exports.getMessages = async (req, res) => {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(fullUrl);
  var id = req.params.id; // $_GET["id"]
  try {
    Message.find({chatId: id},(err, messages)=> {
      res.send(messages);
    })

  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
};

exports.getUserMessages = (req, res) => {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(fullUrl);
  var user = req.params.user
  Message.find({name: user},(err, messages)=> {
    res.send(messages);
  })
};

exports.createMessage = async (req, res) => {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(fullUrl);

  try{
    var message = new Message(req.body);

    var savedMessage = await message.save()
      console.log('Message Saved.');

    var censored = await Message.findOne({message:'badword'});
      if(censored)
        await Message.remove({_id: censored.id})
      else
        io.emit('message', req.body);
      res.sendStatus(200);
  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
  finally{
    console.log('Message Posted')
  }

};

exports.markReceived = async (req, res, io) => {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(fullUrl);
  try {
    const chatId = req.body.chatId
    const senderId = req.body.senderId
    const condition = { $and :[{'chatId' : chatId}, { 'status': { $ne: 'read' }}, { 'senderId': { $ne: senderId }}] }
    console.log('condition:::', condition);

    const posts = await Message.updateMany(condition, { status: "received" }, { multi: true })
    .then((users) => {
      console.log({"chatId":chatId,"status":"received"});
      io.sockets.emit('markReceived', {"chatId":req.body.chatId,"deliveryStatus":"received"});
      res.sendStatus(200);
    });
 }
 catch (error){
   res.sendStatus(500);
   return console.log('error',error);
 }
};

exports.markRead = async (req, res, io) => {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(fullUrl);
  try {
    const chatId = req.body.chatId
    const condition = { 'chatId': chatId };

    const posts = await Message.updateMany(condition, { status: "read" }, { multi: true })
    .then((users) => {
      console.log( {"chatId":req.body.chatId, "deliveryStatus":"read"});
      io.sockets.emit('markReceived', {"chatId":req.body.chatId, "deliveryStatus":"read"});
      res.sendStatus(200);
    });
 }
 catch (error){
   res.sendStatus(500);
   return console.log('error',error);
 }
};
