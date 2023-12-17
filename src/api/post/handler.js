const ClientError = require('../../exceptions/ClientError');

class PostHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.getPostByFollowingHandler = this.getPostByFollowingHandler.bind(this);
        this.getPostExploreHandler = this.getPostExploreHandler.bind(this);
        this.postPostHandler = this.postPostHandler.bind(this);
        this.updatePostHandler = this.updatePostHandler.bind(this);
        this.deletePostHandler = this.deletePostHandler.bind(this);
        this.getLikeByPostIdHandler = this.getLikeByPostIdHandler.bind(this);
        this.postLikeByPostIdHandler = this.postLikeByPostIdHandler.bind(this);
        this.deleteLikeByPostIdHandler = this.deleteLikeByPostIdHandler.bind(this);
    }

    async getPostByFollowingHandler(request, h) {
        try {
            const { page = 1, itemsPerPage = 5} = request.params;
            const { id: accountId } = request.auth.credentials;
            const data = await this._service.getPostByFollowing({accountId, page, itemsPerPage});
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

    async getPostExploreHandler(request, h) {
        try {
            const {page = 1, itemsPerPage = 5} = request.params;

            const data = await this._service.getPostExplore({page, itemsPerPage});
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

    async postPostHandler(request, h) {
        try {
            this._validator.validatePostPayload(request.payload);
            const {description, kategori, subCategory, picture} = request.payload;
            const { id: accountId } = request.auth.credentials;
            const postId = await this._service.addPost({accountId, description, kategori, subCategory, picture});
            const currentTime = new Date().toLocaleString('en-ID', {timeZone: 'Asia/Jakarta'});
            const response = h.response({
                status: 'post success created',
                message: 'Post berhasil ditambahkan',
                data: {
                    postId,
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

    async updatePostHandler(request, h) {
        try {
            this._validator.validatePostPayload(request.payload);
            const {postId, description, kategori, subCategory, picture} = request.payload;
            const { id: accountId } = request.auth.credentials;
            const postRes = await this._service.updatePost({postId,accountId, description, kategori, subCategory, picture});
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
    async deletePostHandler(request,h){
        try {

            const { postId } = request.payload;
            await this._service.deletePostById({postId});

            return {
                status: 'success',
                message: 'Refresh token berhasil dihapus',
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
    async getLikeByPostIdHandler(request,h){
        try {
            const {postId} = request.params;

            const like = await this._service.getLikeByPostId({postId});
            const currentTime = new Date().toLocaleString('en-ID', {timeZone: 'Asia/Jakarta'});
            return {
                status: 'like post get success',
                data: {
                    like,
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
    async postLikeByPostIdHandler(request,h){
        try {
            const {postId} = request.payload;
            const { id: accountId } = request.auth.credentials;
            await this._service.postLikeByPostId({postId,accountId});
            const currentTime = new Date().toLocaleString('en-ID', {timeZone: 'Asia/Jakarta'});
            const response = h.response({
                status: 'like success created',
                message: 'like berhasil ditambahkan',
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
    async deleteLikeByPostIdHandler(request,h){
        try {
            const {postId} = request.payload;
            const { id: accountId } = request.auth.credentials;
            await this._service.deleteLikeByPostId({postId,accountId});
            const currentTime = new Date().toLocaleString('en-ID', {timeZone: 'Asia/Jakarta'});
            const response = h.response({
                status: 'like success deleted',
                message: 'like berhasil dihapus',
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
}

module.exports = PostHandler;
