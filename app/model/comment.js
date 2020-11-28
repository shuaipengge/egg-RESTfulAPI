'use strict';

module.exports = app => {
  // 引入建立连接的mongoose
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  // 数据库表的映射
  const commentSchema = new Schema({
    __v: { type: Number, select: false },
    // 评论的状态
    status: { type: Number, default: 1, required: true, select: false },
    // 评论内容
    content: { type: String, required: true },
    // 评论作者
    commentator: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    // 问题id
    questionId: { type: String, required: true },
    // 回答id
    answerId: { type: String, required: true },
    // 根评论id
    rootCommentId: { type: String },
    // 回复给某用户的id
    replyTo: { type: Schema.Types.ObjectId, ref: 'User' },
    // 👍赞数量
    liking: { type: Number, required: true, default: 0 },
    // 👎踩数量
    disliking: { type: Number, required: true, default: 0 },
  }, { timestamps: true });

  return mongoose.model('Comment', commentSchema, 'comment');
};
