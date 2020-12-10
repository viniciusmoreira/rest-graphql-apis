const jwt = require('jsonwebtoken');

/**
 * Check if user allowed to use route
 */
const checkUserAuth = async (req, res, next) => {
  if(req.headers && req.headers.authorization){
    const [,token] = req.headers.authorization.split(' ');
    try {
      const payload = jwt.verify(token, process.env.SERVER_SECRET);
      res.locals.user = payload.user;

      return next();
    } catch(error) {
      res.json({
        success: false,
        message: 'Invalid token!'
      })
    }
  }

  res.json({
    success: false,
    message: 'User not allowed, please login!'
  })
}

module.exports = {
  checkUserAuth
}