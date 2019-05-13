const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Role = new Schema({
	name: {
		type: 'string'
	},
	code: {
		type: 'string'
	}
});

mongoose.model('role', Role);
