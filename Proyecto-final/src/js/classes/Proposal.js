//@ts-check

/**
 * @typedef {Object} proposalData
 * @property {string} _id
 * @property {string} product_id
 * @property {string} user_id
 * @property {string} club_id
 */
export class Proposal {
    _id
    product_id
    user_id
    club_id
    /**
     * @param {proposalData} proposalData 
     */
    constructor (proposalData) {
        this._id = proposalData._id
        this.product_id = proposalData.product_id
        this.user_id = proposalData.user_id
        this.club_id = proposalData.club_id
    }
}
