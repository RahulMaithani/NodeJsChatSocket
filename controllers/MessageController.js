const Message = require('../models/MessageModel')

exports.getMessages = async (req, res) => {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(fullUrl);
  let senderId = req.query.senderId;
  let receiverId = req.query.receiverId;
  try {
    Message.find({$or:[ {'senderId':senderId}, {'senderId':receiverId}, {'receiverId':receiverId} ]},(err, messages)=> {
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

exports.markReceived = async (req, res) => {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(fullUrl);
  try {
    const receiverId = req.body.receiverId
    const senderId = req.body.senderId
    const condition = { $or:[ { senderId: senderId }, { receiverId: receiverId }] };

    const posts = await Message.updateMany(condition, { status: "received" }, { multi: true })
    .then((users) => {
      io.emit('message', {"senderId":senderId,"receiverId":receiverId,"status":"received"});
      res.sendStatus(200);
    });
 }
 catch (error){
   res.sendStatus(500);
   return console.log('error',error);
 }
};
