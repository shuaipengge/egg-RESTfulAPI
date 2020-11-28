'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const checkUserExist = app.middleware.checkUserExist();
  const checkTopicExist = app.middleware.checkTopicExist();
  const checkQuestionExist = app.middleware.checkQuestionExist();
  const checkQuestioner = app.middleware.checkQuestioner();
  const checkAnswerExist = app.middleware.checkAnswerExist();
  const checkAnswerer = app.middleware.checkAnswerer();
  const checkCommentExist = app.middleware.checkCommentExist();
  const checkCommentator = app.middleware.checkCommentator();

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

  // user -> Question
  router.get('/api/v1/user/:id/questions', controller.user.listQuestion);

  // user -> Answer
  router.get('/api/v1/user/:id/likingAnswer', controller.user.listLikingAnswers);
  router.get('/api/v1/user/:id/dislikingAnswer', controller.user.listDislikingAnswers);
  router.put('/api/v1/user/likingAnswer/:id', app.jwt, checkAnswerExist, controller.user.likeAnswer);
  router.put('/api/v1/user/dislikingAnswer/:id', app.jwt, checkAnswerExist, controller.user.dislikeAnswer);
  router.delete('/api/v1/user/likingAnswer/:id', app.jwt, checkAnswerExist, controller.user.unlikeAnswer);
  router.delete('/api/v1/user/dislikingAnswer/:id', app.jwt, checkAnswerExist, controller.user.undislikeAnswer);
  router.get('/api/v1/user/:id/collectingAnswer', controller.user.listCollectingAnswers);
  router.put('/api/v1/user/collectingAnswer/:id', app.jwt, checkAnswerExist, controller.user.CollectAnswer);
  router.delete('/api/v1/user/collectingAnswer/:id', app.jwt, checkAnswerExist, controller.user.unCollectAnswer);

  // Topic
  router.get('/api/v1/topic', controller.topic.find);
  router.post('/api/v1/topic', controller.topic.create);
  router.get('/api/v1/topic/:id', checkTopicExist, controller.topic.findById);
  router.get('/api/v1/topic/:id/followers', checkTopicExist, controller.topic.listTopicFollowers);
  router.put('/api/v1/topic/:id', checkTopicExist, controller.topic.update);
  router.get('/api/v1/topic/:id/questions', controller.topic.listQuestion);

  // Question
  router.get('/api/v1/question', controller.question.find);
  router.get('/api/v1/question/:id', checkQuestionExist, controller.question.findById);
  router.put('/api/v1/question/:id', app.jwt, checkQuestionExist, checkQuestioner, controller.question.update);
  router.delete('/api/v1/question/:id', app.jwt, checkQuestionExist, checkQuestioner, controller.question.delete);
  router.post('/api/v1/question', app.jwt, controller.question.create);

  // Answer
  router.get('/api/v1/question/:questionId/answer', controller.answer.find);
  router.get('/api/v1/answer/:id', checkAnswerExist, controller.answer.findById);
  router.post('/api/v1/question/:questionId/answer', app.jwt, checkQuestionExist, controller.answer.create);
  router.put('/api/v1/question/:questionId/answer/:id', app.jwt, checkAnswerExist, checkAnswerer, controller.answer.update);
  router.delete('/api/v1/question/:questionId/answer/:id', app.jwt, checkAnswerExist, checkAnswerer, controller.answer.delete);

  // Comment
  router.get('/api/v1/questions/:questionId/answers/:answerId/comments', controller.comment.find);
  router.post('/api/v1/questions/:questionId/answers/:answerId/comments', app.jwt, controller.comment.create);
  router.get('/api/v1/questions/:questionId/answers/:answerId/comments/:id', checkCommentExist, controller.comment.findById);
  router.put('/api/v1/questions/:questionId/answers/:answerId/comments/:id', app.jwt, checkCommentExist, checkCommentator, controller.comment.update);
  router.delete('/api/v1/questions/:questionId/answers/:answerId/comments/:id', app.jwt, checkCommentExist, checkCommentator, controller.comment.delete);
};
