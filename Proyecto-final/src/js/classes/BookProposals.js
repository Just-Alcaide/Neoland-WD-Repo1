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

//TODO:
//Ampliar con campos para votos y estados (Extender con mixing, herencia o prototipe)

//TODO: 
//poner proposal como clase y factory para separar proposal de libro y proposal de pelicula