// @ts-check

/**
 * import store and classes
 * /
/** @typedef {import('./classes/Product.js').Book} Book */
/** @typedef {import('./classes/Product.js').Product} Product */
/** @typedef {import('./classes/Product.js').Movie} Movie */
 
import {store} from "./store/redux.js";
import {ProductFactory, PRODUCT_TYPE,} from "./classes/Product.js";
import {User} from "./classes/User.js";
import {Club} from "./classes/Club.js";
// import {Proposal} from "./classes/Proposal.js";

/**
 * import templates
 */
import { clubPageTemplate, clubDetailPageTemplate } from "../templates/dinamic-content.templates.js";


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
    
    /**
     * check auth status
     */
    checkAuthStatus()

    
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
}


//=====USER EVENTS=====//

/**
 * on login form submit
 * @param {SubmitEvent} e
 */
function onLoginFormSubmit(e) {
    e.preventDefault();
    loginUser()
    cleanUpLoginForm();
    console.log(store.getState())
}

/**
 * on register form submit
 * @param {SubmitEvent} e
 */
function onRegisterFormSubmit(e) {
    e.preventDefault();
    createNewUser()
    loginNewUser()
    cleanUpRegisterForm()
    console.log(store.getState())
}

/**
 * on logout button click
 * @param {MouseEvent} e
 */
function onLogoutButtonClick(e) {
    e.preventDefault();
    logoutUser();
    console.log(store.getState())
}

/**
 * on delete account button click
 * @param {MouseEvent} e 
 */
function ondeleteAccountButtonClick(e) {
    e.preventDefault();
    deleteAccountForm();

}
/**
 * on delete user button click
 * @param {MouseEvent} e 
 */
function onDeleteUserButtonClick(e) {
    e.preventDefault();
    deleteUser()
    console.log(store.getState())
}

//=====USER METHODS=====//

/**
 * login user
 */
function loginUser() {
    const loginEmail = /** @type {HTMLInputElement} */ (document.getElementById('loginEmail')).value;
    const loginPassword = /** @type {HTMLInputElement} */ (document.getElementById('loginPassword')).value

    const users = store.getState().users;
    const loginUser = users.find((/** @type {User} */ user) => user.email === loginEmail && user.password === loginPassword);

    if (loginUser) {
        sessionStorage.setItem('loggedUser', JSON.stringify(loginUser));

        console.log('logueado', loginUser)
    }   else {
        alert('El email o la contraseña son incorrectos');
    }

    checkAuthStatus()
}

/**
 * get logged user data
 * @returns {User | null}
 */
