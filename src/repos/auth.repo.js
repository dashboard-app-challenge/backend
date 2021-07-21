const enums = require("../enums");
const User = require("../models/schemas/user.schema");

/**
 * find duplicated username or email
 * @param {user entity} req
 */
exports.findExistUser = async (req) => {
  const user = new User(req);

  const response = await User.findOne({
    $or: [{ username: user.username }, { email: user.email }],
  });

  if (response) {
    throw enums.errs.USER_EXIST;
  }

  return user;
};

/**
 * find user for login purpose
 * @param {login req dto} loginReqDto
 */
exports.findUserForLogin = async (loginReqDto) => {
  const response = await User.findOne({
    $or: [{ username: loginReqDto.username }, { email: loginReqDto.email }],
  });

  if (!response) {
    throw enums.errs.USER_NOT_FOUND;
  } else if (!response.active) {
    throw enums.errs.USER_DEACTIVATE;
  }

  return response;
};

/**
 * user signup
 * @param {new user full entity} req
 */
exports.signup = async (req) => {
  const response = await req.save();
  return response.token;
};

/**
 * find current logging in
 * @param {user req} http req
 */
exports.alreadyLoggedin = async (req) => {
  const response = await User.findByToken(req);
  if (response) {
    throw enums.errs.ALREADY_LOGGEDIN;
  }
  return true;
};

/**
 * compare entered pass with existing pass in db
 * @param {login user entity & db user entity} req
 */
exports.compareEnteredPass = async (req) => {
  const passes = {
    loginPass: req.loginUser.pass,
    dbPass: req.dbUser.pass
  };
  const response = await req.dbUser.comparepassword(passes);

  if (!response) {
    throw enums.errs.PASS_NOT_MATCH;
  }

  return response;
};

/**
 * generate user token
 * @param {user schema} user
 */
exports.finalizeUserLogin = async (user) => {
  const response = await user.generateToken();
  return response;
};
