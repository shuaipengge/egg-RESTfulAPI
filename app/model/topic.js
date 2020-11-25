'use strict';

module.exports = app => {
  // 引入建立连接的mongoose
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  // 数据库表的映射
  const topicSchema = new Schema({
    __v: { type: Number, select: false },
    // 话题名称
    name: { type: String, required: true },
    // 话题图标
    avatar_url: { type: String },
    // 话题简介
    introduction: { type: String, select: false },
  }, { timestamps: true });

  return mongoose.model('Topic', topicSchema, 'topic');
};
