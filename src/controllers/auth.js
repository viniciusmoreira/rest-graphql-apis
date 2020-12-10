const jwt = require('jsonwebtoken');

const USER = {
  'usuario1': '1234'
}

const login = async (req, res) => {
  const { user, passwd } = req.body;
  
  if(USER[user] && USER[user] === passwd){
    const token = jwt.sign({
      user
    }, process.env.SERVER_SECRET)
  
    return res.json({
      success: true,
      token
    })
  }

  res.json({
    success: false,
    message: 'Invalid user or password!'
  })
}



module.exports = {
  login
}