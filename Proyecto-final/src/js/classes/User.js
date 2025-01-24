//@ts-check

/**
 * @typedef {Object} userData
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string[]=} [clubs]
 * @property {string[]=} [books]
 * @property {string[]=} [bookProposals]
 * @property {string[]=} [bookVotes]
 */
export class User {
    id
    name
    email
    password
    clubs
    books
    bookProposals
    bookVotes
    /**
     * @param {userData} userData 
     */
    constructor (userData) {
        this.id = userData.id
        this.name = userData.name
        this.email = userData.email
        this.password = userData.password
        this.clubs = userData.clubs || []
        this.books = userData.books || []
        this.bookProposals = userData.bookProposals || []
        this.bookVotes = userData.bookVotes || []
    }
}