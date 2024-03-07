const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', require('./routes/auth'));

app.get('/', (req, res) => {
	res.json({ msg: 'hello' });
});

const server = app.listen(4000, () => console.log('server running... .'));
