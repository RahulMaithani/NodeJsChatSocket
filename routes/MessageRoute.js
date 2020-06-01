module.exports = function(app) {

  var messageController = require('../controllers/MessageController');
  app.get("/messages/:user", messageController.getUserMessages)
  app.get("/messages", messageController.getMessages)
  app.post("/messages", messageController.createMessage)
  app.put("/messages/received", messageController.markReceived)
}
