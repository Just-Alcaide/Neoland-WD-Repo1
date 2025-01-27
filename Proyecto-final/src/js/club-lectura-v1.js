// @ts-check

/**
 * import store and classes
 */
import {store} from "./store/redux.js";
import {ProductFactory, PRODUCT_TYPE, Book, Product, Movie} from "./classes/Product.js";
import {User} from "./classes/User.js";
import {Club} from "./classes/Club.js";
import {Proposal} from "./classes/Proposal.js";

/**
 * import templates
 */
import { bookProposalTemplate } from "../templates/proposal-templates.js";
import { movieProposalTemplate } from "../templates/proposal-templates.js";

/**
 * define API URLs
 */
const API_BOOKS_URL = './api/books.json'
const API_MOVIES_URL = './api/movies.json'

/**
 *  DOM Content Loaded
 */

document.addEventListener('DOMContentLoaded', onDomContentLoaded)

//========EVENTS========//

function onDomContentLoaded() {
    /**
     * load APIS and JSON
     */
    processData()

    /**
     * load stored data
     */
    // readStoredData()
    //OJO que a veces tarda más en cargar que en leer ¬¬

    /**
     * 
     */
    
    const bookProposal = document.getElementById('bookProposal')
    const movieProposal = document.getElementById('movieProposal')

    bookProposal?.addEventListener('change', onBookProposalChange)
    movieProposal?.addEventListener('change', onMovieProposalChange)
}

/**
 * show template on change
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

//TODO:==Cuando meta apis tochas, mirar si renta poner el simple fetch==//
/**
 * get Data from Book API
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
 * get Data from Movie API
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
 * process Book Data
 */
async function processBookData () {
    const apiBookData = await getAPIBookData ();
    const factory = new ProductFactory ();
    apiBookData.map(( /** @type {Book} */ product) => {
        const productData = {
            id: product.id,
            name: product.name,
            year: product.year, 
            genre: product.genre,
            author: product.author,
            pages: product.pages,
        }

        const bookInstance = factory.createProduct (PRODUCT_TYPE.BOOK, productData);
        store.createProduct(bookInstance);

    });
}
/**
 * process Movie Data
 */
async function processMovieData () {
    const apiMovieData = await getAPIMovieData();
    const factory = new ProductFactory();
    apiMovieData.map(( /** @type {Movie} */ product) => {
        const productData = {
            id: product.id,
            name: product.name,
            year: product.year, 
            genre: product.genre,
            director: product.director,
            minutes: product.minutes
        }
        
        const movieInstance = factory.createProduct (PRODUCT_TYPE.MOVIE, productData);
        store.createProduct(movieInstance);
    }); 
}
/**
 * process products Data
 */
async function processData() {
    await processBookData()
    await processMovieData()
    console.log(store.getState())
}
/**
 * read Stored Data
 */
// function readStoredData() {
    
//     const storedData = localStorage.getItem('storedData');
//     if  (storedData !== null) {
//         const parsedData = JSON.parse(storedData);
//         console.log('Stored Data: ', parsedData);
//     } else {
//         console.log('No stored data');
//     }
    
// }
/**
 * @param {number} status
 */
function showError(status) {
    throw new Error("Function not implemented.");
}

