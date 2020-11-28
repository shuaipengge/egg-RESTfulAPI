// 检查评论是否存在
'use strict';

module.exports = () => {
  return async function checkCommentator(ctx, next) {
    const { comment } = ctx.state;
    if (comment.commentator.toString() !== ctx.state.user._id) {
      ctx.status = 403;
      ctx.body = { status: false, msg: '没有权限' };
      return;
    }
    await next();
  };
};
