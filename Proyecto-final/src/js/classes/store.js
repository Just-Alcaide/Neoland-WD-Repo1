// @ts-check

//Patron IIFE 
//Vamos a usar el singleton para los datos, no para una clase concreta

const store = (function() {


    let storeInstance

    return  {
        get: () => {
            if (!storeInstance) {
                storeInstance = {
                    products: [],
                    users: [],
                    groups: [],
                    proposals: [],
                }
            }
            return storeInstance
        }
    }
})()

export { store }