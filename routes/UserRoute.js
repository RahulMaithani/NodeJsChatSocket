module.exports = function(app) {

  var userController = require('../controllers/UserController');
  var http = require('http').Server(app);
  var io = require('../config/socket').listen(http);
  var auth = require('../config/Auth');
  var jwt = require('jsonwebtoken');
  
  app.get('/users', auth.verifyToken,(req, res) => {
    console.log('get users call :::', req.body);
    jwt.verify(req.token, 'yehhainodejs', (error, authData)=> {
      if (error) {
        res.send(403).json ({ 'status': 'unauthorized user' });
      } else {
        userController.getUsers(req, res, authData.user.phoneNumber);
      }
    });
  });

  app.post('/user/login', (req, res) => {
    console.log('login or sign up user :::', req.body);
    userController.createUser(req, res);
  });

}
