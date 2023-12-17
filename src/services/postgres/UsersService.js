const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const {use} = require("bcrypt/promises");



class UsersService {
    constructor() {
        this._pool = new Pool();
    }

    async addUser({ name,username,email, password}) {
        await this.verifyNewUsername(email);
        const idAcc = `Acc-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const queryAccount = {
            text    : 'INSERT INTO account VALUES ($1,$2,$3) RETURNING id',
            values  : [idAcc,email,hashedPassword]
        }
        const resultAccount = await this._pool.query(queryAccount);

        if (!resultAccount.rows.length) {
            throw new InvariantError('User Account gagal ditambahkan');
        }

        const id = `user-${nanoid(16)}`;
        const currentTime = new Date().toLocaleString('en-ID', {timeZone: 'Asia/Jakarta'});
        const picture = null;
        const bio = null;
        const accountId = resultAccount.rows[0].id.toString()
        const query = {
            text: 'INSERT INTO "user" VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING id',
            values: [id, name, picture, username, bio, accountId,currentTime],
        };
        const result = await this._pool.query(query);
        // Process the result or return it as needed
        if (!result) {
            throw new InvariantError('User gagal ditambahkan');
        }
        return result.rows[0].id;
    }

    async verifyNewUsername(username) {
        const query = {
            text: 'SELECT email FROM account WHERE email = $1',
            values: [username],
        };

        const result = await this._pool.query(query);

        if (result.rows.length > 0) {
            throw new InvariantError('Gagal menambahkan user. Email sudah digunakan.');
        }
    }

    async getUserById(accountId) {
        const userId = await this.getUserIdFromAccountId(accountId)
        const query = {
            text: 'SELECT id, username, fullname FROM user WHERE id = $1',
            values: [userId],
        };

        const result = await this._pool.query(query);

        if (!result) {
            throw new NotFoundError('User tidak ditemukan');
        }

        return result.rows[0];
    }

    async verifyUserCredential(email, password) {
        const query = {
            text: 'SELECT id, password FROM account WHERE email = $1',
            values: [email],
        };

        const result = await this._pool.query(query);
        if (!result) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }

        const {id, password: hashedPassword} = result.rows[0];

        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }

        return id;
    }

    async getAllUser({page, itemsPerPage}) {
        const query = {
            text: 'SELECT * FROM "user" LIMIT $2 OFFSET ($1 - 1) * $2',
            values: [page, itemsPerPage]
        }
        const result = await this._pool.query(query)

        if (!result) {
            throw new NotFoundError('User tidak ditemukan');
        }

        return result.rows;
    }

    async updateUserProfile({accountId, name, picture, bio}) {
        const userId = await this.getUserIdFromAccountId(accountId)
        const query = {
            text: 'SELECT * FROM "user" WHERE id = $1',
            values: [userId]
        }
        const userProfile = await this._pool.query(query)
        if (!userProfile.rows.length) {
            throw new NotFoundError('User tidak ditemukan');
        }
        const nameNew = name ? name : userProfile.rows[0].name
        const pictureNew = picture ? picture : userProfile.rows[0].picture
        const bioNew = bio ? bio : userProfile.rows[0].bio
        const queryUpdate = {
            text: 'UPDATE "user" ' +
                'SET name = $2, picture = $3, bio = $4' +
                'WHERE id = $1 RETURN id',
            values: [userId, nameNew, pictureNew, bioNew]
        }
        const result = await this._pool.query(queryUpdate);

        if (!result) {
            throw new NotFoundError('Gagal memperbarui user. user tidak ditemukan');
        }
    }

    async addUserFollow({userId, userIdFollow}) {
        const query = {
            text: 'INSERT INTO follow VALUES($1,$2)',
            values: [userId, userIdFollow]
        }

        await this._pool.query(query);
    }

    async getUserFollowers({userId}) {
        const query = {
            text: 'SELECT * FROM follow ' +
                'INNER JOIN "user" ON follow."userId" = "user".id ' +
                'WHERE follow."userIdFollow" = $1',
            values: [userId]
        }

        return await this._pool.query(query);
    }

    async getUserFollowing({userId}) {
        const query = {
            text: 'SELECT * FROM follow ' +
                  'INNER JOIN "user" ON follow."userIdFollow" = "user".id ' +
                  'WHERE follow."userId" = $1',
            values: [userId]
        }

        return await this._pool.query(query);
    }
    async getPostSave({userId}){
        const query = {
            text   : 'SELECT * FROM save ' +
                     'INNER JOIN posts ON save."postId" = posts.id' +
                     'WHERE "userId" = $1 ',
            values : [userId]
        }
        return await this._pool.query(query);
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
    async getUserDetailById(accountId){

        console.log(accountId)
        const queryUserDetail = {
            text: 'SELECT * FROM "user" WHERE "accountId" = $1',
            values: [accountId]
        };
        const resUser = await this._pool.query(queryUserDetail)
        if (!resUser.rows.length) {
            throw new NotFoundError('Gagal mencari user. user tidak ditemukan');
        }
        const userId = resUser.rows[0].id
        const queryPostDetail = {
            text: 'SELECT * FROM posts WHERE "userId" = $1',
            values: [userId]
        };
        const queryFollowCount = {
            text: 'SELECT COUNT("userIdFollow") FROM follow WHERE "userId" = $1',
            values: [userId]
        };
        const queryFollowingCount = {
            text: 'SELECT COUNT("userId") FROM follow WHERE "userId" = $1',
            values: [userId]
        };

        const [userDetail, userPost, userFollowCount, userFollowingCount] = await Promise.all([
            this._pool.query(queryUserDetail),
            this._pool.query(queryPostDetail),
            this._pool.query(queryFollowCount),
            this._pool.query(queryFollowingCount)
        ]);

        const userDetailResult = userDetail.rows;
        const userPostResult = userPost.rows;
        const userFollowCountResult = userFollowCount.rows[0].count;
        const userFollowingCountResult = userFollowingCount.rows[0].count;

        const combinedResult = {
            userDetail: userDetailResult,
            userPost: userPostResult,
            userFollowCount: userFollowCountResult,
            userFollowingCount: userFollowingCountResult
        };

        return combinedResult;

    }
}

module.exports = UsersService;
