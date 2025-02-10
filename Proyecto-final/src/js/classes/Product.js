// @ts-check

/**
 * @typedef {Object} productData
 * @property {string} [_id]
 * @property {string} name
 * @property {number} year
 * @property {string} genre
 * @property {string} [author]
 * @property {number} [pages]
 * @property {string} [director]
 * @property {number} [minutes]
 */

export class Product {
    _id
    name
    year
    genre
    /**
     * @param {productData} productData
     */
    constructor (productData) {
        this._id = productData._id
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
                return new Book (productData);
            case PRODUCT_TYPE.MOVIE:
                return new Movie (productData);
            default: throw new Error (`Product type: ${productType} is not supported`);
        }
    }
}

