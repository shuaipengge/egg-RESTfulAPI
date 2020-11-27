'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  // TODO 收藏的回答
  // 回答列表
  async find(questionId, query) {
    const { per_page = 10 } = query;
    const page = Math.max(query.page * 1, 1) - 1;
    const perPage = Math.max(per_page, 1);
    const q = new RegExp(query.q);
    const data = await this.ctx.model.Answer.find({
      content: q,
      questionId,
    })
      .limit(perPage)
      .skip(page * perPage);
    return { code: 200, body: { status: true, msg: '回答列表获取成功', data } };
  }

  // 创建回答
  async create(answer, questionId, answerer) {
    const data = await new this.ctx.model.Answer({
      ...answer,
      answerer,
      questionId,
    }).save();
    return { code: 200, body: { status: true, msg: '回答创建成功', data } };
  }

  // 回答详情
  async findById(id, query) {
    const { fields = '' } = query;
    const selectFields = fields
      .split(';')
      .filter(f => f)
      .map(f => ' +' + f)
      .join('');
    const data = await this.ctx.model.Answer.findById(id)
      .select(selectFields)
      .populate('answerer');
    return { code: 200, body: { status: true, msg: '获取回答详情', data } };
  }

  // 修改回答
  async update(params) {
    await this.ctx.state.answer.update(params);
    const data = this.ctx.state.answer;
    // TODO 返回修改后的回答
    return { code: 200, body: { status: true, msg: '回答修改成功', data } };
  }

  // 删除回答
  async delete(id) {
    const answer = await this.ctx.model.Answer.findByIdAndUpdate(id, { status: 0 });
    if (!answer) {
      return { code: 500, body: { status: false, msg: '回答删除失败' } };
    }
    return { code: 204, body: { status: true, msg: '删除成功' } };
  }
}

module.exports = UserService;
