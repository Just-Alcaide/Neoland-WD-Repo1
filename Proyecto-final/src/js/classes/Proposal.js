//@ts-check

/**
 * @typedef {Object} proposalData
 * @property {string} id
 * @property {string} product
 * @property {string} user
 * @property {string} club
 */
export class Proposal {
    id
    product
    user
    club
    /**
     * @param {proposalData} proposalData 
     */
    constructor (proposalData) {
        this.id = `${proposalData.product}_${proposalData.user}_${proposalData.club}`
        this.product = proposalData.product
        this.user = proposalData.user
        this.club = proposalData.club
    }
}

//TODO:_________________________
//Ampliar con campos para votos y estados (Extender con mixing, herencia o prototipe)

//poner proposal como clase y factory para separar proposal de libro y proposal de pelicula (¿?¿?¿?)
//Que le den a las putas factories
//______________________________