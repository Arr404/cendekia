// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();


const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// users
const users = require('./api/user');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/user');

// account
const authentications = require('./api/account');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/account');

// POST
const posts = require('./api/post');
const PostService = require('./services/postgres/PostService')
const PostValidator = require('./validator/post')
const ClientError = require("./exceptions/ClientError");
const init = async () => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const postService = new PostService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('cendekiaone_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: posts,
      options: {
        service: postService,
        PostService,
        validator: PostValidator
      },
    },
  ]);
  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
