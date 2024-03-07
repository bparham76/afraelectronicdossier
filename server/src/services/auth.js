// const prisma = require('../utils/prisma');

const SayHello = async (req, res) => {
	res.json({ msg: 'hello from some service' });
};

const SayBye = async (req, res) => {
	res.json({ msg: 'Bye bye from some another service' });
};

module.exports = { SayHello, SayBye };
