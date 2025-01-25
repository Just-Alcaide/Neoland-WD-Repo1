// @ts-check

//Patron IIFE 
//Vamos a usar el singleton para los datos, no para una clase concreta
import { Product } from "./Product.js"
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