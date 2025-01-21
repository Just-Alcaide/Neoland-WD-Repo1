export class BookProposal {
    proposalId
    proposalBook
    proposalUser
    proposalGroup
    constructor (
        book,
        user,
        group,
    ) {
        this.proposalId = `${book.bookId}_${user.userId}_${group.groupId}` 
        this.proposalBook = book
        this.proposalUser = user
        this.proposalGroup = group
    }
}