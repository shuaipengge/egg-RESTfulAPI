'use strict';

// app/service/blog.js
const Service = require('egg').Service;

class BlogService extends Service {

  // 用户注册
  async create(params) {
    const { email, password } = params;
    // 判断邮箱是否被注册
    const repeatedUser = await this.ctx.model.User.findOne({ email });
    if (repeatedUser) {
      return { code: 409, body: { status: false, msg: '邮箱已被注册' } };
    }
    const name = `可爱的我${Math.random().toString().substring(2, 8)}`;
    const user = await new this.ctx.model.User({ name, email, password }).save();
    if (user) {
      return { code: 200, body: { status: true, msg: '注册成功' } };
    }
    return { code: 500, body: { status: false, msg: '发现未知错误' } };
  }

}

module.exports = BlogService;
