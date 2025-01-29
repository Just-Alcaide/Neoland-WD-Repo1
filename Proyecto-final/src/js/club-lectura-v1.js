// @ts-check

/**
 * import store and classes
 * @typedef {import('./classes/Product.js').Book} Book
 * @typedef {import('./classes/Product.js').Product} Product
 * @typedef {import('./classes/Product.js').Movie} Movie
 */
import {store} from "./store/redux.js";
import {ProductFactory, PRODUCT_TYPE,} from "./classes/Product.js";
import {User} from "./classes/User.js";
import {Club} from "./classes/Club.js";
// import {Proposal} from "./classes/Proposal.js";

/**
 * import templates
 */
import { clubPageTemplate } from "../templates/dinamic-content.templates.js";
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
     * load state
     */
    store.loadState();

    /**
     * load APIS and JSON if not done previously
     */
    processData()
    

    
    // ==EVENT LISTENERS==//

    /**
     * auth forms
     */
    const loginForm = document.getElementById('loginForm')
    loginForm?.addEventListener('submit', onLoginFormSubmit)

    const registerForm = document.getElementById('registerForm')
    registerForm?.addEventListener('submit', onRegisterFormSubmit)
    
    /**
     * show templates
     */
    const clubsPageLink = document.getElementById('clubsPageLink')
    clubsPageLink?.addEventListener('click', onClubsPageLinkClick)


    const bookProposal = document.getElementById('bookProposal')
    bookProposal?.addEventListener('change', onBookProposalChange)
    
    const movieProposal = document.getElementById('movieProposal')
    movieProposal?.addEventListener('change', onMovieProposalChange)

    
}

//=======USER EVENTS=======//
/**
 * on login form submit
 * @param {SubmitEvent} e
 */
function onLoginFormSubmit(e) {
    e.preventDefault();
    loginUser()
    cleanUpLoginForm();
}

/**
 * on register form submit
 * @param {SubmitEvent} e
 */
function onRegisterFormSubmit(e) {
    e.preventDefault();
    createNewUser()
    cleanUpRegisterForm()
    console.log(store.getState())
}

//=======CLUB EVENTS=======//

/**
 * show club template
 */
/**
 * 
 * @param {MouseEvent} e 
 */
function onClubsPageLinkClick(e) {
    e.preventDefault();
    const dynamicContent = document.getElementById('dinamic-content');
    if (dynamicContent) {
    dynamicContent.innerHTML = clubPageTemplate
    updateClubsList()

    // event listener for create new club
    const createClubForm = document.getElementById('createClubForm');
    createClubForm?.addEventListener('submit', onCreateClubFormSubmit);
    }
}

/**
 * on create club form submit
*/
/**
 * @param {SubmitEvent} e
 */
function onCreateClubFormSubmit(e) {
    e.preventDefault();
    createNewClub();
    cleanUpNewClubForm();
    updateClubsList();
    console.log(store.getState())
}

//================USER METHODS================//

/**
 * login user
 */
function loginUser() {
    const loginEmail = /** @type {HTMLInputElement} */ (document.getElementById('loginEmail')).value;
    const loginPassword = /** @type {HTMLInputElement} */ (document.getElementById('loginPassword')).value

    const users = store.getState().users;
    const loginUser = users.find((/** @type {User} */ user) => user.email === loginEmail && user.password === loginPassword);

    if (loginUser) {
        //TODO: load user content... MONEY MONEY MONEY
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.innerText = `Bienvenid@ ${loginUser.name} a Sophia Social, tu comuniad de lectura y cine.`;
        }
        const authForms = document.getElementById('authForms');
        if (authForms) {
            authForms.classList.add('hidden');
        }
        console.log('logueado', loginUser)
    } 
}

/**
 * create new user
 */
