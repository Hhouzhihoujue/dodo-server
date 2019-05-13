const mongoose = require('mongoose');
const { mongo: mongoConf } = require('../env/index');
const { loadDir } = require('../utils/common');

mongoose.connect(mongoConf, {useNewUrlParser: true}).then(() => {
	console.log('【Mongodb】mongodb is connect.');
	const modelFiles = loadDir('./modules/**/*.model.js');
	modelFiles.forEach(path => require(path));
}).catch(err => {
	console.log(`【Mongodb】${err.message}.`);
});





