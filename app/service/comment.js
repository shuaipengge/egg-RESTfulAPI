'use strict';

const Service = require('egg').Service;

class commentService extends Service {
  async find(query, params) {
    const { per_page = 10 } = query;
    const page = Math.max(query.page * 1, 1) - 1;
    const perPage = Math.max(per_page, 1);
    const q = new RegExp(query.q);
    const { questionId, answerId } = params;
    const { rootCommentId } = query;
    const data = await this.ctx.model.Comment.find({
      content: q,
      questionId,
      answerId,
      rootCommentId,
    })
      .limit(perPage)
      .skip(page * perPage)
      .populate('commentator replyTo');
    return { code: 200, body: { status: true, msg: '获取评论列表', data } };
  }

  // 获取评论详情
  async findById(query, params) {
    const { fields = '' } = query;
    const selectFields = fields
      .split(';')
      .filter(f => f)
      .map(f => ' +' + f)
      .join('');
    const data = await this.ctx.model.Comment.findById(params.id)
      .select(selectFields)
      .populate('commentator');
    return { code: 200, body: { status: true, msg: '获取评论详情', data } };
  }

  // 创建评论
  async create(body, params, meId) {
    const commentator = meId;
    const { questionId, answerId } = params;
    const data = await new this.ctx.model.Comment({ ...body, commentator, questionId, answerId }).save();
    return { code: 200, body: { status: true, msg: '评论成功', data } };
  }

  // 修改评论
  async update(body, comment) {
    await comment.update(body);
    const data = comment;
    return { code: 200, body: { status: true, msg: '评论修改成功', data } };
  }

  // 删除评论
  async delete(id) {
    const answer = await this.ctx.model.Comment.findByIdAndUpdate(id, { status: 0 });
    if (!answer) {
      return { code: 404, body: { status: true, msg: '评论不存在' } };
    }
    return { code: 200, body: { status: true, msg: '评论删除成功' } };
  }
}

module.exports = commentService;
