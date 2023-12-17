const AccountHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'search',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const accountHandler = new AccountHandler(service, validator);
    server.route(routes(accountHandler));
  },
};
