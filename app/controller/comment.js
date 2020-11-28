'use strict';

const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
  content: { type: 'string', required: true },
  rootCommentId: { type: 'string', required: false },
  replyTo: { type: 'string', required: false },
};

const updateRule = {
  content: { type: 'string', required: true },
};

// const updateRule = {};

class commentController extends Controller {
  async find() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.comment.find(
      ctx.query,
      ctx.params
    );
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async findById() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.comment.findById(
      ctx.query,
      ctx.params
    );
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async create() {
    const ctx = this.ctx;
    // 接收并校验参数
    ctx.validate(createRule, ctx.request.body);
    // 处理逻辑
    const { code, body } = await ctx.service.comment.create(
      ctx.request.body,
      ctx.params,
      ctx.state.user._id
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
    const { code, body } = await ctx.service.comment.update(
      ctx.request.body,
      ctx.state.comment
    );
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async delete() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.comment.delete(
      ctx.params.id
    );
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }
}

module.exports = commentController;
