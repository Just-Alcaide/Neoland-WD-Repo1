//@ts-check

/**
 * @typedef {Object} proposalData
 * @property {string} _id
 * @property {string} product_id
 * @property {string} productType
 * @property {string} user_id
 * @property {string} club_id
 * @property {number} votes
 */
export class Proposal {
    _id
    product_id
    productType
    user_id
    club_id
    votes
    /**
     * @param {proposalData} proposalData 
     */
    constructor (proposalData) {
        this._id = proposalData._id
        this.productType = proposalData.productType
        this.product_id = proposalData.product_id
        this.user_id = proposalData.user_id
        this.club_id = proposalData.club_id
        this.votes = proposalData.votes
    }
}
