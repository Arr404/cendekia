const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const {readFileSync} = require("fs");
require('dotenv').config();
const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  // this object will be passed to the TLSSocket constructor
  ssl: {
    rejectUnauthorized: false,
    ca: readFileSync('./ca-certificate.crt').toString(),
  },
}

class AuthenticationsService {
  constructor() {
    this._pool = new Pool(config);
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);

    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
