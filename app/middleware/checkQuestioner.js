// 检查是否是问题作者
'use strict';

module.exports = () => {
  return async function checkQuestioner(ctx, next) {
    const { question } = ctx.state;
    console.log(question);
    if (question.questioner.toString() !== ctx.state.user._id) {
      ctx.status = 403;
      ctx.body = { status: false, msg: '您没有权限' };
      return;
    }
    await next();
  };
};
