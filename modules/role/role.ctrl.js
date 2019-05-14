
const mongoose = require('mongoose');
const RoleVld = require('./role.vld');
const { root: { roleCode } } = require('../../env');
class RoleCtrl {
	/**
   * @api {get} /roles 获取角色
   * @apiName roles_list
   * @apiGroup roles
   * 
   * @apiHeader {String} vf token 
   * 
   * @apiSuccessExample 返回示例
      HTTP/1.1 200 OK
      {
        "code": 1,
        "msg": "获取角色成功！",
        "data": {
          "list": [],
          "count": 1
        }
      }
   * @apiErrorExample 错误示例
      HTTP/1.1 500 Internal Server Error
  */
	async getRoles(req, res) {
		const Role = mongoose.model('role');
		const list = await Role.find({code: {$ne: roleCode}},{__v: 0});
		res.send({ code: 1, msg: '获取角色成功！', data: { list }});
	}
  
	/**
   * @api {post} /roles 新增角色
   * @apiName roles_add
   * @apiGroup roles
   * 
   * @apiHeader {String} vf token 
   * 
   * @apiParam {String} name 角色名称
   * @apiParam {String} code 角色代码
   * @apiSuccessExample 返回示例
      HTTP/1.1 200 OK
      {
        "code": 1,
        "msg": "新增角色成功！",
        "data": {}
      }
   * @apiErrorExample 错误示例
      HTTP/1.1 500 Internal Server Error
  */
	async createRoles(req, res) {
		const Role = mongoose.model('role');
		const {name, code} = req.body;
		const validate = await RoleVld.createRole(name, code);
		if(validate && validate.status === 0) {
			res.send({code: 0, msg: validate.msg, data: null});
			return;
		}
		const role = new Role({name, code});
		const result = await role.save();
		res.send({code: 1, msg: '新增角色成功.', data: result});
	}
}

module.exports = new RoleCtrl();