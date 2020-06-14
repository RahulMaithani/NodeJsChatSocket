
const Chat = require('../models/ChatModel')

exports.createChatId = async (object, callback) => {
  console.log('chat controller called');

  try{
    var request = new Chat(object);
    var condition = { $or : [ { $and :[{'phoneNumber1' : object.phoneNumber1}, {'phoneNumber2': object.phoneNumber2 }] },
                              { $and: [{ 'phoneNumber1' : object.phoneNumber2}, {'phoneNumber2':  object.phoneNumber1 }] }
                            ] };

    var savedUser = await Chat.findOne(condition, async function(err, chat) {
    if(!err) {
        if(!chat) {
          console.log('creating chatId :::: ', request);
            var savedMessage = await request.save().then(result => {
              return callback(chat);
            });
        } else {
          console.log('Already have chat id', chat._id);
          return callback(chat);
        }

        } else {
          return console.log('error db not',error);
        }
    });

  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
};
