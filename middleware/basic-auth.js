const auth = require('basic-auth');
const { User } = require('../models');
const bcrypt = require('bcrypt');

exports.authenticateUser = async (req, res, next) => {
  let message;
  const credentials = auth(req);
  if (credentials) {
    const user = await User.findOne({
      where: { emailAddress: credentials.name },
    });
    if (user) {
      const authenticated = bcrypt.compareSync(
        credentials.pass,
        //to modify check User model
        user.password
      );
      if (authenticated) {
        console.log('User Authentication successful');
        req.loggedUser = user;
      } else {
        message = [`Can't Authenticate the user: ${user.username}`];
      }
    } else {
      message = [`the user ${credentials.name} doesnt exist`];
    }
  } else {
    message = [`No Auth Header found`];
  }

  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};
