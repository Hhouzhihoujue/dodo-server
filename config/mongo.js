const mongoose = require('mongoose');
const { mongo: mongoConf, root: rootUser } = require('../env/index');
const { loadDir, md5Sign } = require('../utils/common');

mongoose.connect(mongoConf, {useNewUrlParser: true}).then(() => {
	console.log('【Mongodb】mongodb is connect.');
	
	const { username, password, nickName, roleName, roleCode} = rootUser;
	const modelFiles = loadDir('./modules/**/*.model.js');
	modelFiles.forEach(path => require(path));

	const Role = mongoose.model('role');
	const User = mongoose.model('user');
	const getRootRole = Role.findOne({ code: roleCode});
	const getRootUser = User.findOne({ username });

	Promise.all([getRootRole, getRootUser]).then(async data => {
		let [role, user] = data;
		if(!role) {
			role = await Role.create({ name: roleName, code: roleCode});
		}
		if(!user) {
			const slatPassword = md5Sign(password, username.slice(0, 4));
			user = await User.create({ username, password: slatPassword, nickName, role: role._id });
		}
	});
}).catch(err => {
	console.log(`【Mongodb】${err.message}.`);
});





