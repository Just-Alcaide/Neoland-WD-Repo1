export class User {
    userId
    userName
    userEmail
    userPassword
    userGroups
    userBooks
    userBookProposals
    userBookVotes
    constructor (
        userId,
        userName,
        userEmail,
        userPassword,
    ) {
        this.userId = userName + '_' + String(timestamp.getTime())
        this.userName = userName
        this.userEmail = userEmail
        this.userPassword = userPassword
        this.userGroups = []
        this.userBooks = []
        this.userBookProposals = []
        this.userBookVotes = []
    }
}