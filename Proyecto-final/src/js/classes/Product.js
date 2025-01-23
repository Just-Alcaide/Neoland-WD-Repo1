// @ts-check


export class Product {
    productId
    productName
    productYear
    productGenre
    /**
     * @param {{ productId: string; productName: string; productYear: number; productGenre: string; }} productData
     */
    constructor (productData) {
        this.productId = productData.productId
        this.productName = productData.productName
        this.productYear = productData.productYear
        this.productGenre = productData.productGenre
    }
}

export class Book extends Product {
    productAuthor
    productPages
    /**
     * @param {{ productAuthor: string; productPages: number; productId: string; productName: string; productYear: number; productGenre: string; }} productData
     */
    constructor (productData) {
        super(productData)
        this.productAuthor = productData.productAuthor
        this.productPages = productData.productPages
    }
}

export class Movie extends Product {
    productDirector
    productMinutes
    /**
     * @param {{ productDirector: string; productMinutes: number; productId: string; productName: string; productYear: number; productGenre: string; }} productData
     */
    constructor (productData) {
        super(productData)
        this.productDirector = productData.productDirector
        this.productMinutes = productData.productMinutes
    }
}

export const PRODUCT_TYPE = {
    BOOK: 'book',
    MOVIE: 'movie'
}

export class ProductFactory {
    /**
     * @param {string} productType
     * @param {{ productId: string; productName: string; productYear: number; productGenre: string; productAuthor: string; productPages: number; productDirector: string; productMinutes: number; }} productData
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

