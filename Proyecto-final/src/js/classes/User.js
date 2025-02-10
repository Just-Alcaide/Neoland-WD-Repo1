//@ts-check

/**
 * @typedef {Object} userData
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * // meter TOKEN
 * @property {string[]=} [clubs]
 * @property {string[]=} [products]
 * @property {string[]=} [proposals] // No debería existir, en proposals ya está el user_id
 */
export class User {
    _id
    name
    email
    password
    clubs
    products
    proposals
    /**
     * @param {userData} userData 
     */
    constructor (userData) {
        this._id = userData._id
        this.name = userData.name
        this.email = userData.email
        this.password = userData.password
        this.clubs = userData.clubs || []
        this.products = userData.products || []
        this.proposals = userData.proposals || []
    }
}