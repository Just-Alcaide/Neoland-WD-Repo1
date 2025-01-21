export class Group {
    groupId
    groupName
    groupDescription
    groupMembers
    groupBookProposals
    groupBookCurrent
    groupDeadlineCurrent
    groupBookVotes
    groupBookVotesAverage
    constructor ( 
        groupId,
        groupName,
        groupDescription,
    ) {
        this.groupId = groupName + '_' + String(timestamp.getTime())
        this.groupName = groupName
        this.groupDescription = groupDescription
        this.groupMembers = []
        this.groupBookProposals = []
        this.groupBookCurrent = null
        this.groupDeadlineCurrent = null
        this.groupBookVotes = []
        this.groupBookVotesAverage = []
    }
}