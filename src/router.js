const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.post('/mail', controller.postMail);

module.exports = router;
