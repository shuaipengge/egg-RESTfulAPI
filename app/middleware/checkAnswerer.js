// 检查是否是答案作者
'use strict';

module.exports = () => {
  return async function checkAnswerer(ctx, next) {
    const { answer } = ctx.state;
    if (answer.answerer.toString() !== ctx.state.user._id) {
      ctx.status = 403;
      ctx.body = { status: false, msg: '没有权限' };
      return;
    }
    await next();
  };
};
