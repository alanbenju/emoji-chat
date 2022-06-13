const TeamsService = require('./team.service')

exports.findOneById = async (req, res) => {
    const id = req.params.id;
    try {
        const team = await TeamsService.findTeamById(id);
        res.status(201).send(team)
    }
    catch (err) {
        console.log(err) //TODO: log lib
        res.status(500).send({ err })
    }
}

exports.addUserToTeam = async (req, res) => {
    const { userId, teamId } = req.params
    try{
        await TeamsService.addUserToTeam(teamId, userId)
        res.status(200).send()
    }
    catch(err){
        console.log(err)
        res.status(500).send({err})
    }

}
