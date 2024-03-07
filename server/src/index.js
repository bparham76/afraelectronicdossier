const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
	res.json({ msg: 'hello' });
});

const server = app.listen(4000, () =>
	console.log(`
🚀 Server ready at: http://localhost:4000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
