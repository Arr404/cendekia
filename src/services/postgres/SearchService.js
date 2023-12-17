const {Pool} = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class SearchService{
    constructor(props) {
        this._pool = new Pool();
    }
    async getUserBySearch({search,page,itemsPerPage}){
        const query = {
            text    : 'SELECT * FROM "user" WHERE username LIKE %$1% ' +
                      'LIMIT $2 OFFSET ($1 - 1) * $2 ',
            values  :[search,page,itemsPerPage]
        }
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new InvariantError('User tidak ditemukan');
        }
        return result
    }
}

module.exports = SearchService
