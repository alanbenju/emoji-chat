const express = require('express');
const app = express();
var bodyParser = require('body-parser')
var cors = require('cors');

const { createUser, updateTeam, findUserByUsername, login, getTeammates } = require('./user.controller');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

app.post('/', createUser);
app.put('/:userId/team/:teamId', updateTeam);
app.get('/', findUserByUsername);
app.put('/login', login);
app.get('/teammates', getTeammates);



app.listen(3001, () => {
    console.log('User service listening on port 3001');
});