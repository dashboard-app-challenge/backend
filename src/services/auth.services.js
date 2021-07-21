const authRepos = require("../repos/auth.repo");

/**
 * user signup ops
 * @param {create user req dto} req 
 */
exports.signup = async (req) => {
  const userObj = await authRepos.findExistUser(req);
  const newToken = await authRepos.signup(userObj);
  return newToken;
};

/**
 * user login ops
 * @param {login req dto} req 
 */
exports.login = async (req) => {
  const notLoggedin = await authRepos.alreadyLoggedin(req);
  const loginReqDto = req.body;
  const dbUser = await authRepos.findUserForLogin(loginReqDto);
  
  const userReq = {
    dbUser,
    loginUser: loginReqDto
  };
  const matched = await authRepos.compareEnteredPass(userReq);
  const user = await authRepos.finalizeUserLogin(dbUser);
  return user;
}
