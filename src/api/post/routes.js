const routes = (handler) => [
  {
    method: 'GET',
    path: '/post',
    handler: handler.getPostByFollowingHandler,
    options: {
      auth: 'cendekiaone_jwt',
    },
  },
  {
    method: 'GET',
    path: '/explore',
    handler: handler.getPostExploreHandler,
  },
  {
    method: 'POST',
    path: '/post',
    handler: handler.postPostHandler,
    options: {
      auth: 'cendekiaone_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/post',
    handler: handler.updatePostHandler,
    options: {
      auth: 'cendekiaone_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/post',
    handler: handler.deletePostHandler,
    options: {
      auth: 'cendekiaone_jwt',
    },
  },
  {
    method: 'GET',
    path: '/post/like',
    handler: handler.getLikeByPostIdHandler,
  },
  {
    method: 'POST',
    path: '/post/like',
    handler: handler.postLikeByPostIdHandler,
    options: {
      auth: 'cendekiaone_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/post/like',
    handler: handler.deleteLikeByPostIdHandler,
    options: {
      auth: 'cendekiaone_jwt',
    },
  },
];

module.exports = routes;
