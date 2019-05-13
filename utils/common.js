const { resolve } = require('path');
const crypto = require('crypto');
const glob = require('glob');
const jwt = require('jsonwebtoken');

// 读取匹配目录下所有文件路径
const loadDir = path => {
	return glob.sync(resolve(path));
};

// md5+salt 加密
const md5Sign = (str, salt) => {
	let md5 = crypto.createHash('md5');
	md5.update(str + salt);
	return md5.digest('hex');
};

// jwt签名
const jwtSign = (secret, data, s) => {
	return jwt.sign({
		// 过期时间 1天   单位/秒
		exp: Math.floor(Date.now() / 1000) + s,
		data: data
	}, secret);
};

// jwt解密
const jwtVerify = (token, secret) => {
	let info;
	try {
		const data = jwt.verify(token, secret);
		info = { code: 1, data};
	} catch (error) {
		switch (error.name) {
		case 'TokenExpiredError':
			info= { code: 0, msg: 'token已过期!'};
			break;
		default:
			info = { code: 0, msg: 'token校验失败!'};
		}
	}
	return info;
};

// 全局捕获异步错误
const catchAsyncError = fn => (req, res, next) => 
	Promise.resolve().then(() => fn(req, res, next)).catch(next);

module.exports = {
	loadDir,
	md5Sign,
	jwtSign,
	jwtVerify,
	catchAsyncError
};
