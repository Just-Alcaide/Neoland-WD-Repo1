//@ts-check

/**
 * @typedef {Object} clubData
 * @property {string} [_id]
 * @property {string} name
 * @property {string} description
 * @property {string} type
 * @property {boolean} private
 * @property {string | null} [password]
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
    type
    private
    password
    admins
    members
    proposals
    productCurrent
    deadlineCurrent
    /**
     * @param {clubData} clubData 
     */
    constructor (clubData) {
        this._id = clubData._id || null
        this.name = clubData.name
        this.description = clubData.description
        this.type = clubData.type
        this.private = clubData.private
        this.password = clubData.password || null
        this.admins = clubData.admins || []
        this.members = clubData.members || []
        this.proposals = clubData.proposals || []
        this.productCurrent = clubData.productCurrent || null
        this.deadlineCurrent = clubData.deadlineCurrent || null
    }
}