var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const configs = require("../../configs");
const config = configs.get(process.env.NODE_ENV);
const salt = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 150,
  },
  username: {
    type: String,
    required: true,
    maxlength: 15,
    unique: true,
  },
  pass: {
    type: String,
    required: true,
    maxlength: 60,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    maxlength: 60,
    unique: true,
  },
  roles: [String],
  dateCreated: {
    type: Date,
    required: true,
    default: new Date(),
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  token: String,
  data: String,
});

/** convert password to hash */
userSchema.pre("save", function (next) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), config.SECRET);
  user.token = token;

  if (user.isModified("pass")) {
    bcrypt.genSalt(salt, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.pass, salt, (err, hash) => {
        if (err) return next(err);
        user.pass = hash;
        next();
      });
    });
  } else {
    next();
  }
});

/** compare login pass and db pass */
userSchema.methods.comparepassword = async (passes) => {
  const isMatch = await bcrypt.compare(passes.loginPass, passes.dbPass);
  return isMatch;
};

/** generate user token */
userSchema.methods.generateToken = async function () {
  var user = this;
  const hex = user._id.toHexString();
  var token = jwt.sign({ hex }, config.SECRET, {
    expiresIn: "6h",
  });

  user.token = token;
  const dbUser = await user.save();
  return dbUser;
};

/** find a particular logged in token in db */
userSchema.statics.findByToken = async function (req) {
  const token = req.cookies.auth;
  console.log(`token: ${token}`);
  if (!token) {
    return null;
  }
  var user = this;

  const decode = await jwt.verify(token, config.SECRET);
  const dbUser = await user.findOne({
    _id: decode,
    token: token,
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  return dbUser;
};

/** delete token on user logout */
userSchema.methods.deleteToken = function (token, cb) {
  var user = this;

  user.updateOne({ $unset: { token: 1 } }, function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

module.exports = mongoose.model("User", userSchema);
