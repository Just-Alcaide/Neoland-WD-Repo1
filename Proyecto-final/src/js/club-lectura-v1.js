import {store} from "./classes/store.js"

import {ProductFactory, PRODUCT_TYPE,} from "./classes/Product.js";

const API_BOOKS_URL = './api/books.json'
const API_MOVIES_URL = './api/movies.json'

document.addEventListener('DOMContentLoaded', onDomContentLoaded)

//========EVENTS========//

function onDomContentLoaded() {
    processData()
    readStoredData()
}

//========METHODS========//


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
            product.pages,
            undefined,
            undefined
        );
        store.get().products.push(bookInstance);
        localStorage.setItem('storedData', JSON.stringify(store.get()))
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
            undefined,
            undefined, 
            product.director, 
            product.minutes
        );
        store.get().products.push(movieInstance);
        localStorage.setItem('storedData', JSON.stringify(store.get()))
    });
}


function processData() {
    getAPIBookData()
    getAPIMovieData()
    processBookData()
    processMovieData()
}

function readStoredData() {
    JSON.parse(localStorage.getItem('storedData'))
}



