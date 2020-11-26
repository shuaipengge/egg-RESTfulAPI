'use strict';

const Controller = require('egg').Controller;

const createRule = {
  title: { type: 'string', required: true },
  description: { type: 'string', required: false },
};
const updateRule = {
  title: { type: 'string', required: false },
  description: { type: 'string', required: false },
};

class QuestionController extends Controller {
  async find() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.question.find(ctx.query);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async create() {
    const ctx = this.ctx;
    // 接收并校验参数
    ctx.validate(createRule, ctx.request.body);
    // 处理逻辑
    const { code, body } = await ctx.service.question.create(
      ctx.request.body,
      ctx.state.user._id
    );
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async findById() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.question.findById(
      ctx.params.id,
      ctx.query
    );
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async update() {
    const ctx = this.ctx;
    // 接收并校验参数
    ctx.validate(updateRule, ctx.request.body);
    // 处理逻辑
    const { code, body } = await ctx.service.question.update(ctx.request.body);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async delete() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.question.delete(ctx.params.id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }
}

module.exports = QuestionController;
