const { SayBye, SayHello } = require('../services/auth');

const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
	res.json({ msg: 'test auth route' });
});

router.get('/hi', SayHello);

router.get('/bye', SayBye);

module.exports = router;
