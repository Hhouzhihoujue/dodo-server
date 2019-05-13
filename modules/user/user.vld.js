const mongoose = require('mongoose');

class Validate {
	async createUser(username, password, nickName, role) {
		const User = mongoose.model('user');
		if(!username) return {status: 0, msg: '请输入用户名！'};
		if(!password) return {status: 0, msg: '请输入密码！'};
		if(!nickName) return {status: 0, msg: '请输入昵称！'};
		if(!role) return {status: 0, msg: '请选择角色！'};
		if(username.length < 4) return {status: 0, msg: '用户名长度需大于4位！'};
		if(password.length < 6) return {status: 0, msg: '密码长度需大于6位！'};
		let person = await User.findOne({username});
		if(person) return {status: 0, msg: '用户名已被占用！'};
	} 

	async login(username, password) {
		if(!username) return {status: 0, msg: '请输入用户名！'};
		if(!password) return {status: 0, msg: '请输入密码！'};
	}
  
}

module.exports = new Validate();