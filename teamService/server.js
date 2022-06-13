const express = require('express');
const app = express();
var bodyParser = require('body-parser')
const { findOneById, addUserToTeam } = require('./team.controller');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/:id', findOneById);
app.put('/:teamId/user/:userId', addUserToTeam);


app.listen(3002, () => {
    console.log('Team service listening on port 3002');
});