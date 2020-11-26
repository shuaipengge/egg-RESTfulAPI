'use strict';

const Controller = require('egg').Controller;

class TopicController extends Controller {
  async find() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.user.create(ctx.request.body);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

}

module.exports = TopicController;
