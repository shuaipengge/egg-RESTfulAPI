'use strict';

const Service = require('egg').Service;

class TopicService extends Service {
  // 话题列表
  async find(query) {
    const { per_page = 10 } = query;
    const page = Math.max(query.page * 1, 1) - 1;
    const perPage = Math.max(per_page, 1);
    const data = await this.ctx.model.Topic.find({ name: new RegExp(query.q) })
      .limit(perPage)
      .skip(page * perPage);
    return { code: 200, body: { status: true, data } };
  }

  // 创建话题
  async create(topic) {
    const data = await new this.ctx.model.Topic(topic).save();
    return { code: 200, body: { status: true, msg: '创建成功', data } };
  }

  // 话题详情
  async findById(id, query) {
    const { fields = '' } = query;
    const selectFields = fields
      .split(';')
      .filter(f => f)
      .map(f => ' +' + f)
      .join('');
    const data = await this.ctx.model.Topic.findById(id).select(selectFields);
    return { code: 200, body: { status: true, msg: '获取详情成功', data } };
  }

  // 修改话题
  async update(id, topic) {
    const data = await this.ctx.model.Topic.findByIdAndUpdate(id, topic);
    // TODO 应返回修改后的值
    return { code: 200, body: { status: true, msg: '话题修改成功', data } };
  }

  // TODO 话题删除

  // 获取话题的关注者
  async listTopicFollowers(id) {
    const data = await this.ctx.model.User.find({ followingTopics: id });
    return { code: 200, body: { status: true, data } };
  }

  // 获取话题下的问题
  async listQuestion(id) {
    const data = await this.ctx.model.Question.find({ topics: id });
    return { code: 200, body: { status: true, data } };
  }

}

module.exports = TopicService;
