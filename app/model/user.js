'use strict';

module.exports = app => {
  // 引入建立连接的mongoose
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  // 数据库表的映射
  const UserSchema = new Schema({
    __v: { type: Number, select: false },
    // 用户的状态
    status: { type: Number, default: 1, required: true },
    // 用户的姓名
    name: { type: String, required: false },
    // 等级
    level: { type: Number, required: false },
    // 用户密码
    password: { type: String, required: true, select: false },
    // 用户背景图片
    home_img: { type: String, required: false },
    // 用户Email
    email: { type: String, required: true, select: false },
    // 用户手机号码
    phone_number: { type: String, required: false, select: false },
    // 用户设备型号
    phone_no: { type: String, required: false, select: false },
    // 用户本次登陆IP
    log_ip_1: { type: String, required: false },
    // 用户头像
    avatar_url: { type: String, required: false },
    // 性别
    gender: { type: String, enum: [ 'male', 'female' ], default: 'male', required: true },
    // 个性签名
    headline: { type: String, required: false },
    // 居住地
    locations: { type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }], select: false },
    // 所在行业
    business: { type: Schema.Types.ObjectId, ref: 'Topic', select: false },
    // 职业经历
    employments: {
      type: [{
        // 公司
        company: { type: Schema.Types.ObjectId, ref: 'Topic' },
        // 职位
        job: { type: Schema.Types.ObjectId, ref: 'Topic' },
      }], select: false,
    },
    // 教育经历
    educations: {
      type: [{
        // 学校
        school: { type: Schema.Types.ObjectId, ref: 'Topic' },
        // 专业
        major: { type: Schema.Types.ObjectId, ref: 'Topic' },
        // 学历
        diploma: { type: Number, enum: [ 1, 2, 3, 4, 5 ] },
        // 入学年份
        entrance_year: { type: Number },
        // 毕业年份
        graduation: { type: Number },
      }], select: false,
    },
    // 个人简介
    personal_profile: { type: String, select: false, required: false },
    // 关注的用户
    following: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      select: false,
    },
    // 话题关注
    followingTopics: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
      select: false,
    },
    // 赞过的答案
    likingAnswers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
      select: false,
    },
    // 踩过的答案
    dislikingAnswers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
      select: false,
    },
    // 收藏的答案
    collectingAnswers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
      select: false,
    },
  }, { timestamps: true });
  return mongoose.model('User', UserSchema, 'user');
};
