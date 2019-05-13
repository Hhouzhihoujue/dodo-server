const express = require('express');
const bodyParser = require('body-parser');
const { port } = require('./env');

require('./config/redis');
require('./config/mongo');

const app = express();
const router = express.Router();
require('./config/router')(router);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// 不use挂载不上router
app.use('/api', router);

app.use((req, res) => {
	res.status(404);
	res.end();
});

// 全局处理异常
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).send({code: 0, msg: '服务器开小差了!', data: null});
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
