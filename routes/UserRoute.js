module.exports = function(app) {

  var userController = require('../controllers/UserController');
  app.get("/users", userController.getUsers)
  app.post("/user", userController.createUser)
}
