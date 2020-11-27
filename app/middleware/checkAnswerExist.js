// 检查答案是否存在
'use strict';

module.exports = () => {
  return async function checkAnswerExist(ctx, next) {
    const answer = await ctx.model.Answer.findById(ctx.params.id).select(
      ' +answerer'
    );
    if (!answer) {
      ctx.status = 404;
      ctx.body = { status: false, msg: '答案不存在' };
      return;
    }
    // 只有改删查答案时候才检查此逻辑，赞，踩 答案时候不检查
    if (ctx.params.questionId && answer.questionId !== ctx.params.questionId) {
      ctx.throw(404, '该问题下没有此答案');
    }
    ctx.state.answer = answer;
    await next();
  };
};
