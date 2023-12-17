const routes = (handler) => [
  {
    method: 'GET',
    path: '/user',
    handler: handler.getAllUserHandler,
    options: {
      auth: 'cendekiaone_jwt',
    },
  },
  {
    method: 'GET',
    path: '/user/detail',
    handler: handler.getUserDetailByIdHandler,
    options: {
      auth: 'cendekiaone_jwt',
    },
  },
  {
    method: 'POST',
    path: '/user/update-profile',
    handler: handler.updateUserProfileHandler,
    options: {
      auth: 'cendekiaone_jwt',
    },
  },
  {
    method: 'POST',
    path: '/user/follow',
    handler: handler.addUserFollowHandler,
    options: {
      auth: 'cendekiaone_jwt',
    },
  },
  {
    method: 'GET',
    path: '/user/followers-list',
    handler: handler.getUserFollowersList,
    options: {
      auth: 'cendekiaone_jwt',
    },
  },
  {
    method: 'GET',
    path: '/user/followings-list',
    handler: handler.getUserFollowingsList,
    options: {
      auth: 'cendekiaone_jwt',
    },
  },
  {
    method: 'GET',
    path: '/user/save',
    handler: handler.getPostByUserSaveHandler,
    options: {
      auth: 'cendekiaone_jwt',
    },
  },
];

module.exports = routes;
