const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
	{
		username: {
			type: 'string',
			required: true
		},
		password: {
			type: 'string',
			required: true
		},
		sex: {
			type: 'number'
		},
		nickName: {
			type: 'string'
		},
		role: {
			type: Schema.ObjectId,
			ref: 'role'
		}
	},
	{
		timestamps: {
			createdAt: 'created',
			updatedAt: 'updated'
		}
	}
);

mongoose.model('user', User);
