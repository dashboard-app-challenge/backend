const authServices = require("../services/auth.services");

exports.signup = async function (req, res) {
  try {
    let newToken = await authServices.signup(req.body);
    res.status(200).json({
      success: true,
      token: newToken,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      errMsg: err,
    });
  }
};

exports.login = async function (req, res) {
  try {
    const user = await authServices.login(req);
    const options = {
      maxAge: 1000 * 60 * 60 * 6, // would expire after 6 hours
      // httpOnly: true, // The cookie only accessible by the web server
    };
    res.cookie("auth", user.token, options).status(200).json({
      success: true,
      name: user.name,
      apiKey: user.token
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      errMsg: err,
    });
  }
};
