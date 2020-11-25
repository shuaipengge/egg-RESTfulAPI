'use strict';

module.exports = app => {
  // 引入建立连接的mongoose
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  // 数据库表的映射
  const answerSchema = new Schema({
    __v: { type: Number, select: false },
    // 回答内容
    content: { type: String, required: true },
    // 回答作者
    answerer: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    // 问题id
    questionId: { type: String, required: true },
    // 点赞数量
    voteCount: { type: Number, required: true, default: 0 },
  }, { timestamps: true });

  return mongoose.model('Answer', answerSchema, 'answer');
};
