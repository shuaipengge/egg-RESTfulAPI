// 检查话题是否存在
'use strict';

module.exports = () => {
  return async function checkTopicExist(ctx, next) {
    const topic = await ctx.model.Topic.findById(ctx.params.id);
    if (!topic) {
      ctx.status = 404;
      ctx.body = { status: false, msg: '话题不存在' };
      return;
    }
    await next();
  };
};
