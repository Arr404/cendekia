const ClientError = require('../../exceptions/ClientError');

class AccountHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getSummaryByPostIdHandler = this.getSummaryByPostIdHandler.bind(this);
  }

  async getSummaryByPostIdHandler(request, h) {
    try {
      const { postId } = request.params;
      const user = await this._service.getSummaryByPostId({postId});
      return {
        status: 'success',
        data: {
          user,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = AccountHandler;
