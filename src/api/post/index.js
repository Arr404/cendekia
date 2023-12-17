const PostHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'post',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const postHandler = new PostHandler(service, validator);
    server.route(routes(postHandler));
  },
};
