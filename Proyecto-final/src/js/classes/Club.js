//@ts-check

/**
 * @typedef {Object} clubData
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string[]=} [members]
 * @property {string[]=} [bookProposals]
 * @property {string | null} [bookCurrent]
 * @property {string | null} [deadlineCurrent]
 * @property {string[]=} [bookVotes]
 * @property {string[]=} [bookVotesAverage]
 */


export class Club {
    id
    name
    description
    members
    bookProposals
    bookCurrent
    deadlineCurrent
    bookVotes
    bookVotesAverage
    /**
     * @param {clubData} clubData 
     */
    constructor (clubData) {
        this.id = clubData.id
        this.name = clubData.name
        this.description = clubData.description
        this.members = clubData.members || []
        this.bookProposals = clubData.bookProposals || []
        this.bookCurrent = clubData.bookCurrent || null
        this.deadlineCurrent = clubData.deadlineCurrent || null
        this.bookVotes = clubData.bookVotes || []
        this.bookVotesAverage = clubData.bookVotesAverage || []
    }
}