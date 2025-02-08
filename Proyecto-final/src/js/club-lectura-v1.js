// @ts-check


// /** @typedef {import('./classes/Product.js').Product} Product */
// /** @typedef {import('./classes/Product.js').Movie} Movie */
// /** @typedef {import('./classes/Proposal.js').Proposal} Proposal } */
// /** @typedef {import('./classes/Product.js').Book} Book */

// /** @import {User} from  './classes/User.js' */
/** @import {Club} from "./classes/Club.js"; */
/** @import {Product, Book, Movie} from "./classes/Product.js" */
/** @import {Proposal} from "./classes/Proposal.js"; */
 
import {store} from "./store/redux.js";
import {ProductFactory, PRODUCT_TYPE,} from "./classes/Product.js";
import {User} from "./classes/User.js";
// import {Club} from "./classes/Club.js";
// import {Proposal} from "./classes/Proposal.js";

/**
 * import simple fetch + Http Error
 */
import { simpleFetch } from "./lib/simpleFetch.js";
import { HttpError } from "./classes/HttpError.js";


/**
 * import templates
 */
import { clubPageTemplate, clubDetailPageTemplate, bookProposalTemplate, movieProposalTemplate  } from "../templates/dinamic-content.templates.js";

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
async function onLoginFormSubmit(e) {
    e.preventDefault();
    await loginUser()
    cleanUpLoginForm();
    checkAuthStatus()
    await updateClubsList()
}

/**
 * on register form submit
 * @param {SubmitEvent} e
 */
async function onRegisterFormSubmit(e) {
    e.preventDefault();
    await createNewUser()
    await loginNewUser()
    cleanUpRegisterForm()
    checkAuthStatus()
    await updateClubsList()
}

/**
 * on logout button click
 * @param {MouseEvent} e
 */
function onLogoutButtonClick(e) {
    e.preventDefault();
    logoutUser();
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
async function onDeleteUserButtonClick(e) {
    e.preventDefault();
    await deleteUser()
    location.reload();
}

//=====USER METHODS=====//

/**
 * login user
 */
async function loginUser() {
    const loginEmail = /** @type {HTMLInputElement} */ (document.getElementById('loginEmail')).value;
    const loginPassword = /** @type {HTMLInputElement} */ (document.getElementById('loginPassword')).value

    try {
        const requestData = JSON.stringify({email: loginEmail, password: loginPassword});

        const apiResponse = await getAPIUserData(`http://${location.hostname}:3333/login/users`, 'POST', requestData);

        if (!apiResponse || apiResponse.length === 0) {
            throw new Error ('El email o la contraseña son incorrectos');
        }

        const apiUserData = await apiResponse;

        const loggedUserData = {
            id: apiUserData.id,
            email: apiUserData.email,
            name: apiUserData.name,
            password: '',
            clubs: apiUserData.clubs || [],
            products: apiUserData.products || [],
            productProposals: apiUserData.productProposals || [],
            proposalVotes: apiUserData.proposalVotes || []
        };

        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUserData));
        store.user.create(new User(loggedUserData));
        store.saveState();

    } catch (error) {
        console.log('Error: ', error);
    }
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
async function createNewUser() {
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

    const payload = JSON.stringify(newUser);
    await getAPIUserData(`http://${location.hostname}:3333/create/users`, 'POST',  payload);
}

/**
 * login new user
 */
