module.exports = Object.freeze({
  msgs: {
    DB_CONNECT: "database is connected",
    APP_CONNECT: "Welcome to backend of dashboard-app",
    SERVER_CONNECT: "server started on port",
  },
  errs: {
    DB_NOT_CONNECT: "db is not connected =>",
    USER_EXIST: "username or email or both already exist in db",
    PERMISSION_EXIST: "permission already exist in db",
    ROLE_EXIST: "Role code already exist in db",
    ALREADY_LOGGEDIN: "You are already logged in",
    USER_DEACTIVATE: "user has been deactivated",
    USER_NOT_FOUND: "Auth failed ,user not found",
    PASS_NOT_MATCH: "password doesn't match",
  },
});
