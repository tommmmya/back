var express = require('express');
var router = express.Router();
const botRequest = require('../utils/botRequest');

/* GET home page. */
router.get('/', async function (req, res, next) {
  await botRequest(1, req, res)
});

module.exports = router;
