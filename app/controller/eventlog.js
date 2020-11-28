'use strict';

const Controller = require('egg').Controller;

class EventlogController extends Controller {
  async index() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.eventlog.index(
      ctx.query
    );
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }


  async findById() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.eventlog.findById(
      ctx.params.id,
      ctx.query
    );
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }
}

module.exports = EventlogController;
