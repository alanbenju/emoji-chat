const jwt = require('jsonwebtoken'),
    tokenSecret = "thisissecretyesverysecret"; // use env variables

module.exports = {
    issue(payload) {
        return jwt.sign(
            payload,
            tokenSecret,
            {
                expiresIn: "30 days" // env variable
            });
    },

    // Verifies token on a request
    verify(token) {
        return new Promise((resolve, reject) =>
            jwt.verify(token, tokenSecret, (err, decoded) => err ? reject({}) :
                resolve(decoded))
        );
    }
};