import {store} from "./classes/store.js"

import {ProductFactory, PRODUCT_TYPE,} from "./classes/Product.js";

const API_BOOKS_URL = './api/books.json'
const API_MOVIES_URL = './api/movies.json'



async function getAPIBookData () {
    const apiBookData = await fetch (API_BOOKS_URL)
    .then ((response) => {
        if (!response.ok) {
            showError(response.status)
        }
        return response.json();
    })
    return apiBookData
}

async function getAPIMovieData () {
    const apiMovieData = await fetch (API_MOVIES_URL)
    .then ((response) => {
        if(!response.ok) {
            showError(response.status)
        }
        return response.json();
    })
    return apiMovieData
}

async function processBookData() {
    const apiBookData = await getAPIBookData();
    const factory = new ProductFactory();
    apiBookData.forEach((product) => {
        const  productData = {
            productId: product.id,
            productName: product.name,
            productYear: product.year,
            productGenre: product.genre,
        }
        const bookInstance = factory.createProduct(PRODUCT_TYPE.BOOK, 
            productData, 
            product.author, 
            product.pages
        );
        store.get().products.push(bookInstance);
        console.log(bookInstance)
    });
}

async function processMovieData() {
    const apiMovieData = await getAPIMovieData();
    const factory = new ProductFactory();
    apiMovieData.forEach((product) => {
        const  productData = {
            productId: product.id,
            productName: product.name,
            productYear: product.year,
            productGenre: product.genre,
        }
        const movieInstance = factory.createProduct(PRODUCT_TYPE.MOVIE, 
            productData, 
            product.director, 
            product.minutes
        );
        store.get().products.push(movieInstance);
        console.log(movieInstance)
    });
}



getAPIBookData()

getAPIMovieData()

processBookData()

processMovieData()

console.log(store.get())

// processBookData(apiBookData)

// processMovieData(apiMovieData)



// const  productData = {
//     productId: product.id,
//     productName: product.name,
//     productYear: product.year,
//     productGenre: product.genre,
// }
