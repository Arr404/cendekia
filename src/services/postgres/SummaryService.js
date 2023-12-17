const {Pool} = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class SummaryService{
    constructor(props) {
        this._pool = new Pool();
    }
    async getSummaryByPostId({PostID}){
        const query = {
            text    : 'SELECT description FROM posts WHERE id = $1 ',
            values  :[PostID]
        }
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new InvariantError('User tidak ditemukan');
        }
        return result.rows;
    }
}

module.exports = Su
