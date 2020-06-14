//format of verifyToken
//authorization: bearer <access token>

//verify token

exports.verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  //check if bearer is undefined
  if (typeof bearerHeader != 'undefined') {
    // split at the space
    const bearer = bearerHeader.split(' ');
    //get token frorm array
    const bearerToken = bearer[1];
    //set the bearerToken
    req.token = bearerToken;
    //next middleware
    next();
  } else {
    res.send(403).json ({ 'status': 'unauthorized user verify' });
  }
};
