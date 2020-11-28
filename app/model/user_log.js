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
    // IP地址
    address: { type: String, required: true, select: false },
    // 事件描述
    description: { type: String, select: false },
    // 源自用户
    eventer: { type: Schema.Types.ObjectId, ref: 'User', required: false, select: true },
  }, { timestamps: true });

  return mongoose.model('Eventlog', eventlogSchema, 'eventlog');
};
