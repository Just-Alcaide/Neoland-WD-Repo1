//@ts-check

/**
 * @typedef {Object} userData
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {string=} [password]
 * @property {string} token
 * @property {string[]=} [clubs]
 * @property {string[]=} [products]
 * @property {string[]=} [proposals] // yes? no? maybe? i dont know? can you repeat the question?
 */
export class User {
    _id
    name
    email
    password
    token
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
        this.token = userData.token
        this.clubs = userData.clubs || []
        this.products = userData.products || []
        this.proposals = userData.proposals || []
    }
}