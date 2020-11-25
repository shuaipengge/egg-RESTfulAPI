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
    // TODO MD5加密🔐
    const user = await new this.ctx.model.User({ name, email, password }).save();
    if (user) {
      return { code: 200, body: { status: true, msg: '注册成功' } };
    }
    return { code: 500, body: { status: false, msg: '发现未知错误' } };
  }

  // 查看用户信息
  async show(userid, query) {
    const { fields = '' } = query;
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f)
      .join('');
    const populateStr = fields.split(';').filter(f => f).map(f => {
      // 查询过滤 职业经历
      if (f === 'employments') {
        return 'employments.company employments.job';
      }
      // 查询过滤 教育经历
      if (f === 'educations') {
        return 'educations.school educations.major';
      }
      return f;
    })
      .join(' ');
    // TODO 无法查询email
    const user = await this.ctx.model.User.findById(userid)
      .select(selectFields)
      .populate(populateStr);
    if (!user) {
      return { code: 404, body: { status: false, msg: '用户不存在' } };
    }
    return { code: 200, body: { status: true, msg: '查询成功', data: user } };
  }

  // 用户列表
  async index(query) {
    const { size = 10 } = query;
    const page = Math.max(query.page * 1, 1) - 1;
    const perPage = Math.max(size, 1);
    const data = await this.ctx.model.User
      .find({ name: new RegExp(query.q) })
      .limit(perPage).skip(page * perPage);
    return { code: 200, body: { status: true, data } };
  }

}

module.exports = BlogService;
