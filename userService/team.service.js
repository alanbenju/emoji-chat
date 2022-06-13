const { default: axios } = require("axios")

class TeamsService {

    async findTeamById(id) {
        const response = await axios.get('http://localhost:3002/'+id)
        return response.data;
    }
    async addUserToTeam(teamId, userId) {
        return await axios.put('http://localhost:3002/'+teamId+"/user/"+userId)
    }
}

const service = new TeamsService()
module.exports = service