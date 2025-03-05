// @ts-check

//Patron IIFE - Singleton
/** @import { Product } from "../classes/Product.js" */
    /**
     * @typedef {Object} dataInstance
     * @property {Product[]=} Product
     */

const store = (function() {



    /**
     * @type {dataInstance}
     */
    let storeInstance

    return  {
        get: () => {
            
            if (!storeInstance) {
                storeInstance = {
                    Product: [],
                }
            }
            return storeInstance
        }
    }
})()

export { store }