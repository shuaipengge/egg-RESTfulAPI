'use strict';
const bcrypt = require('bcrypt');
const Service = require('egg').Service;

class UserService extends Service {

  // 用户注册
  async register(params) {
    const { email, password } = params;
    // 判断邮箱是否被注册
    const repeatedUser = await this.ctx.model.User.findOne({ email });
    if (repeatedUser) {
      return { code: 409, body: { status: false, msg: '邮箱已被注册' } };
    }
    const name = `用户${Math.random().toString().substring(2, 8)}`;
    const hash = bcrypt.hashSync(password, this.config.bcrypt.saltRounds);
    const user = await new this.ctx.model.User({ name, email, password: hash }).save();
    const log = {
      title: 'REGISTER',
      address: this.ctx.request.ip,
      description: `from: ${email}`,
    };
    await new this.ctx.model.Eventlog(log).save();
    if (user) {
      return { code: 200, body: { status: true, msg: '注册成功' } };
    }
    return { code: 500, body: { status: false, msg: '发现未知错误' } };
  }

  // 查看用户信息
  async findeById(userid, query) {
    const { fields = '' } = query;
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f)
      .join('');
    const populateStr = fields.split(';').filter(f => f).map(f => {
      // 查询过滤 职业经历
      if (f === 'employments') {
        return 'employments.company employments.job';
      }
      // 查询过滤 教育经历
      if (f === 'educations') {
        return 'educations.school educations.major';
      }
      return f;
    })
      .join(' ');
    // TODO 无法查询email
    const user = await this.ctx.model.User.findById(userid)
      .select(selectFields)
      .populate(populateStr);
    if (!user) {
      return { code: 404, body: { status: false, msg: '用户不存在' } };
    }
    return { code: 200, body: { status: true, msg: '查询成功', data: user } };
  }

  // 用户列表
  async index(query) {
    const { size = 10 } = query;
    const page = Math.max(query.page * 1, 1) - 1;
    const perPage = Math.max(size, 1);
    const data = await this.ctx.model.User
      .find({ name: new RegExp(query.q) })
      .limit(perPage).skip(page * perPage);
    return { code: 200, body: { status: true, data } };
  }

  // 用户登陆
  async login(params) {
    const { email, password } = params;
    const user = await this.ctx.model.User.findOne({ email }).select(' + status + password + name');
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const { _id, name, status } = user;
        const { jwt: { secret, expiresIn } } = this.app.config;
        const token = this.app.jwt.sign({
          _id, name, status,
        }, secret, { expiresIn });
        const log = {
          title: 'LOGIN',
          address: this.ctx.request.ip,
          eventer: _id,
        };
        await new this.ctx.model.Eventlog(log).save();
        const userInfo = await this.ctx.model.User.findOne({ email });
        return { code: 200, body: { status: true, msg: '登陆成功', data: { userInfo, token } } };
      }
    }
    return { code: 401, body: { status: false, msg: '用户名或密码错误' } };
  }

  // 修改用户信息
  async updateUser(id, params) {
    let user = await this.ctx.model.User.findByIdAndUpdate(id, params);
    if (!user) {
      return { code: 500, body: { status: false, msg: '修改失败' } };
    }
    user = await this.ctx.model.User.findById(id);
    return { code: 200, body: { status: true, msg: '修改成功', user } };
  }

  // 用户注销账号
  async deleteUser(id) {
    let user = await this.ctx.model.User.findByIdAndUpdate(id, { status: 0 });
    if (!user) {
      return { code: 500, body: { status: false, msg: '注销失败' } };
    }
    user = await this.ctx.model.User.findById(id);
    return { code: 204, body: { status: true, msg: '注销成功', user } };
  }

  // 获取某个用户的关注列表
  async listFollowing(id) {
    const user = await this.ctx.model.User.findById(id).select('+ following').populate('following');
    if (!user) {
      return { code: 404, body: { status: false, msg: '用户不存在' } };
    }
    return { code: 200, body: { status: true, msg: '获取关注列表成功', data: user.following } };
  }

  // 获取某位用户的粉丝列表
  async listFollowers(id) {
    const data = await this.ctx.model.User.find({ following: id });
    return { code: 200, body: { status: true, msg: '获取粉丝列表成功', data } };
  }

  // 关注用户
  async follow(userID, meID) {
    const me = await this.ctx.model.User.findById(meID).select('+ following');
    // 判断是否已经关注
    if (!me.following.map(id => id.toString()).includes(userID)) {
      me.following.push(userID);
      me.save();
      return { code: 200, body: { status: true, msg: '关注成功' } };
    }
    return { code: 200, body: { status: false, msg: '请勿重复关注' } };
  }

  // 取消关注用户
  async unfollow(userID, meID) {
    const me = await this.ctx.model.User.findById(meID).select('+ following');
    const index = me.following.map(id => id.toString()).indexOf(userID);
    // 判断是否已经关注
    if (index > -1) {
      me.following.splice(index, 1);
      me.save();
      return { code: 200, body: { status: true, msg: '取消关注成功' } };
    }
    return { code: 200, body: { status: true, msg: '您未关注该用户' } };
  }

  // 关注话题
  async followTopic(topicID, meID) {
    const me = await this.ctx.model.User.findById(meID).select('+ followingTopics');
    // 判断是否已经关注
    if (!me.followingTopics.map(id => id.toString()).includes(topicID)) {
      me.followingTopics.push(topicID);
      me.save();
      return { code: 200, body: { status: true, msg: '关注成功' } };
    }
    return { code: 200, body: { status: false, msg: '请勿重复关注' } };
  }

  // 获取用户关注的话题
  async listFollowingTopics(id) {
    const user = await this.ctx.model.User.findById(id).select('+ followingTopics').populate('followingTopics');
    if (!user) {
      return { code: 404, body: { status: false, msg: '用户不存在' } };
    }
    const data = user.followingTopics;
    return { code: 200, body: { status: true, msg: '获取成功', data } };
  }

  // 取消关注话题
  async unfollowTopic(id, meID) {
    const me = await this.ctx.model.User.findById(meID).select('+ followingTopics');
    const index = me.followingTopics.map(id => id.toString()).indexOf(id);
    // 判断是否已经关注
    if (index > -1) {
      me.followingTopics.splice(index, 1);
      me.save();
      return { code: 200, body: { status: true, msg: '取消关注成功' } };
    }
    return { code: 404, body: { status: false, msg: '您未关注该话题' } };
  }

  // 用户的问题列表
  async listQuestion(id) {
    const data = await this.ctx.model.Question.find({ questioner: id });
    return { code: 200, body: { status: true, data } };
  }

  // 用户的答题列表
  async listAnswer(id) {
    const data = await this.ctx.model.Answer.find({ answerer: id });
    return { code: 200, body: { status: true, data } };
  }

  // 获取某个用户的赞过的答案
  async listLikingAnswers(id) {
    const user = await this.ctx.model.User.findById(id).select('+ likingAnswers').populate('likingAnswers');
    if (!user) {
      return { code: 404, body: { status: false, msg: '用户不存在' } };
    }
    const data = user.likingAnswers;
    return { code: 200, body: { status: true, msg: '获取赞过列表', data } };
  }

  // 获取某个用户的赞过的评论
  async listLikingComments(id) {
    const user = await this.ctx.model.User.findById(id).select('+ likingComments').populate('likingComments');
    if (!user) {
      return { code: 404, body: { status: false, msg: '用户不存在' } };
    }
    const data = user.likingComments;
    return { code: 200, body: { status: true, msg: '用户赞过评论列表', data } };
  }

  // TODO 重复操作判断需要全局排查 赞踩数据分离

  // 赞答案
  async likeAnswer(id, meId) {
    let me = await this.ctx.model.User.findById(meId).select('+ likingAnswers');
    // 判断是否已经点赞
    if (!me.likingAnswers.map(id => id.toString()).includes(id)) {
      me.likingAnswers.push(id);
      me.save();
      await this.ctx.model.Answer.findByIdAndUpdate(id, { $inc: { liking: 1 } });
      // -----
      me = await this.ctx.model.User.findById(meId).select('+ dislikingAnswers');
      const index = me.dislikingAnswers.map(id => id.toString()).indexOf(id);
      // 判断是否已经
      if (index > -1) {
        await this.ctx.model.Answer.findByIdAndUpdate(id, { $inc: { disliking: 1 } });
        me.dislikingAnswers.splice(index, 1);
        me.save();
      }
      // -----
      return { code: 200, body: { status: true, msg: '赞成功' } };
    }
    return { code: 200, body: { status: false, msg: '请勿重复点赞' } };
  }

  // 赞评论
  async likeComment(id, meId) {
    let me = await this.ctx.model.User.findById(meId).select('+ likingComments');
    // 判断是否已经点赞
    if (!me.likingComments.map(id => id.toString()).includes(id)) {
      me.likingComments.push(id);
      me.save();
      await this.ctx.model.Comment.findByIdAndUpdate(id, { $inc: { liking: 1 } });
      // -----
      me = await this.ctx.model.User.findById(meId).select('+ dislikingComments');
      const index = me.dislikingComments.map(id => id.toString()).indexOf(id);
      // 判断是否已经
      if (index > -1) {
        await this.ctx.model.Comment.findByIdAndUpdate(id, { $inc: { disliking: 1 } });
        me.dislikingComments.splice(index, 1);
        me.save();
      }
      // -----
      return { code: 200, body: { status: true, msg: '赞成功' } };
    }
    return { code: 200, body: { status: false, msg: '请勿重复点赞' } };
  }

  // 取消赞
  async unlikeAnswer(id, meId) {
    const me = await this.ctx.model.User.findById(meId).select('+ likingAnswers');
    const index = me.likingAnswers.map(id => id.toString()).indexOf(id);
    // 判断是否赞过
    if (index > -1) {
      await this.ctx.model.Answer.findByIdAndUpdate(id, { $inc: { liking: -1 } });
      me.likingAnswers.splice(index, 1);
      me.save();
      return { code: 200, body: { status: true, msg: '已取消赞' } };
    }
    return { code: 200, body: { status: false, msg: '您未对该答案点赞' } };
  }

  // 取消赞评论
  async unlikeComment(id, meId) {
    const me = await this.ctx.model.User.findById(meId).select('+ likingComments');
    const index = me.likingComments.map(id => id.toString()).indexOf(id);
    // 判断是否赞过
    if (index > -1) {
      await this.ctx.model.Comment.findByIdAndUpdate(id, { $inc: { liking: -1 } });
      me.likingComments.splice(index, 1);
      me.save();
      return { code: 200, body: { status: true, msg: '已取消赞' } };
    }
    return { code: 200, body: { status: false, msg: '您未对该评论点赞' } };
  }

  // 获取某个用户的踩过的答案
  async listDislikingAnswers(id) {
    const user = await this.ctx.model.User.findById(id).select('+ dislikingAnswers').populate('dislikingAnswers');
    if (!user) {
      return { code: 200, body: { status: false, msg: '用户不存在' } };
    }
    const data = user.dislikingAnswers;
    return { code: 200, body: { status: true, msg: '获取踩过列表', data } };
  }

  // 获取某个用户的踩过的评论
  async listDislikingComments(id) {
    const user = await this.ctx.model.User.findById(id).select('+ dislikingComments').populate('dislikingComments');
    if (!user) {
      return { code: 200, body: { status: false, msg: '用户不存在' } };
    }
    const data = user.dislikingComments;
    return { code: 200, body: { status: true, msg: '用户踩过评论列表', data } };
  }

  // 踩答案
  async dislikeAnswer(id, meId) {
    let me = await this.ctx.model.User.findById(meId).select('+ dislikingAnswers');
    // 判断是否已经踩过答案
    if (!me.dislikingAnswers.map(id => id.toString()).includes(id)) {
      me.dislikingAnswers.push(id);
      me.save();
      // TODO 有待优化 赞踩互斥逻辑
      // ----
      await this.ctx.model.Answer.findByIdAndUpdate(id, { $inc: { disliking: 1 } });
      // 取消赞
      me = await this.ctx.model.User.findById(meId).select('+ likingAnswers');
      const index = me.likingAnswers.map(id => id.toString()).indexOf(id);
      // 判断是否赞过
      if (index > -1) {
        await this.ctx.model.Answer.findByIdAndUpdate(id, { $inc: { liking: -1 } });
        me.likingAnswers.splice(index, 1);
        me.save();
      }
      // ---
      return { code: 200, body: { status: true, msg: '踩成功' } };
    }
    return { code: 200, body: { status: false, msg: '您已踩过该答案' } };
  }

  // 踩评论
  async dislikeComment(id, meId) {
    let me = await this.ctx.model.User.findById(meId).select('+ dislikingComments');
    // 判断是否已经踩过答案
    if (!me.dislikingComments.map(id => id.toString()).includes(id)) {
      me.dislikingComments.push(id);
      me.save();
      // TODO 有待优化 赞踩互斥逻辑
      // ----
      await this.ctx.model.Comment.findByIdAndUpdate(id, { $inc: { disliking: 1 } });
      // 取消赞
      me = await this.ctx.model.User.findById(meId).select('+ likingComments');
      const index = me.likingComments.map(id => id.toString()).indexOf(id);
      // 判断是否赞过
      if (index > -1) {
        await this.ctx.model.Comment.findByIdAndUpdate(id, { $inc: { liking: -1 } });
        me.likingComments.splice(index, 1);
        me.save();
      }
      // ---
      return { code: 200, body: { status: true, msg: '踩成功' } };
    }
    return { code: 200, body: { status: false, msg: '您已踩过该答案' } };
  }

  // 取消踩
  async undislikeAnswer(id, meId) {
    const me = await this.ctx.model.User.findById(meId).select('+ dislikingAnswers');
    const index = me.dislikingAnswers.map(id => id.toString()).indexOf(id);
    // 判断是否已经
    if (index > -1) {
      await this.ctx.model.Answer.findByIdAndUpdate(id, { $inc: { disliking: -1 } });
      me.dislikingAnswers.splice(index, 1);
      me.save();
      return { code: 200, body: { status: true, msg: '已取消踩' } };
    }
    return { code: 200, body: { status: false, msg: '您未踩过该答案' } };
  }

  // 取消踩评论
  async undislikeComment(id, meId) {
    const me = await this.ctx.model.User.findById(meId).select('+ dislikingComments');
    const index = me.dislikingComments.map(id => id.toString()).indexOf(id);
    // 判断是否踩过
    if (index > -1) {
      await this.ctx.model.Comment.findByIdAndUpdate(id, { $inc: { disliking: -1 } });
      me.dislikingComments.splice(index, 1);
      me.save();
      return { code: 200, body: { status: true, msg: '已取消踩' } };
    }
    return { code: 200, body: { status: false, msg: '您未踩过该评论' } };
  }

  // 获取某个用户的收藏过的答案
  async listCollectingAnswers(id) {
    const user = await this.ctx.model.User.findById(id).select('+ collectingAnswers').populate('collectingAnswers');
    if (!user) {
      return { code: 404, body: { status: false, msg: '用户不存在' } };
    }
    const data = user.collectingAnswers;
    return { code: 200, body: { status: true, msg: '获取收藏列表', data } };
  }

  // 收藏答案
  async CollectAnswer(id, meId) {
    const me = await this.ctx.model.User.findById(meId).select('+ collectingAnswers');
    // 判断是否已经收藏
    if (!me.collectingAnswers.map(id => id.toString()).includes(id)) {
      me.collectingAnswers.push(id);
      me.save();
      return { code: 200, body: { status: true, msg: '收藏成功' } };
    }
    return { code: 404, body: { status: false, msg: '请勿重复收藏' } };
  }

  // 取消收藏答案
  async unCollectAnswer(id, meId) {
    const me = await this.ctx.model.User.findById(meId).select('+ collectingAnswers');
    const index = me.collectingAnswers.map(id => id.toString()).indexOf(id);
    // 判断是否已经收藏
    if (index > -1) {
      me.collectingAnswers.splice(index, 1);
      me.save();
      return { code: 200, body: { status: true, msg: '取消收藏成功' } };
    }
    return { code: 404, body: { status: false, msg: '您未收藏该回答' } };
  }

}

module.exports = UserService;
