const User = require('../models/UserModel')
const Chat = require('../models/ChatModel')
var jwt = require('jsonwebtoken');

exports.createUser =  (req, res) => {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(fullUrl);
  console.log('request mapper::: ', req.body);

  try{
    var request = new User(req.body);

    var savedUser =  User.findOne({phoneNumber: request.phoneNumber}, async function(err, user) {
      if(!err) {
          if(!user) {
            console.log('not have user:::: ', req.body);
              user = request
          }
          user.name = request.name;
          user.phoneNumber = request.phoneNumber
          user.imageString = request.imageString
          
          try {
            var savedMessage =  await user.save().then((result) => {
              jwt.sign({user: user}, 'yehhainodejs', (error, token) => {
                result.authorizationToken = token
                res.status(200).json({
                  user: result
                });
              });
            });
          }
          catch (error){
            res.sendStatus(500);
            return console.log('error',error);
          }
      } else {
          res.sendStatus(500);
          return console.log('error db not',error);
        }
      });

  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }

  finally{
    console.log('Response')
  }

};


exports.getUsers = async (req, res, phoneNumber) => {
  console.log('Users api call', phoneNumber);
  var filteredUsers = [];
  try{
    const users = await User.find({"phoneNumber" : {$ne : phoneNumber}})
    let items = users.map( async (item) => {
     const condition =
         { $or : [ { 'phoneNumber1' : phoneNumber, 'phoneNumber2': item.phoneNumber }, { 'phoneNumber1' : item.phoneNumber, 'phoneNumber2':  phoneNumber } ] };
     let chat = await Chat.findOne(condition).select("_id")
     if (chat) {
       item.chatId =  chat._id;
     }
     return item;
   });
   Promise.all(items).then(function (filteredUsers) {
     res.status(200).send(filteredUsers);
        //do something with the finalized list of albums here
    });
  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
};
