'use strict';

const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
  email: { type: 'string', required: true },
  password: { type: 'string', required: true },
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

class UserController extends Controller {
  async register() {
    const ctx = this.ctx;
    // 接收并校验参数
    ctx.validate(createRule, ctx.request.body);
    // 处理逻辑
    const { code, body } = await ctx.service.user.register(ctx.request.body);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async findeById() {
    const ctx = this.ctx;
    if (ctx.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      // 处理逻辑
      const { code, body } = await ctx.service.user.findeById(
        ctx.params.id,
        ctx.query
      );
      // 返回响应体和状态码
      ctx.body = { ...body };
      ctx.status = code;
      return;
    }
    // TODO 抽离id判断中间件
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

  async deleteUser() {
    const ctx = this.ctx;
    if (ctx.params.id !== ctx.state.user._id) {
      return { code: 403, body: { status: false, msg: '没有权限' } };
    }
    // 处理逻辑
    const { code, body } = await ctx.service.user.deleteUser(ctx.params.id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async listFollowing() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.user.listFollowing(ctx.params.id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async listFollowers() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body } = await ctx.service.user.listFollowers(ctx.params.id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async follow() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.follow(ctx.params.id, ctx.state.user._id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async unfollow() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.unfollow(ctx.params.id, ctx.state.user._id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async followTopic() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.followTopic(ctx.params.id, ctx.state.user._id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async listFollowingTopics() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.listFollowingTopics(ctx.params.id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async unfollowTopic() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.unfollowTopic(ctx.params.id, ctx.state.user._id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async listQuestion() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.listQuestion(ctx.params.id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async listAnswer() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.listAnswer(ctx.params.id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async listLikingAnswers() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.listLikingAnswers(ctx.params.id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async listLikingComments() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.listLikingComments(ctx.params.id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async likeAnswer() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.likeAnswer(ctx.params.id, ctx.state.user._id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async likeComment() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.likeComment(ctx.params.id, ctx.state.user._id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async unlikeAnswer() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.unlikeAnswer(ctx.params.id, ctx.state.user._id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async unlikeComment() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.unlikeComment(ctx.params.id, ctx.state.user._id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async listDislikingAnswers() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.listDislikingAnswers(ctx.params.id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async listDislikingComments() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.listDislikingComments(ctx.params.id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async dislikeAnswer() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.dislikeAnswer(ctx.params.id, ctx.state.user._id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async dislikeComment() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.dislikeComment(ctx.params.id, ctx.state.user._id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async undislikeAnswer() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.undislikeAnswer(ctx.params.id, ctx.state.user._id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async undislikeComment() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.undislikeComment(ctx.params.id, ctx.state.user._id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async listCollectingAnswers() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.listCollectingAnswers(ctx.params.id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async CollectAnswer() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.CollectAnswer(ctx.params.id, ctx.state.user._id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }

  async unCollectAnswer() {
    const ctx = this.ctx;
    // 处理逻辑
    const { code, body = {} } = await ctx.service.user.unCollectAnswer(ctx.params.id, ctx.state.user._id);
    // 返回响应体和状态码
    ctx.body = { ...body };
    ctx.status = code;
  }
}
module.exports = UserController;
