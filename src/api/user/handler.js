const ClientError = require('../../exceptions/ClientError');

class AccountHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.getAllUserHandler = this.getAllUserHandler.bind(this);
        this.updateUserProfileHandler = this.updateUserProfileHandler.bind(this);
        this.addUserFollowHandler = this.addUserFollowHandler.bind(this);
        this.getUserFollowersList = this.getUserFollowersList.bind(this);
        this.getUserFollowingsList = this.getUserFollowingsList.bind(this);
        this.getPostByUserSaveHandler = this.getPostByUserSaveHandler.bind(this);
        this.getUserDetailByIdHandler = this.getUserDetailByIdHandler.bind(this);
    }


    async getAllUserHandler(request, h) {
        try {
            const {page = 1, itemsPerPage = 5} = request.params;

            const data = await this._service.getAllUser({page, itemsPerPage});
            const currentTime = new Date().toLocaleString('en-ID', {timeZone: 'Asia/Jakarta'});
            return {
                status: 'post get success',
                data,
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

    async updateUserProfileHandler(request, h) {
        try {
            this._validator.validatePostPayload(request.payload);
            const { name, picture, bio} = request.payload;
            const { id: accountId } = request.auth.credentials;
            const postRes = await this._service.updateUserProfile({accountId, name, picture, bio});
            const currentTime = new Date().toLocaleString('en-ID', {timeZone: 'Asia/Jakarta'});
            const response = h.response({
                status: 'post success created',
                message: 'Post berhasil ditambahkan',
                data: {
                    postRes,
                },
                createdAt: currentTime
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async addUserFollowHandler(request, h) {
        try {
            const {userId, userIdFollow} = request.payload;
            await this._service.addUserFollow({userId, userIdFollow});
            const currentTime = new Date().toLocaleString('en-ID', {timeZone: 'Asia/Jakarta'});
            const response = h.response({
                status: 'follow success created',
                message: 'follow berhasil ditambahkan',
                createdAt: currentTime
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async getUserFollowersList(request, h) {
        try {
            const {userId} = request.params;

            const data = await this._service.getUserFollowers({userId});
            const currentTime = new Date().toLocaleString('en-ID', {timeZone: 'Asia/Jakarta'});
            return {
                status: 'follower list get success',
                data,
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

    async getUserFollowingsList(request, h) {
        try {
            const {userId} = request.params;

            const data = await this._service.getUserFollowing({userId});
            const currentTime = new Date().toLocaleString('en-ID', {timeZone: 'Asia/Jakarta'});
            return {
                status: 'following list get success',
                data,
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

    async getPostByUserSaveHandler(request, h) {
        try {
            const {userId} = request.params;

            const data = await this._service.getPostSave({userId});
            const currentTime = new Date().toLocaleString('en-ID', {timeZone: 'Asia/Jakarta'});
            return {
                status: 'get post save success',
                data,
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

    async getUserDetailByIdHandler(request, h) {
        try {
            const { id: accountId } = request.auth.credentials;
            const data = await this._service.getUserDetailById(accountId);
            const currentTime = new Date().toLocaleString('en-ID', {timeZone: 'Asia/Jakarta'});
            return {
                status: 'get user detail success',
                data,
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
