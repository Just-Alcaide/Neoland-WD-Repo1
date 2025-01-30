//@ts-check

/**
 * @typedef {Object} proposalData
 * @property {string} id
 * @property {string} product
 * @property {string} user
 * @property {string} club
 * @property {string []=} [votes]
 */
export class Proposal {
    id
    product
    user
    club
    votes
    /**
     * @param {proposalData} proposalData 
     */
    constructor (proposalData) {
        this.id = `${proposalData.product}_${proposalData.user}_${proposalData.club}`
        this.product = proposalData.product
        this.user = proposalData.user
        this.club = proposalData.club
        this.votes = proposalData.votes || []
    }
}
