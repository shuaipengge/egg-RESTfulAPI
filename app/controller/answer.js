'use strict';

const Controller = require('egg').Controller;

const createRule = {
  content: { type: 'string', required: true },
};

class AnswerController extends Controller {
  async find() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.answer.find(
      ctx.params.questionId,
      ctx.query
    );
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async create() {
    const ctx = this.ctx;
    // 接收并校验参数
    ctx.validate(createRule, ctx.request.body);
    const { questionId } = ctx.params;
    // 处理逻辑
    const { code, body } = await ctx.service.answer.create(
      ctx.request.body,
      questionId,
      ctx.state.user._id
    );
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async findById() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.answer.findById(
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
    ctx.validate(createRule, ctx.request.body);
    // 处理逻辑
    const { code, body } = await ctx.service.answer.update(
      ctx.request.body
    );
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async delete() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.answer.delete(ctx.params.id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }
}

module.exports = AnswerController;
