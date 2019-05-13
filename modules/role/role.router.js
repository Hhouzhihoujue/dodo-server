const { catchAsyncError } = require('../../utils/common');
const RoleCtrl = require('./role.ctrl');

module.exports = router => {
	router
		.get('/roles', catchAsyncError(RoleCtrl.getRoles))
		.post('/roles', catchAsyncError(RoleCtrl.createRoles));
};