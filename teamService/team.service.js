class TeamsService {

    //Hardcoded db
    teams = [{
        id: 1,
        name: "Frontend",
        userIds: [1,2,3]
    },
    {
        id: 2,
        username: "Backend",
        userIds: [4,5,6]
    },
  ]
    async findTeamById(id) {
        const team = this.teams.find((team) => team.id == id)
        return Promise.resolve(team)
    }

    async addUserToTeam(teamId, userId){
        this.teams = this.teams.map((team) => {
            if (team.id == teamId) {
                team.userIds.push(userId)
                return team
            }
        })
        return Promise.resolve()
    }
}

const service = new TeamsService()
module.exports = service