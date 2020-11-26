'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const checkUserExist = app.middleware.checkUserExist();
  const checkTopicExist = app.middleware.checkTopicExist();

  const { router, controller } = app;
  router.get('/', controller.home.index);

  // User
  router.resources('user', '/api/v1/user', controller.user);
  router.post('/api/v1/user/login', controller.user.login);
  router.delete('/api/v1/user/delete/:id', app.jwt, controller.user.deleteUser);
  router.put('/api/v1/user/update/:id', app.jwt, controller.user.updateUser);
  router.get('/api/v1/user/:id/following', controller.user.listFollowing);
  router.get('/api/v1/user/:id/followers', controller.user.listFollowers);
  router.get('/api/v1/user/:id/followers', controller.user.listFollowers);
  router.put('/api/v1/user/following/:id', app.jwt, checkUserExist, controller.user.follow);
  router.delete('/api/v1/user/following/:id', app.jwt, checkUserExist, controller.user.unfollow);

  // User -> Topic
  router.put('/api/v1/user/followingTopics/:id', app.jwt, checkTopicExist, controller.user.followTopic);
  router.delete('/api/v1/user/followingTopics/:id', app.jwt, checkTopicExist, controller.user.unfollowTopic);
  router.get('/api/v1/user/:id/followingTopics', controller.user.listFollowingTopics);

  // Topic
  router.get('/api/v1/topic', controller.topic.find);
  router.post('/api/v1/topic', controller.topic.create);
  router.get('/api/v1/topic/:id', checkTopicExist, controller.topic.findById);
  router.get('/api/v1/topic/:id/followers', checkTopicExist, controller.topic.listTopicFollowers);
  router.put('/api/v1/topic/:id', checkTopicExist, controller.topic.update);

};
