const mongoose = require('mongoose');
const UserVld = require('./user.vld');
const { tokenSecret, tokenExpires, redisKey: { loginInfoKey } } = require('../../env');
const { md5Sign, jwtSign } = require('../../utils/common');
const redis = require('../../config/redis');

class UserCtrl {
	/**
   * @api {get} /users 获取用户列表
   * @apiName users_list
   * @apiGroup users
   * 
   * @apiHeader {String} vf token 
   * 
   * @apiParam {String} pageNumber 页数
   * @apiParam {String} pageCount 每页个数
   * @apiSuccessExample 返回示例
      HTTP/1.1 200 OK
      {
        "code": 1,
        "msg": "获取用户成功!",
        "data": {
          "list": [],
          "count": 1
        }
      }
   * @apiErrorExample 错误示例
      HTTP/1.1 500 Internal Server Error
  */
	async getUsers(req, res) {
		const User = mongoose.model('user');
		const { pageCount = 10, pageNumber = 1 } = req.query;
		let list = [];
		let allCount = 0;
		const users = User.find({}, { __v: 0, password: 0 })
			.sort({ created_at: -1 })
			.skip((Number(pageNumber) - 1) * Number(pageCount))
			.limit(Number(pageCount));
		const counts = User.estimatedDocumentCount();
		[list, allCount] = await Promise.all([users, counts]);
		res.send({code: 1, msg: '获取用户列表成功.', data: { list, allCount, pageCount, pageNumber }});
	}

	/**
	 * @api {post} /users 新增用户
	 * @apiName users_add
	 * @apiGroup users
	 * 
	 * @apiHeader {String} vf token 
	 * 
	 * @apiParam {String} username 用户名
	 * @apiParam {String} password 密码
	 * @apiParam {String} nickName 昵称
	 * @apiParam {String} role 角色
	 * @apiSuccessExample 返回示例
	    HTTP/1.1 200 OK
	    {
	      "code": 1,
	      "msg": "创建用户成功！",
	      "data": {}
	    }
	 * @apiErrorExample 错误示例
	    HTTP/1.1 500 Internal Server Error
	*/
	async createUser(req, res) {
		const User = mongoose.model('user');
		const { username, password, nickName, role } = req.body || {};

		const validate = await UserVld.createUser(username, password, nickName, role);
		if (validate && validate.status === 0) {
			res.send({ code: 0, msg: validate.msg, data: null});
			return;
		}
		const slatPassword = md5Sign(password, username.slice(0, 4));
		let result = await User.create({ username, password: slatPassword, nickName, role });
		result = result.toObject();
		delete result.password;
		res.send({ code: 1, data: result, msg: '创建用户成功.'});
	}


	/**
	 * @api {delete} /users 删除用户
	 * @apiName users_delete
	 * @apiGroup users
	 * 
	 * @apiHeader {String} vf token 
	 * 
	 * @apiParam {String} id 用户ID
	 * @apiSuccessExample 返回示例
	    HTTP/1.1 200 OK
	    {
	      "code": 1,
	      "msg": "删除用户成功！",
	      "data": null
	    }
	 * @apiErrorExample 错误示例
	    HTTP/1.1 500 Internal Server Error
	*/
	async removeUser(req, res) {
		const User = mongoose.model('user');
		let { id } = req.params;
		if (!id) {
			res.send({ code: 0, msg: '缺少参数！', data: null});
			return; 
		}
		if(!mongoose.Types.ObjectId.isValid(id)) {
			res.send({ code: 0, msg: '用户id错误！', data: null});
			return; 
		}
		const result = await User.deleteOne({ _id: id });
		if (result.ok === 1) {
			res.send({code: 1, msg: '删除用户成功！', data: null});
		} else {
			res.send({code: 0, msg: '删除用户失败！', data: null});
		}
	}

	/**
	 * @api {post} /login 登陆
	 * @apiName users_login
	 * @apiGroup users 
	 * 
	 * @apiParam {String} username 用户名
	 * @apiParam {String} password 密码
	 * @apiSuccessExample 返回示例
	    HTTP/1.1 200 OK
	    {
	      "code": 1,
	      "msg": "登陆成功！",
	      "data": {}
	    }
	 * @apiErrorExample 错误示例
	    HTTP/1.1 500 Internal Server Error
	*/
	async login(req, res) {
		const User = mongoose.model('user');
		const { username, password } = req.body;
		const validate = await UserVld.login(username, password);
		if (validate && validate.status === 0) {
			res.send({ code: 0, msg: validate.msg, data: null});
			return;
		}
		const result = await User.findOne({ username: username }).populate('role');
		if (!result) {
			res.send({ code : 0, msg: '不存在此用户！', data: null});
			return;
		}
		const saltPassword = md5Sign(password, username.slice(0, 4));
		if (saltPassword != result.password) {
			res.send({ code: 0, msg: '用户名或密码错误！', data: null});
			return;
		}
		const token = jwtSign(tokenSecret, {id: result._id, role: result.role.code}, tokenExpires);
		const userInfo = result.toObject();
		delete userInfo.password;
		userInfo['token'] = token;
		await redis.hset(loginInfoKey, String(result._id), token);
		res.send({ code: 1, msg: '登陆成功', data: userInfo});
	}

	/**
	 * @api {post} /logout 注销
	 * @apiName users_logout
	 * @apiGroup users
	 * 
	 * @apiHeader {String} vf token 
	 * 
	 * @apiSuccessExample 返回示例
	    HTTP/1.1 200 OK
	    {
	      "code": 1,
	      "msg": "注销成功！",
	      "data": {}
	    }
	 * @apiErrorExample 错误示例
	    HTTP/1.1 500 Internal Server Error
	*/
	async logout(req, res) {
		if(req.user) {
			await redis.hdel(loginInfoKey, String(req.user.id));
			res.send({code: 1, msg: '用户注销成功！',data: null });
			return;
		}
		res.send({code: 0, msg: '未找到需要注销的用户',data: null });
	}
}

module.exports = new UserCtrl();
