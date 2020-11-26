'use strict';

module.exports = app => {
  // 引入建立连接的mongoose
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  // 数据库表的映射
  const questionSchema = new Schema({
    __v: { type: Number, select: false },
    // 问题的状态
    status: { type: Number, default: 1, required: true, select: false },
    // 问题标题
    title: { type: String, required: true },
    // 问题详情
    description: { type: String },
    // 问题作者
    questioner: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    // 关联话题
    topics: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
      select: false,
    },
  }, { timestamps: true });

  return mongoose.model('Question', questionSchema, 'question');
};
