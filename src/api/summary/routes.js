const routes = (handler) => [
  {
    method: 'GET',
    path: '/summary',
    handler: handler.getSummaryByPostIdHandler,
  }
];

module.exports = routes;