async function loginNewUser() {
    const loginEmail = /** @type {HTMLInputElement} */ (document.getElementById('registerEmail')).value 
    const loginPassword = /** @type {HTMLInputElement} */ (document.getElementById('registerPassword')).value 

    try {
        const requestData = JSON.stringify({email: loginEmail, password: loginPassword});

        const apiResponse = await getAPIUserData(`http://${location.hostname}:3333/login/users`, 'POST', requestData);

        if (!apiResponse || apiResponse.length === 0) {
            throw new Error ('El email o la contraseña son incorrectos');
        }

        const apiUserData = apiResponse;

        const loggedUserData = {
            id: apiUserData.id,
            email: apiUserData.email,
            name: apiUserData.name,
            password: '',
            clubs: apiUserData.clubs || [],
            products: apiUserData.products || [],
            productProposals: apiUserData.productProposals || [],
            proposalVotes: apiUserData.proposalVotes || []
        };

        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUserData));
        store.user.create(new User(loggedUserData));
        store.saveState();

    } catch (error) {
        console.log('Error: ', error);
    }
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
    localStorage.removeItem('storedData');
    localStorage.removeItem('isApiDataProcessed');
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
async function deleteUser() {
    const loggedUser = getLoggedUserData();

    // const deleteUserName = /** @type {HTMLInputElement} */ (document.getElementById('deleteUserName')).value
    const deleteUserEmail = /** @type {HTMLInputElement} */ (document.getElementById('deleteUserEmail')).value
    const deleteUserPassword = /** @type {HTMLInputElement} */ (document.getElementById('deleteUserPassword')).value

    const requestData = JSON.stringify({email: deleteUserEmail, password: deleteUserPassword});

    try {const apiResponse = await fetch(`http://${location.hostname}:3333/delete/users/${loggedUser?.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestData
    }); 

    const responseData = await apiResponse.json();

    if (!responseData.success) {
        throw new Error(responseData.message);
    }

    const userToDelete = store.getState().users.find((/** @type {User} */ user) => user.id === loggedUser?.id);
    if (userToDelete) {
        store.user.delete(userToDelete);
    store.saveState();
    }
    sessionStorage.removeItem('loggedUser');
    alert('Cuenta eliminada con exito');
    location.reload();

    } catch (error) {
        console.log('Error: ', error);
    }
}

//=====CLUB EVENTS=====//

/**
 * show club template
 * @param {MouseEvent} e 
 */
async function onClubsPageLinkClick(e) {
    e.preventDefault();
    const dynamicContent = document.getElementById('dynamic-content');
    if (dynamicContent) {
    await loadClubsPage()

    // event listener for create new club
    const createClubForm = document.getElementById('createClubForm');
    createClubForm?.addEventListener('submit', onCreateClubFormSubmit);
    }
}

/**
 * on create club form submit
 * @param {SubmitEvent} e
 */
async function onCreateClubFormSubmit(e) {
    e.preventDefault();
    await createNewClub();
    cleanUpNewClubForm();
    await updateClubsList();
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
async function createNewClub() {
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

    const payload = JSON.stringify(newClub);
    const apiClubData = await getAPIClubData(`http://${location.hostname}:3333/create/clubs`, 'POST',  payload);

    const updatePayload = JSON.stringify({clubs: [...loggedUser.clubs, apiClubData.id]});
    const apiUserUpdate = await getAPIUserData(`http://${location.hostname}:3333/update/users/${loggedUser.id}`, 'PUT', updatePayload);

    const userWithoutPassword = {...apiUserUpdate, password: ''};

    sessionStorage.setItem('loggedUser', JSON.stringify(userWithoutPassword));
    store.user.update(userWithoutPassword);
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
async function updateClubsList() {
    const clubsList = document.getElementById('clubsList');
    const loggedUser = getLoggedUserData();

    try {
        const apiClubsData = await getAPIClubData(`http://${location.hostname}:3333/read/clubs`);

        const userClubs = apiClubsData.filter((/** @type {Club} */ club) => {
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
            initializeListenersToClubButtons()
        }
    } catch (error) {
        console.log('Error: ', error);
    }
}

function initializeListenersToClubButtons() {
    addJoinListenerToClubsList()
    addLeaveListenerToClubsList()
    addEditListenerToClubsList()
    addDeleteListenerToClubsList()
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
async function addVisitListenerToClubsList(){
    const visitClubButton = document.querySelectorAll('.visitClubButton');
    visitClubButton.forEach((button) => {
        button.addEventListener('click', async (e) => {
            const target = /** @type {HTMLElement} */ (e.target)
            if (target) {
                const clubId = target.getAttribute('data-id');
                if (clubId) {
                    await visitClubPage(clubId);
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
async function visitClubPage(clubId) {
    const dynamicContent = document.getElementById('dynamic-content');
    if (!dynamicContent) {
        return;
    }

    try {
        const apiClubData = await getAPIClubData(
            `http://${location.hostname}:3333/filter/clubs`, 'POST',
            JSON.stringify({id: clubId})
            );

        if (!apiClubData || apiClubData.length === 0) {
            throw new Error ('Club no encontrado');
        }

        const club = apiClubData[0];
        dynamicContent.innerHTML = clubDetailPageTemplate(clubId);
        const loggedUser = getLoggedUserData();
        const backToClubsListButton = document.getElementById('backToClubsListButton');

        if (backToClubsListButton) {
            backToClubsListButton.addEventListener('click', loadClubsPage);
        }

        if (loggedUser) {    
            const clubActionButtonsContainer = document.getElementById('clubActionButtonsContainer');
            if (clubActionButtonsContainer) {
                clubActionButtonsContainer.innerHTML = generateClubActionButtons(club, loggedUser);
                initializeListenersToClubButtons();
            }
        }

        const addProposalButton = document.getElementById('addProposalButton');
        if (addProposalButton && loggedUser && club.members.includes(loggedUser.id)) {
            addProposalButton.classList.remove('hidden');
            addProposalButton.addEventListener('click', onAddProposalButtonClick);
        }

        renderClubDetails(club);
        renderMemberDetails(club);
        renderClubProposals(club);

    } catch (error) {
        console.log('Error: ', error);
    }
}

async function loadClubsPage() {
    const dynamicContent = document.getElementById('dynamic-content');
    if (dynamicContent) {
        dynamicContent.innerHTML = clubPageTemplate;
        await updateClubsList();
    }
}

/**
 * get club data
 * @param {string} clubId 
 */
// function getClubData(clubId) {
//     return store.getState().clubs.find((/** @type {Club} */ club) => club.id === clubId);
// }

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
async function joinClub(clubId) {
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
        await visitClubPage(clubId)
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
async function leaveClub(clubId) {
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
        await loadClubsPage();
        
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
async function deleteClub(clubId) {

    const apiClubData = await getAPIClubData(`http://${location.hostname}:3333/delete/clubs/${clubId}`, 'DELETE');

    // const clubToDelete = store.getState().clubs.find((/** @type {Club} */ club) => club.id === clubId);

    if (apiClubData) {
        store.club.delete(clubId);
        store.saveState();
        await loadClubsPage();
    }
}

//TODO: PUES ESO, HACERLO XD
//=====PROPOSAL EVENTS=====//

/**
 * 
 * @param {MouseEvent} e 
 */
function onAddProposalButtonClick(e) {
    e.preventDefault();

    const addProposalTypeForm = document.getElementById('addProposalTypeForm');
    if (addProposalTypeForm) {
        addProposalTypeForm.classList.remove('hidden');

        addProposalTypeForm.addEventListener('change', onProposalTypeChange);
    }

    const addProposalButton = document.getElementById('addProposalButton');
    if (addProposalButton) {
        addProposalButton.classList.add('hidden');
    }
}

/**
 * @param {Event} e
 */
function onProposalTypeChange(e) {
    e.preventDefault();
    const target = /** @type {HTMLInputElement} */ (e.target);
    const createNewProposalContainer = document.getElementById('createNewProposalContainer');

    if (!createNewProposalContainer || target.name !== 'proposalType') return;

    createNewProposalContainer.innerHTML = '';

    let proposalFormElement;

    if (target.value === 'bookProposal') {
        proposalFormElement = document.createElement('form');
        proposalFormElement.id = 'bookProposalForm';
        proposalFormElement.innerHTML = bookProposalTemplate;
        
    } else if (target.value === 'movieProposal') {
        proposalFormElement = document.createElement('form');
        proposalFormElement.id = 'movieProposalForm';
        proposalFormElement.innerHTML = movieProposalTemplate;
    }

    if (proposalFormElement) {
        createNewProposalContainer.appendChild(proposalFormElement);
        addProposalFormListener(proposalFormElement.id);
    }
}

/**
 * 
 * @param {string} formId 
 */
function addProposalFormListener(formId) {
    
    const proposalForm = document.getElementById(formId);
    if (proposalForm) {
        proposalForm.addEventListener('submit', onCreateNewProposalSubmit);
    }
}

/**
 * 
 * @param {SubmitEvent} e 
 */
function onCreateNewProposalSubmit(e) {
    e.preventDefault();
    const form = /** @type {HTMLFormElement} */ (e.target);
    const formData = getDataFromProposalForm(form)

    let productType;
    if (form.id === 'bookProposalForm') {
        productType = PRODUCT_TYPE.BOOK;
    } else if (form.id === 'movieProposalForm') {
        productType = PRODUCT_TYPE.MOVIE;
    } else {
        return;
    }

    const productData = {
        id: String(formData.id),
        name: String(formData.name),
        year: Number(formData.year),
        genre: String(formData.genre),
        author: String(formData.author),
        director: String(formData.director),
        pages: Number(formData.pages),
        minutes: Number(formData.minutes),
    }

    createNewProduct(productData, productType);

    createNewProposal()


    form.reset();

    document.getElementById('addProposalTypeForm')?.classList.add('hidden');
    document.getElementById('addProposalButton')?.classList.remove('hidden');
}

/**
 * get data form proposal form
 * @param {HTMLFormElement} form
 */
function getDataFromProposalForm(form) {
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
}

//=====PROPOSAL METHODS=====//

function createNewProposal() {
    const loggedUser = getLoggedUserData();
    const user = loggedUser;
    const clubDetailPage = document.getElementById('clubDetailPage');
    const clubId = clubDetailPage?.getAttribute('data-id');

    if (user && clubId) {
        console.log('let me commit')
    }

}

//TODO: QUE LOS USER PUEDAN "CREAR PRODUCTOS" SI NO ESTÁN EN DB
//=====PRODUCT EVENTS=====//




//=====PRODUCT METHODS=====//


/**
 * @typedef {Object} ProductData
 * @prop {string} id
 * @prop {string} name
 * @prop {number} year
 * @prop {string} genre
 * @prop {string} [author]
 * @prop {string} [director]
 * @prop {number} [pages]
 * @prop {number} [minutes]
 */
/**
 * create new product
 * @param {ProductData} productData 
 * @param {string} productType 
 */
function createNewProduct(productData, productType) {
    const productFactory = new ProductFactory();
    let newProduct;

    if (productType === PRODUCT_TYPE.BOOK) {
        newProduct = productFactory.createProduct(PRODUCT_TYPE.BOOK, {
            id: `${productData.name}_${productData.year}`,
            name: productData.name,
            year: productData.year,
            genre: productData.genre,
            author: productData.author,
            pages: productData.pages
        });
    } else if (productType === PRODUCT_TYPE.MOVIE) {
        newProduct = productFactory.createProduct(PRODUCT_TYPE.MOVIE, {
            id: `${productData.name}_${productData.year}`,
            name: productData.name,
            year: productData.year,
            genre: productData.genre,
            director: productData.director,
            minutes: productData.minutes
        });
    } else {
        return;
    }

    store.product.create(newProduct);
    store.saveState();
    console.log(store.getState());
}

//=====API METHODS=====//

/**
 * get user data from BBDD
 * @param {Object} [data]
 */
async function getAPIUserData (apiURL = `http://${location.hostname}:3333/read/users`, method = 'GET', data) {
    
    let apiUserData
    
    try {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', '*')
        if (data) {
          headers.append('Content-Length', String(JSON.stringify(data).length))
        }
        apiUserData = await simpleFetch(apiURL, {
            signal: AbortSignal.timeout(3000),
            method: method,
            body: data ?? undefined,
            headers: headers
        });
    } catch (/** @type {any | HttpError} */ err){
        if (err.name === 'AbortError') {
            console.error('Fetch abortado');
        }
        if (err instanceof HttpError) {
            if (err.response.status === 404) {
                console.error('Error 404: Not Found');
            }
            if (err.response.status === 500) {
                console.error('Error 500: Internal Server Error');
            }
        }
    }

    console.log('apiUserData', apiUserData)
    return apiUserData
}

/**
 * get club data from BBDD
 * @param {Object} [data]
 */
async function getAPIClubData (apiURL = `http://${location.hostname}:3333/read/clubs`, method = 'GET', data) {

    let apiClubData

    try {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', '*')
        if (data) {
          headers.append('Content-Length', String(JSON.stringify(data).length))
        }
        apiClubData = await simpleFetch(apiURL, {
            signal: AbortSignal.timeout(3000),
            method: method,
            body: data ?? undefined,
            headers: headers
        });
    } catch (/** @type {any | HttpError} */ err){
        if (err.name === 'AbortError') {
            console.error('Fetch abortado');
        }
        if (err instanceof HttpError) {
            if (err.response.status === 404) {
                console.error('Error 404: Not Found');
            }
            if (err.response.status === 500) {
                console.error('Error 500: Internal Server Error');
            }
        }
    }
    console.log('apiClubData', apiClubData)
    return apiClubData
}

/**
 * get proposal data from BBDD
 * @param {Object} [data]
 */
async function getAPIProposalData (apiURL = `http://${location.hostname}:3333/read/proposals`, method = 'GET', data) {
    let apiProposalData

    try {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', '*')
        if (data) {
          headers.append('Content-Length', String(JSON.stringify(data).length))
        }
        apiProposalData = await simpleFetch(apiURL, {
            signal: AbortSignal.timeout(3000),
            method: method,
            body: data ?? undefined,
            headers: headers
        });
    } catch (/** @type {any | HttpError} */ err){
        if (err.name === 'AbortError') {
            console.error('Fetch abortado');
        }
        if (err instanceof HttpError) {
            if (err.response.status === 404) {
                console.error('Error 404: Not Found');
            }
            if (err.response.status === 500) {
                console.error('Error 500: Internal Server Error');
            }
        }
    }
    return apiProposalData
}

getAPIProposalData()

/**
 * get book data from BBDD
 * @param {Object} [data]
 */
async function getAPIBookData (apiURL = `http://${location.hostname}:3333/read/books`, method = 'GET', data) {

    let apiBookData

    try {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', '*')
        if (data) {
          headers.append('Content-Length', String(JSON.stringify(data).length))
        }
        apiBookData = await simpleFetch(apiURL, {
            signal: AbortSignal.timeout(3000),
            method: method,
            body: data ?? undefined,
            headers: headers
        });
    } catch (/** @type {any | HttpError} */ err){
        if (err.name === 'AbortError') {
            console.error('Fetch abortado');
        }
        if (err instanceof HttpError) {
            if (err.response.status === 404) {
                console.error('Error 404: Not Found');
            }
            if (err.response.status === 500) {
                console.error('Error 500: Internal Server Error');
            }
        }
    }
    return apiBookData
}

/**
 * get movie data from BBDD
 * @param {Object} [data]
 */
async function getAPIMovieData (apiURL = `http://${location.hostname}:3333/read/movies`, method = 'GET', data) {

    let apiMovieData

    try {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', '*')
        if (data) {
          headers.append('Content-Length', String(JSON.stringify(data).length))
        }
        apiMovieData = await simpleFetch(apiURL, {
            signal: AbortSignal.timeout(3000),
            method: method,
            body: data ?? undefined,
            headers: headers
        });
    } catch (/** @type {any | HttpError} */ err){
        if (err.name === 'AbortError') {
            console.error('Fetch abortado');
        }
        if (err instanceof HttpError) {
            if (err.response.status === 404) {
                console.error('Error 404: Not Found');
            }
            if (err.response.status === 500) {
                console.error('Error 500: Internal Server Error');
            }
        }
    }
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

    console.log('store state: ', store.getState())
}
