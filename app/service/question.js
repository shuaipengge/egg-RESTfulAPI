'use strict';

const Service = require('egg').Service;

class QuestionService extends Service {
  // 问题列表
  async find(query) {
    const { per_page = 10 } = query;
    const page = Math.max(query.page * 1, 1) - 1;
    const perPage = Math.max(per_page, 1);
    const q = new RegExp(query.q);
    // TODO 过滤掉已经删除的
    const data = await this.ctx.model.Question.find({
      $or: [{ title: q }, { description: q }],
    })
      .limit(perPage)
      .skip(page * perPage);
    return { code: 200, body: { status: true, msg: '问题列表获取成功', data } };
  }

  // 创建问题
  async create(question, meID) {
    const data = await new this.ctx.model.Question({
      ...question,
      questioner: meID,
    }).save();
    return { code: 200, body: { status: true, msg: '问题创建成功', data } };
  }

  // 问题详情
  async findById(id, query) {
    const { fields = '' } = query;
    const selectFields = fields
      .split(';')
      .filter(f => f)
      .map(f => ' +' + f)
      .join('');
    const data = await this.ctx.model.Question.findById(id)
      .select(selectFields)
      .populate('questioner topics');
    return { code: 200, body: { status: true, msg: '问题详情获取成功', data } };
  }

  // 修改问题
  async update(body) {
    await this.ctx.state.question.update(body);
    const data = this.ctx.state.question;
    return { code: 200, body: { status: true, msg: '问题修改成功', data } };
  }

  // 删除问题
  async delete(id) {
    const querstion = await this.ctx.model.Question.findByIdAndUpdate(id, { status: 0 });
    if (!querstion) {
      return { code: 500, body: { status: false, msg: '问题删除失败' } };
    }
    return { code: 204, body: { status: true, msg: '删除成功' } };
  }

}

module.exports = QuestionService;
