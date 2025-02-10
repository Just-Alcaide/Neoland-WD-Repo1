//@ts-check

/**
 * @typedef {Object} clubData
 * @property {string} _id
 * @property {string} name
 * @property {string} description
 * @property {boolean} private
 * @property {string[]=} [admins]
 * @property {string[]=} [members]
 * @property {string[]=} [proposals]
 * @property {string | null} [productCurrent]
 * @property {string | null} [deadlineCurrent]
 */


export class Club {
    _id
    name
    description
    private
    admins
    members
    proposals
    productCurrent
    deadlineCurrent
    /**
     * @param {clubData} clubData 
     */
    constructor (clubData) {
        this._id = clubData._id
        this.name = clubData.name
        this.description = clubData.description
        this.private = clubData.private
        this.admins = clubData.admins || []
        this.members = clubData.members || []
        this.proposals = clubData.proposals || []
        this.productCurrent = clubData.productCurrent || null
        this.deadlineCurrent = clubData.deadlineCurrent || null
    }
}