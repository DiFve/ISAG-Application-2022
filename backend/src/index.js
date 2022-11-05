const express = require('express');
const cors = require('cors');
const { PORT } = require('./config');

const app = express();
app.use(express.json({ limit: '100kb' }));

app.use(cors());

// router injection
require('./routes')(app);

// Error Handling
app.use((err, req, res, next) => {
	err.statusCode = err.statusCode || 404;
	err.status = err.status || 'Not Found!';

	res.status(err.statusCode).send({
		status: err.status,
		message: err.cusMessage || 'Unknown Error',
		code: err.code || 0,
	});
});

app.listen(PORT, () => {
	console.log(`Server is listing on port ${PORT}`);
});
