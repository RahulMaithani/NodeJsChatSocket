const User = require('../models/UserModel')

exports.getUsers = async (req, res) => {
  console.log('Users api call', req.body);
  let phoneNumber = req.query.phoneNumber;
  try{
    const users = await User.find({"phoneNumber" : {$ne : phoneNumber}}).select("_id name phoneNumber imageString")
    .then((users) => {
      res.status(200).send(users);
    })
  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
};

exports.createUser = async (req, res) => {

  console.log('User Request Body:::: ', req.body);

  try{
    var request = new User(req.body);
    console.log('request mapper:::: ', request);

    var savedUser = await User.findOne({phoneNumber: request.phoneNumber}, async function(err, user) {
    if(!err) {
        if(!user) {
          console.log('not have user:::: ', req.body);
            user = request
        }
        user.name = request.name;
        user.phoneNumber = request.phoneNumber
        var savedMessage = await user.save().then(result => {
            res.status(200).json({
              user: result
            });
          });
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
    console.log('Response', res.body)
  }

};
