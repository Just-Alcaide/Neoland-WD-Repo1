// @ts-check

/**
 * @typedef {Object} productData
 * @property {string} id
 * @property {string} name
 * @property {number} year
 * @property {string} genre
 * @property {string} [author]
 * @property {number} [pages]
 * @property {string} [director]
 * @property {number} [minutes]
 */

export class Product {
    id
    name
    year
    genre
    /**
     * 
     * @param {productData} productData
     */
    constructor (productData) {
        this.id = productData.id
        this.name = productData.name
        this.year = productData.year
        this.genre = productData.genre
    }
}

export class Book extends Product {
    author
    pages
    /**
     * @param {productData} productData
     */
    constructor (productData) {
        super(productData)
        this.author = productData.author
        this.pages = productData.pages
    }
}

export class Movie extends Product {
    director
    minutes
    /**
     * @param {productData} productData
     */
    constructor (productData) {
        super(productData)
        this.director = productData.director
        this.minutes = productData.minutes
    }
}

export const PRODUCT_TYPE = {
    BOOK: 'book',
    MOVIE: 'movie'
}

export class ProductFactory {
    /**
     * @param {string} productType
     * @param {productData} productData
     */
    createProduct(productType, productData) {
        switch (productType) {
            case PRODUCT_TYPE.BOOK:
                return new Book (productData)
            case PRODUCT_TYPE.MOVIE:
                return new Movie (productData)
        }
    }
}

//TODO:______________________________
//cambiar los nombres de productName a name??? (me gusta el orden,)
// otra constante que sea details? como product data, con los detalles (autor, paginas, director, minutos)
//_______________________________

