// 检查是否是管理员
'use strict';

module.exports = () => {
  return async function checkAdmin(ctx, next) {
    if (ctx.state.user.status < 99) {
      ctx.status = 403;
      ctx.body = { status: false, msg: '抱歉您没有权限' };
      return;
    }
    await next();
  };
};
