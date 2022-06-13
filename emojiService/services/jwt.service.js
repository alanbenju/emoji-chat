const jwt = require('jsonwebtoken'),
    tokenSecret = "thisissecretyesverysecret"; // use env variables

module.exports = {
    // Verifies token on a request
    verify(token, callback) {
        return jwt.verify(
            token,
            tokenSecret,
            {},
            callback
        );
    }
};