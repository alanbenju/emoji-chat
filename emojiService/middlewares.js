const UsersService = require("./services/usersService")
const jwtService = require("./services/jwt.service")

function verifyToken(socket, next) {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error("User not logged in"));
    }

    jwtService.verify(token, function (err, user) {
        if (err) {
            console.log(err)
            return next(new Error("Invalid token"));
        }
        socket.tokenData = user;
        socket.username = user.username
        next();
    });
}

module.exports = {
    verifyToken
}