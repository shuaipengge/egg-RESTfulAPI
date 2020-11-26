// 检查问题是否存在
'use strict';

module.exports = () => {
  return async function checkQuestionExist(ctx, next) {
    const question = await ctx.model.Question.findById(ctx.params.id).select(' + questioner');
    if (!question) {
      ctx.status = 404;
      ctx.body = { status: false, msg: '问题不存在' };
      return;
    }
    ctx.state.question = question;
    await next();
  };
};
