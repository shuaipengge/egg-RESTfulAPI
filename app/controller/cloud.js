'use strict';

const Controller = require('egg').Controller;

const getTokenRule = {
  accountID: { type: 'string', required: true },
  roleName: { type: 'string', required: true },
};

class CloudController extends Controller {
  async getStsToken() {
    const { ctx } = this;
    ctx.validate(getTokenRule, ctx.query);
    // 处理逻辑
    const { code, body } = await ctx.service.cloud.getStsToken(ctx.query);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }
}

module.exports = CloudController;
