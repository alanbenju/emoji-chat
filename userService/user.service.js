const jwtService = require('./jwt.service')

class UsersService {

    //Hardcoded db
    users = [{
        id: 1,
        username: "Alan",
        teamId: 1
    },
    {
        id: 2,
        username: "Kevin",
        teamId: 1
    },
    {
        id: 3,
        username: "Harriet",
        teamId: 1
    },
    {
        id: 4,
        username: "Jim",
        teamId: 2
    },
    {
        id: 5,
        username: "Pam",
        teamId: 2
    },
    {
        id: 6,
        username: "Kelly",
        teamId: 2
    }]
    async findTeamByUsername(username) {
        const user = this.users.find((user) => user.username.toLowerCase() == username.toLowerCase())
        return Promise.resolve(user.teamId)
    }
    async createUser(userToCreate) {
        const userWithUsername = await this.findTeamByUsername(userToCreate.username)
        if (userWithUsername) throw Error("Username used") // TODO: throw custom error
        userToCreate.id = this.users.length + 1 // testing purpose
        this.users.push(userToCreate)
        return Promise.resolve(this.users.length)
    }

    async updateUserByUsername(username, userToUpdate) {
        this.users = this.users.map((user) => {
            if (user.username == username) {
                user = {
                    ...user,
                    ...userToUpdate
                }
                return user
            }
        })
        return Promise.resolve()
    }

    async login(username, password){
        if (!username || !password) {
            throw Error("no user or pass")
        }

        const user = this.users.find((user) => user.username.toLowerCase() == username.toLowerCase())
    
        // TODO:  find user in db
        // check if user exists
        // compare passwords with bcrypt

        var token = jwtService.issue({
            username: username,
            teamId: user.teamId,
            id: user.id
        })

        return Promise.resolve(token)
    }

    async getTeammates(id, teamId) {
        const users = this.users.filter((user) => user.teamId == teamId && user.id != id)
        return Promise.resolve(users)
    }
}

const service = new UsersService()
module.exports = service