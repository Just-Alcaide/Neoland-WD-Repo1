//@ts-check

/**
 * @typedef {Object} clubData
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {boolean} private
 * @property {string[]=} [admins]
 * @property {string[]=} [members]
 * @property {string[]=} [productProposals]
 * @property {string | null} [productCurrent]
 * @property {string | null} [deadlineCurrent]
 */


export class Club {
    id
    name
    description
    private
    admins
    members
    productProposals
    productCurrent
    deadlineCurrent
    /**
     * @param {clubData} clubData 
     */
    constructor (clubData) {
        this.id = clubData.id
        this.name = clubData.name
        this.description = clubData.description
        this.private = clubData.private
        this.admins = clubData.admins || []
        this.members = clubData.members || []
        this.productProposals = clubData.productProposals || []
        this.productCurrent = clubData.productCurrent || null
        this.deadlineCurrent = clubData.deadlineCurrent || null
    }
}