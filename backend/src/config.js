process.env.TZ = 'Asia/Bangkok';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
	PORT: process.env.PORT,
	ADMIN: process.env.ADMIN,
	HCAPTCHA_SECRET: process.env.HCAPTCHA_SECRET,
	SECRET_MD5: process.env.SECRET_MD5,
};
