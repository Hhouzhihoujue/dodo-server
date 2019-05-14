const { name: serverName } = require('../package.json');

module.exports = {
	port: 3003,
	redis: {
		port: 6379,          
		host: '127.0.0.1',  
	},
	mongo: 'mongodb://localhost:27017/dodo-server',
	tokenSecret: 'dodo-server',
	tokenExpires: 60*60*24, // 单位/s
	root: {
		username: 'root',
		password: 'helloroot',
		nickName: '系统管理员',
		roleName: '系统管理员',
		roleCode: 'root'
	},
	redisKey: {
		loginInfo: `${serverName}_login_info`
	}
};