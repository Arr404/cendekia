const routes = (handler) => [
  {
    method: 'GET',
    path: '/search',
    handler: handler.getUserSearchHandler,
  }
];

module.exports = routes;
