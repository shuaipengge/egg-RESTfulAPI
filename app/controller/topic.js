'use strict';

const Controller = require('egg').Controller;

const createRule = {
  name: { type: 'string', required: true },
  avatar_url: { type: 'string', required: false },
  introduction: { type: 'string', required: false },
};

const updateRule = {
  name: { type: 'string', required: false },
  avatar_url: { type: 'string', required: false },
  introduction: { type: 'string', required: false },
};

class TopicController extends Controller {
  async find() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.topic.find(ctx.query);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async create() {
    const ctx = this.ctx;
    // 接收并校验参数
    ctx.validate(createRule, ctx.request.body);
    // 处理逻辑
    const { code, body } = await ctx.service.topic.create(ctx.request.body);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async findById() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.topic.findById(
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
    const { code, body } = await ctx.service.topic.update(
      ctx.params.id,
      ctx.request.body
    );
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async listTopicFollowers() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.topic.listTopicFollowers(ctx.params.id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async listQuestion() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.topic.listQuestion(ctx.params.id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }
}

module.exports = TopicController;
