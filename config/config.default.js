/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1606221621840_7108';

  // add your middleware config here
  // 加载 errorHandler 中间件
  config.middleware = [ 'errorHandler' ];

  // 只对 /api 前缀的 url 路径生效
  config.errorHandler = {
    match: '/api',
  };

  // 密码加密
  config.bcrypt = {
    saltRounds: 10,
  };

  config.mongoose = {
    client: {
      // url:'mongodb://admin:123456@localhost:27017/test'
      url: 'mongodb://admin:2020testone@47.92.89.244:27017/admin',
      options: {
        useUnifiedTopology: true,
      },
    },
  };

  // 关闭安全威胁csrf防范
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // STS - OSS
  config.sts = {
    endpoint: 'sts.aliyuncs.com', // check this from sts console
    accessKeyId: 'LTAI4GFu5VVoS2zahAa2qZQx', // check this from aliyun console
    accessKeySecret: 'xjxKgA2UX1dOr1Y8jZACH22wtzSFhO', // check this from aliyun console
  };

  config.jwt = {
    secret: '123456',
    expiresIn: '24h',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
