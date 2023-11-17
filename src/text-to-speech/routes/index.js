const express = require('express');
const transcriptController = require('../controllers/index');

const router = express.Router();

router.post('/transcriptText', transcriptController.transcriptText)

module.exports = router;