function getLoggedUserData() {
    const storedUser = sessionStorage.getItem('loggedUser');
    return storedUser ? JSON.parse(storedUser) : null
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
 * login new user
 */
function loginNewUser() {
    const loginEmail = /** @type {HTMLInputElement} */ (document.getElementById('registerEmail')).value 
    const loginPassword = /** @type {HTMLInputElement} */ (document.getElementById('registerPassword')).value 

    const users = store.getState().users;
    const loginUser = users.find((/** @type {User} */ user) => user.email === loginEmail && user.password === loginPassword);

    if (loginUser) {
        sessionStorage.setItem('loggedUser', JSON.stringify(loginUser));
        console.log('logueado', loginUser)
    }   else {
        alert('El email o la contraseña son incorrectos');
    }

    checkAuthStatus()
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

/**
 * check auth status
 */
function checkAuthStatus() {
    const loggedUser = getLoggedUserData();
    const authForms = document.getElementById('authForms');
    const userMenu = document.getElementById('userMenu');
    const welcomeMessage = document.getElementById('welcomeMessage');

    if (loggedUser) {
        if (authForms) {
            authForms.classList.add('hidden');
        }

        if (userMenu) {
            userMenu.innerHTML = `
            <p>Bienvenid@, ${loggedUser.name}</p>
            <button id="logoutButton">Cerrar Sesión</button>
            <button id='deleteAccountButton'>Eliminar Cuenta</button>
            `;
    
            const logoutButton = document.getElementById('logoutButton');
            logoutButton?.addEventListener('click', onLogoutButtonClick);

            const deleteAccountButton = document.getElementById('deleteAccountButton');
            deleteAccountButton?.addEventListener('click', ondeleteAccountButtonClick);
        }

        if (welcomeMessage) {
            welcomeMessage.innerText = `Bienvenid@, ${loggedUser.name}, a Sophia Social, tu comuniad de lectura y cine.`;
        }
    }
}

/**
 * logout user
 */
function logoutUser() {
    sessionStorage.removeItem('loggedUser');
    location.reload();
}

/**
 * delete account form
 */
function deleteAccountForm() {
    const popup = document.getElementById("deleteAccountPopup");
    if (popup instanceof HTMLDialogElement) {
        popup.showModal();
    }

    document.getElementById('cancelDeleteAccountButton')?.addEventListener('click', () => {
        const popup = document.getElementById("deleteAccountPopup");
        if (popup instanceof HTMLDialogElement) {
            popup.close();
        }
    })
    
    const deleteUserButton = document.getElementById('deleteUserButton');
    deleteUserButton?.addEventListener('click', onDeleteUserButtonClick);
}

/**
 * delete user
 */
function deleteUser() {
    const loggedUser = getLoggedUserData();

    const deleteUserName = /** @type {HTMLInputElement} */ (document.getElementById('deleteUserName')).value
    const deleteUserEmail = /** @type {HTMLInputElement} */ (document.getElementById('deleteUserEmail')).value
    const deleteUserPassword = /** @type {HTMLInputElement} */ (document.getElementById('deleteUserPassword')).value

    if (deleteUserName === loggedUser?.name && deleteUserEmail === loggedUser?.email && deleteUserPassword === loggedUser?.password) {
        store.user.delete(loggedUser);
        store.saveState();
        sessionStorage.removeItem('loggedUser');
        alert('Cuenta eliminada con exito');
        location.reload();
    } else {
        alert('Los datos ingresados son incorrectos');
    }
}

//=====CLUB EVENTS=====//

/**
 * show club template
 */
/**
 * 
 * @param {MouseEvent} e 
 */
function onClubsPageLinkClick(e) {
    e.preventDefault();
    const dynamicContent = document.getElementById('dynamic-content');
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


//=====CLUB METHODS=====//

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
            <button class="visitClubButton" data-id="${club.id}">Visitar Club</button>
            <button class="deleteClubButton" data-id="${club.id}">Eliminar Club</button>
        </li>
        `
        ).join('');

        // event listeners to clubs list
        addVisitListenerToClubsList()
        addDeleteListenerToClubsList()
    } 
}

/**
 * add visit club event listener
 */
function addVisitListenerToClubsList(){
    const visitClubButton = document.querySelectorAll('.visitClubButton');
    visitClubButton.forEach((button) => {
        button.addEventListener('click', (e) => {
            const target = /** @type {HTMLElement} */ (e.target)
            if (target) {
                const clubId = target.getAttribute('data-id');
                if (clubId) {
                    visitClubPage(clubId);
                }
            }
        });
    });
}

//TODO: REVISAR CON LAS PROPOSALS
/**
 * visit club page
 * @param {string} clubId
 */
function visitClubPage(clubId) {
    const dynamicContent = document.getElementById ('dynamic-content');
    const clubToVisit = store.getState().clubs.find((/** @type {Club} */ club) => club.id === clubId);

    if (clubToVisit && dynamicContent) {
        dynamicContent.innerHTML = clubDetailPageTemplate(clubToVisit);
        // updateProposalsList(clubId)
    }

    // const addProposalButton = document.getElementById('addProposalButton');
    // addProposalButton?.addEventListener('click', onAddProposalButtonClick)
}

/**
 * add delete club event listener
 */
function addDeleteListenerToClubsList() {
    const deleteClubButtons = document.querySelectorAll('.deleteClubButton');
    deleteClubButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        const target = /** @type {HTMLElement} */ (e.target)
        if (target) { 
            const clubId = target.getAttribute('data-id');
            if (clubId) {
                deleteClub(clubId);
            }
        }
    });
});
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

//TODO: PUES ESO, HACERLO
//=====PROPOSAL EVENTS=====//

/**
 * 
 * @param {MouseEvent} e 
 */
// function onAddProposalButtonClick(e) {
//     e.preventDefault();
//     const addProposalTypeForm = document.getElementById('addProposalTypeForm');
//     if (addProposalTypeForm) {
//         addProposalTypeForm.classList.remove('hidden');
//     }
//     const addProposalButton = document.getElementById('addProposalButton');
//     if (addProposalButton) {
//         addProposalButton.classList.add('hidden');
//     }
    
//     const createNewProposalButton = document.getElementById('createNewProposalButton');
//     createNewProposalButton?.addEventListener('submit', onCreateNewProposalButtonClick)
// }

/**
 * 
 * @param {SubmitEvent} e 
 */
// function onCreateNewProposalButtonClick(e) {
//     e.preventDefault();
//     createNewProposal();
//     cleanUpProposalForm();
//     updateProposalsList();
//     store.saveState();
// }

//=====PROPOSAL METHODS=====//

/**
 * create new proposal
 */
// function createNewProposal () {
//     const proposalUser = /** @type {HTMLInputElement} */ (document.getElementById('proposalUser')).value;
//     const proposalProduct = /** @type {HTMLInputElement} */ (document.getElementById('proposalProduct')).value;
    
    

// }

/**
 * update proposals list
 * @param {string} clubId
 */
// function updateProposalsList(clubId) {
//     const proposalsList = document.getElementById('proposalsList');
//     if (proposalsList) {
//         const proposals = store.getState().proposals.filter((/** @type {Proposal} */ proposal) => proposal.club === clubId);
        
//         proposalsList.innerHTML = proposals.map((/** @type {Proposal} */ proposal) => `
//             <li>
//                 <p>${proposal.product}</p>
//                 <p>${proposal.user}</p>
//                 <p>Votos: ${proposal.votes.length || 0}</p>
//                 <button class="voteProposalButton" data-id="${proposal.id}">Votar</button>
//             </li>
//         `).join('');
    
//         // event listeners to proposals list
//         addVoteListenerToProposalsList()
//     }
// }

/**
 * add vote proposal event listener
 */
// function addVoteListenerToProposalsList() {
//     const voteProposalButton = document.querySelectorAll('.voteProposalButton');
//     voteProposalButton.forEach((button) => {
//         button.addEventListener('click', (e) => {
//             const target = /** @type {HTMLElement} */ (e.target);
//             if (target) {
//                 const proposalId = target.getAttribute('data-id');
//                 if (proposalId) {
//                     voteProposal(proposalId);
//                 }
//             }
//         })
//     })
// }

// function voteProposal(proposalId) {

// }


//=====PRODUCT EVENTS=====//


//=====PRODUCT METHODS=====//




//=====API METHODS=====//

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
 * @param {number} status
 */
function showError(status) {
    throw new Error(`Error ${status}: Function not implemented.`);
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
