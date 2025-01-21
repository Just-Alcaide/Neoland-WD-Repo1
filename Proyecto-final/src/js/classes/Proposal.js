export class Proposal {
    proposalId
    proposalProduct
    proposalUser
    proposalGroup
    constructor (
        proposalId,
        product,
        user,
        group,
    ) {
        this.proposalId = `${productId}_${userId}_${groupId}`
        this.proposalProduct = product
        this.proposalUser = user
        this.proposalGroup = group
    }
}

//TODO:_________________________
//Ampliar con campos para votos y estados (Extender con mixing, herencia o prototipe)

//poner proposal como clase y factory para separar proposal de libro y proposal de pelicula (¿?¿?¿?)
//______________________________