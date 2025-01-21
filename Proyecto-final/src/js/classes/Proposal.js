export class Proposal {
    proposalProduct
    proposalUser
    proposalGroup
    constructor (
        product,
        user,
        group,
    ) {
        this.proposalProduct = product
        this.proposalUser = user
        this.proposalGroup = group
    }
}

//TODO:_________________________
//Ampliar con campos para votos y estados (Extender con mixing, herencia o prototipe)

//poner proposal como clase y factory para separar proposal de libro y proposal de pelicula (¿?¿?¿?)
//______________________________