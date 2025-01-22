/**
 * *import singleton and classes
 */
import {store} from "./classes/store.js"
import {ProductFactory, PRODUCT_TYPE,} from "./classes/Product.js";

/**
 * *import templates
 */
import { bookProposalTemplate } from "../templates/proposal-templates.js";
import { movieProposalTemplate } from "../templates/proposal-templates.js";

/**
 * define API URLs
 */
const API_BOOKS_URL = './api/books.json'
const API_MOVIES_URL = './api/movies.json'

/**
 * * DOM Content Loaded
 */

document.addEventListener('DOMContentLoaded', onDomContentLoaded)

//========EVENTS========//

function onDomContentLoaded() {
    /**
     * *load APIS and JSON
     */
    processData()

    /**
     * *load stored data
     */
    readStoredData()
    //OJO que a veces tarda más en cargar que en leer ¬¬

    /**
     * *
     */
    const bookProposal = document.getElementById('bookProposal')
    const movieProposal = document.getElementById('movieProposal')

    bookProposal.addEventListener('change', onBookProposalChange)
    movieProposal.addEventListener('change', onMovieProposalChange)
}

/**
 * *show template on change
 */
function onBookProposalChange() {
    formContainer.innerHTML = bookProposalTemplate;
}
function onMovieProposalChange() {
    formContainer.innerHTML = movieProposalTemplate;
}

//========METHODS========//

/**
 * 
 * *get Data from Book API
 */
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
/**
 * 
 * *get Data from Movie API
 */
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
/**
 * *process Book Data
 */
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
    }); localStorage.setItem('storedData', JSON.stringify(store.get()))
}
/**
 * *process Movie Data
 */
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
    }); localStorage.setItem('storedData', JSON.stringify(store.get()))
}

/**
 * process products Data
 */
function processData() {
    getAPIBookData()
    getAPIMovieData()
    processBookData()
    processMovieData()
    
}
/**
 * *read Stored Data
 */
function readStoredData() {
    const storedData = JSON.parse(localStorage.getItem('storedData'))
    console.log('Stored Data: ', storedData);
}
