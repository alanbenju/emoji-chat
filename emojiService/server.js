const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { verifyToken } = require('./middlewares');
const io = new Server(server);


/**
 * Some front for testing
 */
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

io.use(verifyToken);

io.on('connection', async (socket) => {

    const {
        username,
        teamId
    } = socket.tokenData
    console.log(username, 'is now connected with id', socket.id);

    socket.join(teamId)
    console.log(username, "is now connected to team: ", teamId)

    socket.to(teamId).emit("user:connected", { username: username, id: socket.id })

    let connectedSocketsInTeam = await io.in(teamId).fetchSockets();
    const connectedTeammates = connectedSocketsInTeam.map((connectedSocket) => { return { id: connectedSocket.id, username: connectedSocket.username } }).filter((user)=>user.id!=socket.id)
    io.to(socket.id).emit("team:connected", { teammates: connectedTeammates})

    socket.on('emoji:private', (msg, cb) => sendPrivateEmoji(msg, username, cb));
    socket.on('emoji:team', (msg, cb) => sendTeamEmoji(msg, username, cb));

    socket.on("disconnect", () => {
        console.log("disconnected", username, socket.id);
    });

})

io.on('disconnect', (socket) => {
    console.log(username, 'is now disconnected with id', socket.id);
})
server.listen(3000, () => {
    console.log('listening on port 3000');
});


/**
 * 
 * @param {*} message {to, emojiId}
 * to: nickname: string
 * emojiId: id of emoji: number
 */
function sendPrivateEmoji(message, usernameFrom, acknowledgement) {
    console.log(message, "from", usernameFrom)
    acknowledgement({
        status: "ok"
    });
    // TODO: save in database
    io.to(message.to).emit("emoji:private", { from: usernameFrom, emojiId: message.value  })

}

/**
 * 
 * @param {*} message {to, emojiId}
 * emojiId: id of emoji: number
 */
function sendTeamEmoji(message, usernameFrom, acknowledgement) {
    acknowledgement({
        status: "ok"
    });
    // TODO:
    // send acknowledgement to message.from
    // save in database
    // send emojiId to team room
}