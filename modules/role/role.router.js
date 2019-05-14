const { catchAsyncError } = require('../../utils/common');
const checkToken = require('../../middlewares/checkToken');
const RoleCtrl = require('./role.ctrl');

module.exports = router => {
	router
		.get('/roles', checkToken, catchAsyncError(RoleCtrl.getRoles))
		.post('/roles', checkToken, catchAsyncError(RoleCtrl.createRoles));
};