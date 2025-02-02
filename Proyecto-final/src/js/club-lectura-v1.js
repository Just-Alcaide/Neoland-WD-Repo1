// @ts-check

/**
 * import store and classes
 * /
/** @typedef {import('./classes/Product.js').Book} Book */
/** @typedef {import('./classes/Product.js').Product} Product */
/** @typedef {import('./classes/Product.js').Movie} Movie */
/** @typedef {import('./classes/Proposal.js').Proposal} Proposal } */
 
import {store} from "./store/redux.js";
import {ProductFactory, PRODUCT_TYPE,} from "./classes/Product.js";
import {User} from "./classes/User.js";
import {Club} from "./classes/Club.js";


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
    updateClubsList()
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
        products: [],
        productProposals: [],
        proposalVotes: [],
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
 * @param {MouseEvent} e 
 */
function onClubsPageLinkClick(e) {
    e.preventDefault();
    const dynamicContent = document.getElementById('dynamic-content');
    if (dynamicContent) {
    loadClubsPage()

    // event listener for create new club
    const createClubForm = document.getElementById('createClubForm');
    createClubForm?.addEventListener('submit', onCreateClubFormSubmit);
    }
}

/**
 * on create club form submit
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
//TODO: QUE PASA SI UN ADMIN SE VA DEL GRUPO?
//TODO: PONER QUE ADMIN NOMBRE OTROS ADMINS
//TODO: PONER QUE CLUB SE ELIMINE SI ULTIMO USER SE VA
//TODO: AVISO SI EL ULTIMO USER SE QUIERE IR, CONFIRMAR ELIMINAR EL CLUB

/**
 * create new club
 */
function createNewClub() {
    const clubName = /** @type {HTMLInputElement} */ (document.getElementById('clubName')).value;
    const clubDescription = /** @type {HTMLTextAreaElement} */ (document.getElementById('clubDescription')).value;
    const clubVisibility = /** @type {HTMLInputElement} */ (document.querySelector('input[name="clubVisibility"]:checked')).value;
    const isPrivate = clubVisibility === 'private';

    const loggedUser = getLoggedUserData();
    if (!loggedUser) {
        alert('Debes iniciar sesión para crear un club');
        return;
    }

    const newClub = {
        id: `club_${Date.now()}`,
        name: clubName,
        description: clubDescription,
        private: isPrivate,
        admins: [loggedUser.id],
        members: [loggedUser.id],
        productProposals: [],
        productCurrent: null,
        deadlineCurrent: null,
    };

    store.club.create(new Club(newClub));
    const clubId = newClub.id

    const updatedUser = {
        ...loggedUser,
        clubs: [...loggedUser.clubs, clubId]
    }

    store.user.update(updatedUser);
    sessionStorage.setItem('loggedUser', JSON.stringify(updatedUser));

    store.saveState();
}

/**
 * clean up new club form
 */
