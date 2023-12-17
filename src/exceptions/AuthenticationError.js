class AuthenticationError extends Error{
    constructor(message, statuscode=400) {
        super(message);
        this.statuscode = 400;
        this.name = 'Authentication Error'
    }
}

module.exports = AuthenticationError;
