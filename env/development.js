module.exports = {
	port: 3003,
	redis: {
		port: 6379,          
		host: '127.0.0.1',  
	},
	mongo: 'mongodb://localhost:27017/api_server',
	tokenSecret: 'dodo-server',
	tokenExpires: 60*60*24, // 单位/s
};