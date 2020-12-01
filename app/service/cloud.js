'use strict';

const Service = require('egg').Service;
const StsClient = require('@alicloud/sts-sdk');

class CloudService extends Service {
  async getStsToken(query) {
    const { accountID, roleName } = query;
    const {
      endpoint,
      accessKeyId,
      accessKeySecret,
    } = this.config.sts;
    const sts = new StsClient({
      endpoint,
      accessKeyId,
      accessKeySecret,
    });
    /**
     * assumeRole(RoleArn,RoleSessionName)
     * RoleArn:指定角色的ARN。格式：acs:ram::$accountID:role/$roleName 。
     * RoleSessionName: 用户自定义参数。此参数用来区分不同的令牌，可用于用户级别的访问审计。
     */
    const res1 = await sts.assumeRole(
      `acs:ram::${accountID}:role/${roleName}`,
      'client_web'
    );
    if (res1.Credentials.SecurityToken) {
      const res2 = await sts.getCallerIdentity();
      console.log(res2);
      return { code: 200, body: { status: true, msg: '获取成功', data: res1.Credentials } };
    }
    return { code: 200, body: { status: true, msg: '获取失败' } };
  }
}

module.exports = CloudService;
