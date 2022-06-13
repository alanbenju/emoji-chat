const UsersService = require('./user.service')
const TeamsService = require('./team.service');
const jwtService = require('./jwt.service');

/**
body: {
    username: string,
    firstName: string,
    teamId?: number
}
 */
exports.createUser = async (req, res) => {
    const userToCreate = req.body;
    // validate userToCreate schema 
    if (userToCreate.teamId) {
        let teamExists = await TeamsService.findTeamById(userToCreate.teamId);
        if (!teamExists) return res.status(400).send({ err: "Team does not exist" })
    }
    try {
        const id = await UsersService.createUser(userToCreate);
        await TeamsService.addUserToTeam(userToCreate.teamId, id);
        res.status(201).send()
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ err })
    }
}

exports.updateTeam = async (req, res) => {
    const { userId, teamId } = req.params
    try {
        await UsersService.updateUserByUsername(userId, { teamId })
        res.status(200).send()
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ err })
    }

}

exports.findUserByUsername = async (req, res) => {
    const { username } = req.query
    try {
        const teamId = await UsersService.findTeamByUsername(username);
        res.status(200).send({ teamId })
    }
    catch (err) {
        console.log(err)
        res.status(404).send({ err })
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body

    console.log("User trying to login:", username)
    try {
        const token = await UsersService.login(username, password)
        res.status(200).send( { token })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ err })
    }
}

exports.getTeammates = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1] // TODO: in middleware
    const user = await jwtService.verify(token);
    console.log("get teammates from user", user)
    try {
        const users = await UsersService.getTeammates(user.id, user.teamId)
        res.status(200).send( { users })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ err })
    }    
}