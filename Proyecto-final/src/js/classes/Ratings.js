// @ts-check

/**
 * @typedef {Object} ratingData
 * @property {string} _id
 * @property {number} rating
 * @property {string} review
 * @property {string} user_id
 * @property {string} product_id
 */
export class Ratings {
    _id
    rating
    review
    user_id
    product_id
    /**
     * @param {ratingData} ratingData
     */
    constructor (ratingData) {
        this._id = ratingData._id
        this.rating = ratingData.rating
        this.review = ratingData.review
        this.user_id = ratingData.user_id
        this.product_id = ratingData.product_id
    }
}