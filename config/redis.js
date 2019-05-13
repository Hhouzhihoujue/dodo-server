const Redis = require('ioredis');
const { redis: redisConf } = require('../env/index');

const redis = new Redis(redisConf);

redis.on('connect', () => {
	console.log('【Redis】Redis is connected.');
});

redis.on('reconnecting', () => {
	console.log('【Redis】Redis is reconnecting.');
});

redis.on('error', err => {
	console.log(`【Redis】${err.message}`);
});

module.exports = redis;