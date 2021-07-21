const config = {
  production: {
    SECRET: process.env.SECRET,
    DATABASE: process.env.MONGODB_URI,
  },
  default: {
    SECRET: "secretkey",
    DATABASE:
      "mongodb+srv://admin:sixunderground2019@dashboard-db.vf1fi.mongodb.net/dashboard-db?retryWrites=true&w=majority",
  },
};

exports.get = function get(env) {
  return config[env] || config.default;
};
