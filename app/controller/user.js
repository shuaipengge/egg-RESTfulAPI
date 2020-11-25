'use strict';

const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
  email: 'string',
  password: 'string',
};

const updateRule = {
  home_img: { type: 'string', required: false },
  avatar_url: { type: 'string', required: false },
  gender: { type: 'string', required: false },
  headline: { type: 'string', required: false },
  locations: { type: 'array', itemType: 'string', required: false },
  business: { type: 'string', required: false },
  employments: { type: 'array', itemType: 'object', required: false },
  educations: { type: 'array', itemType: 'object', required: false },
  personal_profile: { type: 'string', required: false },
};

class BlogController extends Controller {
  async create() {
    const ctx = this.ctx;

    // 接收并校验参数
    ctx.validate(createRule, ctx.request.body);

    // 处理逻辑
    const { code, body } = await ctx.service.user.create(ctx.request.body);

    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async show() {
    const ctx = this.ctx;
    if (ctx.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      // 处理逻辑
      const { code, body } = await ctx.service.user.show(
        ctx.params.id,
        ctx.query
      );
      // 返回响应体和状态码
      ctx.body = { ...body };
      ctx.status = code;
      return;
    }
    ctx.body = { status: false, msg: 'ID不合法' };
    ctx.status = 422;
  }

  async index() {
    const ctx = this.ctx;

    // 处理逻辑
    const { code, body } = await ctx.service.user.index(ctx.query);

    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async login() {
    const ctx = this.ctx;
    // 接收并校验参数
    ctx.validate(createRule, ctx.request.body);
    // 处理逻辑
    const { code, body } = await ctx.service.user.login(ctx.request.body);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async updateUser() {
    const ctx = this.ctx;
    if (ctx.params.id !== ctx.state.user._id) {
      return { code: 403, body: { status: false, msg: '没有权限' } };
    }
    // 接收并校验参数
    ctx.validate(updateRule, ctx.request.body);
    // 处理逻辑
    const { code, body } = await ctx.service.user.updateUser(
      ctx.params.id,
      ctx.request.body
    );
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }
}
module.exports = BlogController;
