const { catchAsyncError } = require('../../utils/common');
const checkToken = require('../../middlewares/checkToken');
const UserCtrl = require('./user.ctrl');
module.exports = router => {
	router
		.get('/users', checkToken, catchAsyncError(UserCtrl.getUsers))
		.post('/users', checkToken, catchAsyncError(UserCtrl.createUser))
		.post('/login', catchAsyncError(UserCtrl.login))
		.post('/logout', checkToken, catchAsyncError(UserCtrl.logout))
		.delete('/users/:id', checkToken, catchAsyncError(UserCtrl.removeUser));
};