'use strict';

module.exports = app => {
  // 引入建立连接的mongoose
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  // 数据库表的映射
  const eventlogSchema = new Schema({
    __v: { type: Number, select: false },
    // 事件名称
    title: { type: String, required: true },
    // 事件描述
    description: { type: String },
    // 源自用户
    eventer: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
  }, { timestamps: true });

  return mongoose.model('Eventlog', eventlogSchema, 'eventlog');
};
