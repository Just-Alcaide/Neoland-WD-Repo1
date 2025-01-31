//@ts-check

/**
 * @typedef {Object} userData
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string[]=} [clubs]
 * @property {string[]=} [products]
 * @property {string[]=} [productProposals]
 * @property {string[]=} [proposalVotes]
 */
export class User {
    id
    name
    email
    password
    clubs
    products
    productProposals
    proposalVotes
    /**
     * @param {userData} userData 
     */
    constructor (userData) {
        this.id = userData.id
        this.name = userData.name
        this.email = userData.email
        this.password = userData.password
        this.clubs = userData.clubs || []
        this.products = userData.products || []
        this.productProposals = userData.productProposals || []
        this.proposalVotes = userData.proposalVotes || []
    }
}