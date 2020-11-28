// 检查评论是否存在
'use strict';

module.exports = () => {
  return async function checkCommentExist(ctx, next) {
    const comment = await ctx.model.Comment.findById(ctx.params.id).select(
      ' +commentator'
    );
    if (!comment) {
      ctx.status = 404;
      ctx.body = { status: false, msg: '评论不存在' };
      return;
    }
    // 只有改删查评论时候才检查此逻辑，赞，踩 评论时候不检查
    if (
      ctx.params.questionId &&
      comment.questionId.toString() !== ctx.params.questionId
    ) {
      ctx.status = 404;
      ctx.body = { status: false, msg: '该问题下没有此评论' };
      return;
    }
    if (
      ctx.params.answerId &&
      comment.answerId.toString() !== ctx.params.answerId
    ) {
      ctx.status = 404;
      ctx.body = { status: false, msg: '该答案下没有此评论' };
      return;
    }
    ctx.state.comment = comment;
    await next();
  };
};