function createNewUser() {
    const registerName = /** @type {HTMLInputElement} */ (document.getElementById('registerName')).value
    const registerEmail = /** @type {HTMLInputElement} */ (document.getElementById('registerEmail')).value 
    const registerPassword = /** @type {HTMLInputElement} */ (document.getElementById('registerPassword')).value 

    const newUser = {
        id: `user_${Date.now()}`,
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        clubs: [],
        books: [],
        bookProposals: [],
        bookVotes: [],
    }
    store.user.create(new User(newUser));
    store.saveState();
}

/**
 * clean up login form
 */
function cleanUpLoginForm() {
    const loginEmail = /** @type {HTMLInputElement} */ (document.getElementById('loginEmail'))
    const loginPassword = /** @type {HTMLInputElement} */ (document.getElementById('loginPassword'))

    loginEmail.value = ''
    loginPassword.value = ''
}

/**
 * clean up register form
 */
function cleanUpRegisterForm() {
    const registerName = /** @type {HTMLInputElement} */ (document.getElementById('registerName'))
    const registerEmail = /** @type {HTMLInputElement} */ (document.getElementById('registerEmail'))
    const registerPassword = /** @type {HTMLInputElement} */ (document.getElementById('registerPassword'))

    registerName.value = ''
    registerEmail.value = ''
    registerPassword.value = ''
} 

//================CLUB METHODS================//

/**
 * create new club
 */
function createNewClub() {
    const clubName = /** @type {HTMLInputElement} */ (document.getElementById('clubName')).value;
    const clubDescription = /** @type {HTMLTextAreaElement} */ (document.getElementById('clubDescription')).value;

    const newClub = {
        id: `club_${Date.now()}`,
        name: clubName,
        description: clubDescription,
        members: [],
        bookProposals: [],
        bookCurrent: null,
        deadlineCurrent: null,
        bookVotes: [],
        bookVotesAverage: []
    };
    store.club.create(new Club(newClub));
    store.saveState();
}

/**
 * clean up new club form
 */
function cleanUpNewClubForm() {
    const clubName = /** @type {HTMLInputElement} */ (document.getElementById('clubName'))
    const clubDescription = /** @type {HTMLTextAreaElement} */ (document.getElementById('clubDescription'))
    clubName.value = ''
    clubDescription.value = ''
}

/**
 * update clubs list
 */
function updateClubsList() {
    const clubsList = document.getElementById('clubsList');
    if (clubsList) {
        clubsList.innerHTML = store.getState().clubs.map((/** @type {Club} */ club) => `
         <li>
            <h3>Nombre: ${club.name}</h3>
            <p>Descripción: ${club.description}</p>
            <p>Miembros: ${club.members.length || 0}</p>
            <button class="deleteClubButton" data-id="${club.id}">Eliminar Club</button>
        </li>
        `
        ).join('');
        
        // event listener for delete club
        const deleteClubButtons = document.querySelectorAll('.deleteClubButton');
        deleteClubButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const target = /** @type {HTMLElement} */ (e.target)
            if (target) { 
            const clubId = target.getAttribute('data-id');
            if (clubId) {
                deleteClub(clubId);
            }}
        });
    });
    } 
}

/**
 * delete club
 * @param {string} clubId
 */
function deleteClub(clubId) {
    const clubToDelete = store.getState().clubs.find((/** @type {Club} */ club) => club.id === clubId);
    if (clubToDelete) {
        store.club.delete(clubToDelete);
        updateClubsList();
        store.saveState();
    }
}


//==PROPOSALS EVENTS==//
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

//========APP METHODS========//

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
        store.product.create(bookInstance);

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
        store.product.create(movieInstance);
    }); 
}
/**
 * process products Data
 */
async function processData() {
    const isApiDataProcessed = localStorage.getItem('isApiDataProcessed')
    if (!isApiDataProcessed) {
        await processBookData()
        await processMovieData()
        localStorage.setItem('isApiDataProcessed', 'true')
        store.saveState()
    }  
    console.log(store.getState())
}
    
/**
 * @param {number} status
 */
function showError(status) {
    throw new Error(`Error ${status}: Function not implemented.`);
}
