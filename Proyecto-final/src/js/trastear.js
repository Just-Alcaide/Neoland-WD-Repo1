//@ts-check




class Product {
    productId
    productName
    productYear
    productGenre
    constructor (productData: productData) {
        this.productId = productData.productId
        this.productName = productData.productName
        this.productYear = productData.productYear
        this.productGenre = productData.productGenre
    }
}

class Book extends Product {
    productAuthor
    productPages
    constructor (productData: productData) {
        super(productData)
        this.productAuthor = productData.productAuthor
        this.productPages = productData.productPages
    }
}

class Movie extends Product {
    productDirector
    productMinutes
    constructor (productData: productData) {
        super(productData)
        this.productDirector = productData.productDirector
        this.productMinutes = productData.productMinutes
    }
}

const PRODUCT_TYPE = {
    BOOK: 'book',
    MOVIE: 'movie'
}

class ProductFactory {
    createProduct(productType: PRODUCT_TYPE, productData: productData) {
        switch (productType) {
            case PRODUCT_TYPE.BOOK:
                return new Book (productData)
            case PRODUCT_TYPE.MOVIE:
                return new Movie (productData)
        }
    }
}

///////////////////////////////

async function processBookData () {
    const apiBookData = await getAPIBookData ();
    const factory = new ProductFactory ();
    apiBookData.forEach((product) => {
        const productData = {
            productId: product.id,
            productName: product.name,
            productYear: product.year, 
            productGenre: product.genre,
            productAuthor: product.author,
            productPages: product.pages,
            productDirector: product.director,
            productMinutes: product.minutes
        }

        const bookInstance = factory.createProduct (PRODUCT_TYPE.BOOK, productData);
        store.get().products.push(bookInstance);
    }); localStorage.setItem('storedData', JSON.stringify(store.get()))
}

async function processMovieData () {
    const apiMovieData = await getAPIMovieData();
    const factory = new ProductFactory();
    apiMovieData.forEach((product) => {
        const productData = {
            productId: product.id,
            productName: product.name,
            productYear: product.year, 
            productGenre: product.genre,
            productAuthor: product.author,
            productPages: product.pages,
            productDirector: product.director,
            productMinutes: product.minutes
        }

        const movieInstance = factory.createProduct
        (PRODUCT_TYPE.MOVIE, productData);
        store.get().products.push(movieInstance);
    }); localStorage.setItem('storedData', JSON.stringify(store.get()))
}