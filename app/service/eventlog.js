'use strict';

const Service = require('egg').Service;

class EventlogService extends Service {
  // 事件列表
  async index(query) {
    const { size = 10 } = query;
    const page = Math.max(query.page * 1, 1) - 1;
    const perPage = Math.max(size, 1);
    const data = await this.ctx.model.Eventlog.find({
      title: new RegExp(query.q),
    })
      .limit(perPage)
      .skip(page * perPage);
    return { code: 200, body: { status: true, msg: '事件列表', data } };
  }

  // 事件详情
  async findById(id, query) {
    const { fields = '' } = query;
    const selectFields = fields
      .split(';')
      .filter(f => f)
      .map(f => ' +' + f)
      .join('');
    const data = await this.ctx.model.Eventlog.findById(id)
      .select(selectFields)
      .populate('eventer');
    return { code: 200, body: { status: true, msg: '事件详情', data } };
  }
}

module.exports = EventlogService;
