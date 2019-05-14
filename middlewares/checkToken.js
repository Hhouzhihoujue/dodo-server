const { tokenSecret, redisKey: { loginInfoKey } } = require('../env');
const { jwtVerify } = require('../utils/common');
const redis = require('../config/redis');

module.exports = async (req, res, next) => {
	const { vf } = req.headers;
	if(!vf) {
		res.status(401).send({code: 0, msg: '缺少token!', data: null});
		return;
	}
	const info = jwtVerify(vf, tokenSecret);
	if(info.code !== 1) {
		res.send({code: 0, msg: info.msg, data: null});
		return;
	}
	const { id } = info.data.data;
	const token = await redis.hget(loginInfoKey, id);
	if(!token) {
		res.send({code: 0, msg: '请先登录，再进行后续操作.', data: null});
		return;
	}
	if(vf !== token) {
		res.send({code: 0, msg: 'token已过期，请重新登录.', data: null});
		return;
	}
	req.user = info.data.data;
	await next();
};