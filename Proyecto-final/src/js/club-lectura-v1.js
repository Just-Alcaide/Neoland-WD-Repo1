// @ts-check

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

    bookProposal?.addEventListener('change', onBookProposalChange)
    movieProposal?.addEventListener('change', onMovieProposalChange)
}

/**
 * *show template on change
 */
function onBookProposalChange() {
    const formContainer = document.getElementById('formContainer')
    if (formContainer) {
    formContainer.innerHTML = bookProposalTemplate;
    }
}

function onMovieProposalChange() {
    const formContainer = document.getElementById('formContainer')
    if (formContainer) {
    formContainer.innerHTML = movieProposalTemplate;
    }
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
async function processBookData () {
    const apiBookData = await getAPIBookData ();
    const factory = new ProductFactory ();
    apiBookData.forEach((/** @type {{ id: string; name: string; year: number; genre: string; author: string; pages: number; director: string; minutes: number; }} */ product) => {
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
        if (bookInstance) {
            store.get().products.push(bookInstance);
        }
    }); localStorage.setItem('storedData', JSON.stringify(store.get()))
}
/**
 * *process Movie Data
 */
async function processMovieData () {
    const apiMovieData = await getAPIMovieData();
    const factory = new ProductFactory();
    apiMovieData.forEach((/** @type {{ id: string; name: string; year: number; genre: string; author: string; pages: number; director: string; minutes: number; }} */ product) => {
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
/**
 * @param {number} status
 */
function showError(status) {
    throw new Error("Function not implemented.");
}

