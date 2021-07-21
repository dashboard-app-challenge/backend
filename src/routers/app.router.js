var express = require("express");
var enums = require("../enums");

var router = express.Router();

// Home page route.
router.get("/", (req, res) => res.status(200).send(enums.msgs.APP_CONNECT));

module.exports = router;