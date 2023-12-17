const {Pool} = require('pg')
const {nanoid} = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const {use} = require("bcrypt/promises");

class PostService {
    constructor() {
        this._pool = new Pool();
    }
    async getUserIdFromAccountId(accountId){
        const queryUserDetail = {
            text: 'SELECT * FROM "user" WHERE "accountId" = $1',
            values: [accountId]
        };
        const resUser = await this._pool.query(queryUserDetail)
        if (!resUser.rows.length) {
            throw new NotFoundError('Gagal mencari user. user tidak ditemukan');
        }
        return resUser.rows[0].id
    }
    async getPostByFollowing({ accountId, page, itemsPerPage }) {
        const userId = await this.getUserIdFromAccountId(accountId)
        const queryFollowPost = {
            text:
                'SELECT * FROM posts ' +
                'WHERE "userId" IN (SELECT "userIdFollow" FROM follow WHERE "userId" = $1) ' +
                'ORDER BY "createdAt" DESC ' +
                'LIMIT $3 OFFSET ($2 - 1) * $3',
            values: [userId, page, itemsPerPage]
        };
        const result = await this._pool.query(queryFollowPost);
        if (!result) {
            throw new NotFoundError('Post tidak ada');
        }

        return result.rows;
    }

    //TODO set getpostexplore from kategori
    async getPostExplore({page, itemsPerPage}) {
        const queryExplorePost = {
            text: 'SELECT * FROM posts ' +
                  'ORDER BY "createdAt" DESC ' +
                  'LIMIT $2 OFFSET ($1 - 1) * $2',
            values: [page, itemsPerPage]
        }
        const result = await this._pool.query(queryExplorePost)
        if (!result) {
            throw new NotFoundError('Post tidak ditemukan');
        }

        return result.rows;
    }

    async addPost({accountId, description, kategori, subCategory, picture}) {
        const userId = await this.getUserIdFromAccountId(accountId)
        const id = `postID-${nanoid(16)}`
        const createdAt = new Date().toLocaleString('en-ID', {timeZone: 'Asia/Jakarta'})

        const queryAddPage = {
            text: 'INSERT INTO posts VALUES($1,$2,$3,$4,$5,$6,$7)',
            values: [id, userId, description, kategori, subCategory, picture, createdAt]
        }
        const post = await this._pool.query(queryAddPage);
        console.log(post)
        if (!post) {
            throw new InvariantError('post gagal ditambahkan');
        }
        return id
    }

    async updatePost({postId, accountId, description, kategori, subCategory, picture}) {
        const createdAt = new Date().toLocaleString('en-ID', {timeZone: 'Asia/Jakarta'})
        const userId = await this.getUserIdFromAccountId(accountId)
        const queryAddPage = {
            text: 'UPDATE posts ' +
                  'SET "userId" = $2, description = $3,kategori = $4, subCategory = $5, picture = $6, "createdAt" = $7 ' +
                  'WHERE id=$1',
            values: [postId, userId, description, kategori, subCategory, picture, createdAt]
        }
        await this._pool.query(queryAddPage);
        if (!result) {
            throw new NotFoundError('Gagal memperbarui post. post tidak ditemukan');
        }
    }

    async deletePostById({postId}) {
        const queryDelete = {
            text: 'DELETE FROM posts WHERE id=$1',
            values: [postId]
        }
        const result= await this._pool.query(queryDelete);
        if (!result) {
            throw new NotFoundError('Gagal menghapus post. post tidak ditemukan');
        }
    }
    async getLikeByPostId({postId}){
        const queryLike = {
            text: 'SELECT COUNT("userId") FROM like WHERE "postId" = $1',
            values: [postId]
        }
        return await this._pool.query(queryLike)
    }

    async postLikeByPostId({postId,accountId}){
        const userId = await this.getUserIdFromAccountId(accountId)
        const queryPostLike = {
            text: 'INSERT INTO like VALUES($1,$2)',
            values: [postId,userId]
        }
        await this._pool.query(queryPostLike);
        // if (!result) {
        //     throw new NotFoundError('Gagal menglike post. post/user tidak ditemukan');
        // }
    }
    async deleteLikeByPostId({postId, accountId}){
        const userId = await this.getUserIdFromAccountId(accountId)
        const queryDeleteLike = {
            text: 'DELETE FROM like WHERE("postId" = $1 AND "userId" = $2)',
            values: [postId,userId]
        }
        await this._pool.query(queryDeleteLike);
        if (!result) {
            throw new NotFoundError('Gagal menghapus like post. post/user tidak ditemukan');
        }
    }
}

module.exports = PostService;
