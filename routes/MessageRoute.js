module.exports = function(app, io) {

  var messageController = require('../controllers/MessageController');
  var auth = require('../config/Auth');
  var jwt = require('jsonwebtoken');

  app.get('/messages/:id', auth.verifyToken,(req, res) => {
    jwt.verify(req.token, 'yehhainodejs', (error, authData)=> {
      if (error) {
        res.send(403).json ({ 'status': 'unauthorized user' });
      } else {
        messageController.getMessages(req, res);
      }
    });
  });

  app.post('/messages', auth.verifyToken,(req, res) => {
    jwt.verify(req.token, 'yehhainodejs', (error, authData)=> {
      if (error) {
        res.send(403).json ({ 'status': 'unauthorized user' });
      } else {
        messageController.createMessage(req, res);
      }
    });
  });

  app.put('/messages/received', auth.verifyToken, (req, res) => {
    console.log('mark received:::', req.body);
    jwt.verify(req.token, 'yehhainodejs', (error, authData)=> {
      if (error) {
        res.send(403).json ({ 'status': 'unauthorized user' });
      } else {
        messageController.markReceived(req, res, io)
      }
    });
  });

  app.put('/messages/read',auth.verifyToken,  (req, res) => {
    console.log('mark read:::', req.body);
    jwt.verify(req.token, 'yehhainodejs', (error, authData)=> {
      if (error) {
        res.send(403).json ({ 'status': 'unauthorized user' });
      } else {
        messageController.markRead(req, res, io)
      }
    });
  });

}
