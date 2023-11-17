const express = require('express');
const transcriptController = require('../controllers/index');

const router = express.Router();

router.post('/transcriptAudio', transcriptController.transcriptAudio);

module.exports = router;