function cleanUpNewClubForm() {
    const clubName = /** @type {HTMLInputElement} */ (document.getElementById('clubName'))
    const clubDescription = /** @type {HTMLTextAreaElement} */ (document.getElementById('clubDescription'))
    const clubVisibility = /** @type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll('input[name="clubVisibility"]'))

    clubName.value = ''
    clubDescription.value = ''
    clubVisibility.forEach((radio) => radio.checked = false)
}

/**
 * update clubs list
 */
function updateClubsList() {
    const clubsList = document.getElementById('clubsList');
    const loggedUser = getLoggedUserData();
    const clubs = store.getState().clubs;

    const userClubs = clubs.filter((/** @type {Club} */ club) => {
        if (!loggedUser) {
            return !club.private;
        } else {
            return !club.private || club.members.includes(loggedUser.id);
        }
    });

    if (clubsList) {
        clubsList.innerHTML = userClubs.map((/** @type {Club} */ club) => 
            `
            <li>
                <h3>Nombre: ${club.name}</h3>
                <p>Descripción: ${club.description}</p>
                <p>Miembros: ${club.members.length || 0}</p>
                <button class="visitClubButton" data-id="${club.id}">Visitar Club</button>
                ${loggedUser ? generateClubActionButtons(club, loggedUser) : ''}
                
            </li>
            `).join('');

        // event listeners to clubs list
        addVisitListenerToClubsList()
        addJoinListenerToClubsList()
        addLeaveListenerToClubsList()
        addEditListenerToClubsList()
        addDeleteListenerToClubsList()
    } 
}

/**
 * generate club action buttons
 * @param {Club} club 
 * @param {User} loggedUser 
 */
function generateClubActionButtons(club, loggedUser) {
    let userButtons = '';

    if (loggedUser && !club.private && !club.members.includes(loggedUser.id)) {
        userButtons += `
        <button class="joinClubButton" data-id="${club.id}">Unirse al Club</button>
        `;}

    if (loggedUser && club.members.includes(loggedUser.id)) {
        userButtons += `
        <button class="leaveClubButton" data-id="${club.id}">Salir del Club</button>
        `;}
    
    if (loggedUser && club.admins.includes(loggedUser.id)) {
        userButtons += `
        <button class="editClubButton" data-id="${club.id}">Editar Club</button>
        <button class="deleteClubButton" data-id="${club.id}">Eliminar Club</button>
        `;}
    
    return userButtons;
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
    const dynamicContent = document.getElementById('dynamic-content');
    if (!dynamicContent) {
        return;
    }

    const loggedUser = getLoggedUserData();
    const clubToVisit = store.getState().clubs.find((/** @type {Club} */ club) => club.id === clubId);

    if (clubToVisit && dynamicContent && loggedUser) {
        dynamicContent.innerHTML = clubDetailPageTemplate(clubId);

        const backToClubsListButton = document.getElementById('backToClubsListButton');
        if (backToClubsListButton) {
            backToClubsListButton.addEventListener('click', () => {
                loadClubsPage();
            });
        }

        const clubActionButtonsContainer = document.getElementById('clubActionButtonsContainer');
        if (clubActionButtonsContainer) {
            clubActionButtonsContainer.innerHTML = generateClubActionButtons(clubToVisit, loggedUser);

            addJoinListenerToClubsList()
            addLeaveListenerToClubsList()
            addEditListenerToClubsList()
            addDeleteListenerToClubsList()
        }
    }

    const club = getClubData(clubId);
    if (!club) return;

    renderClubDetails(club);
    renderMemberDetails(club);
    renderClubProposals(club);
}

function loadClubsPage() {
    const dynamicContent = document.getElementById('dynamic-content');
    if (dynamicContent) {
        dynamicContent.innerHTML = clubPageTemplate;
        updateClubsList();
    }
}

/**
 * get club data
 * @param {string} clubId 
 */
function getClubData(clubId) {
    return store.getState().clubs.find((/** @type {Club} */ club) => club.id === clubId);
}

/**
 * render club details
 * @param {Club} club 
 */
function renderClubDetails(club) {
    const clubDetailName = /** @type {HTMLElement} */ document.getElementById('clubDetailName')
    const clubDetailDescription = /** @type {HTMLElement} */document.getElementById('clubDetailDescription')

    if (clubDetailName) clubDetailName.textContent = club.name;
    if (clubDetailDescription) clubDetailDescription.textContent = club.description;
}

/**
 * render member details
 * @param {Club} club 
 */
function renderMemberDetails(club) {
    const membersList = document.getElementById('clubMembersList');
    if (!membersList) {
        return;
    }

    membersList.innerHTML = club.members.map((memberId) => {
        const member = store.getState().users.find((/** @type {User} */ user) => user.id === memberId);
        const isAdmin = club.admins.includes(memberId);

        return `
        <li>${member ? member.name : ''} ${isAdmin ? '(Administrador)' : '(Miembro)'}</li>
        `
    }).join('');
}

/**
 * render club proposals
 * @param {Club} club 
 */
function renderClubProposals(club) {
    const proposalsList = document.getElementById('clubProposalsList');
    if (!proposalsList) {
        return;
    }

    proposalsList.innerHTML = club.productProposals.map(proposalId => {
        const proposal = store.getState().proposals.find((/** @type {Proposal} */ proposal) => proposal.id === proposalId);
        return proposal ? `<li>${proposal.product} (Propuesta de: ${proposal.user})</li>` : '';
    }).join('');
}

/**
 * add join club event listener
 */
function addJoinListenerToClubsList() {
    const joinClubButton = document.querySelectorAll('.joinClubButton');
    joinClubButton.forEach((button) => {
        button.addEventListener('click', (e) => {
            const target = /** @type {HTMLElement} */ (e.target)
            if (target) {
                const clubId = target.getAttribute('data-id');
                if (clubId) {
                    joinClub(clubId);
                }
            }
        })
    }) 
}

/**
 * join club
 * @param {string} clubId 
 */
function joinClub(clubId) {
    const loggedUser = getLoggedUserData();
    if (!loggedUser) {
        alert('Debes iniciar sesión para unirte a un club');
        return;
    }

    const clubToJoin = store.getState().clubs.find((/** @type {Club} */ club) => club.id === clubId);
    if (clubToJoin) {

        const updatedClub = {
            ...clubToJoin,
            members: [...clubToJoin.members, loggedUser.id]
        };

        const updatedUser = {
            ...loggedUser,
            clubs: [...loggedUser.clubs, clubId]
        }

        store.club.update(updatedClub);
        store.user.update(updatedUser);
        sessionStorage.setItem('loggedUser', JSON.stringify(updatedUser));
        store.saveState();
        visitClubPage(clubId)
    }
    console.log(store.getState())
}

/**
 * add leave club event listener
 */
function addLeaveListenerToClubsList() {
    const leaveClubButton = document.querySelectorAll('.leaveClubButton');
    leaveClubButton.forEach((button) => {
        button.addEventListener('click', (e) => {
            const target = /** @type {HTMLElement} */ (e.target)
            if (target) {
                const clubId = target.getAttribute('data-id');
                if (clubId) {
                    leaveClub(clubId);
                }
            }
        })
    });
}

/**
 * leave club
 * @param {string} clubId 
 */
function leaveClub(clubId) {
    const loggedUser = getLoggedUserData();
    if (!loggedUser) {
        alert('Debes iniciar sesión para salir de un club');
        return;
    }

    const clubToLeave = store.getState().clubs.find((/** @type {Club} */ club) => club.id === clubId);
    if (clubToLeave) {

        const updatedClub = {
            ...clubToLeave,
            members: clubToLeave.members.filter((/** @type {string} */ memberId) => memberId !== loggedUser.id)
        };

        const updatedUser = {
            ...loggedUser,
            clubs: loggedUser.clubs.filter((/** @type {string} */ clubId) => clubId !== clubId)
        }

        store.club.update(updatedClub);
        store.user.update(updatedUser);
        sessionStorage.setItem('loggedUser', JSON.stringify(updatedUser));
        store.saveState();

        const dynamicContent = document.getElementById('dynamic-content');
        if (dynamicContent) {
            dynamicContent.innerHTML = clubPageTemplate;
        }
        loadClubsPage();
        
    }
    console.log(store.getState())
}

/**
 * add edit club event listener
 */
function addEditListenerToClubsList() {
    const editClubButton = document.querySelectorAll('.editClubButton');
    editClubButton.forEach((button) => {
        button.addEventListener('click', (e) => {
            const target = /** @type {HTMLElement} */ (e.target)
            if (target) {
                const clubId = target.getAttribute('data-id');
                if (clubId) {
                    editClub(clubId);
                }
            }
        });
    });
}

/**
 * edit club
 * @param {string} clubId 
 */
function editClub(clubId) {
    if (clubId) {
    alert('No tio, no me jodas. Dame un respiro, tronco. (No implementado)');
    }
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
        loadClubsPage();
        store.saveState();
    }
}

//TODO: PUES ESO, HACERLO XD
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


//TODO: QUE LOS USER PUEDAN "CREAR PRODUCTOS" SI NO ESTÁN EN DB
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
