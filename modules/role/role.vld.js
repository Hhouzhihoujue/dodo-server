const mongoose = require('mongoose');

class Validate {
	async createRole(name, code) {
		const Role = mongoose.model('role');
		if(!name) return {status: 0, msg: '请输入角色名！'};
		if(!code) return {status: 0, msg: '请输入角色代码！'};
		const role = await Role.findOne({code});
		if(role) return {status: 0, msg: '角色已存在！'};
	} 
}

module.exports = new Validate();