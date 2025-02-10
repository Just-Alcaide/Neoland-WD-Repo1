// @ts-checkts-check

/**
 * @typedef {Object} voteData
 * @property {string} _id
 * @property {number} vote
 * @property {string} user_id
 * @property {string} proposal_id
 */
export class Votes {
    _id
    vote
    user_id
    proposal_id

    /**
     * @param {voteData} voteData
     */
    constructor (voteData) {
        this._id = voteData._id
        this.vote = voteData.vote
        this.user_id = voteData.user_id
        this.proposal_id = voteData.proposal_id
    }
}