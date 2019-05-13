const { tokenSecret } = require('../env');
const { jwtVerify } = require('../utils/common');

module.exports = async (req, res, next) => {
	const { vf } = req.headers;
	if(!vf) {
		res.status(401).send({code: 0, msg: '缺少token!', data: null});
		return;
	}
	const info = await jwtVerify(vf, tokenSecret);
	if(info.code === 1) {
		req.userId = info.data.data;
	} else {
		res.send({code: 0, msg: info.msg, data: null});
		return;
	}
	await next();
};