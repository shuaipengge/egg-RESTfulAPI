// 检查用户是否存在
'use strict';

module.exports = () => {
  return async function checkUserExist(ctx, next) {
    const user = await ctx.model.User.findById(ctx.params.id);
    if (!user) {
      ctx.status = 404;
      ctx.body = { status: false, msg: '您关注的用户不存在' };
      return;
    }
    await next();
  };
};
