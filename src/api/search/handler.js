const ClientError = require('../../exceptions/ClientError');

class AccountHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getUserSearchHandler = this.getUserSearchHandler.bind(this);
  }

  async getUserSearchHandler(request, h) {
    try {
      const { search,page = 1,itemsPerPage = 5} = request.params;
      const user = await this._service.getUserBySearch({search,page,itemsPerPage});
      const currentTime = new Date().toLocaleString('en-ID', {timeZone: 'Asia/Jakarta'});
      return {
        status: 'success',
        data: {
          user,
        },
        createdAt: currentTime
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
