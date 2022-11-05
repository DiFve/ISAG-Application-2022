const { ADMIN } = require('./config');

module.exports = {
	isAdmin: (req, res, next) => {
		const { authorization } = req.headers;
		if (authorization === ADMIN) {
			return next();
		} else {
			return res.status(401).send({ message: 'Forbidden.' });
		}
	},
};
