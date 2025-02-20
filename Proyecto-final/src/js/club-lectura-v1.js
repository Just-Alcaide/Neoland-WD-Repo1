// @ts-check


// /** @typedef {import('./classes/Product.js').Product} Product */
// /** @typedef {import('./classes/Product.js').Movie} Movie */
// /** @typedef {import('./classes/Proposal.js').Proposal} Proposal } */
// /** @typedef {import('./classes/Product.js').Book} Book */

/** @import {Club} from "./classes/Club.js"; */
/** @import {Product, Book, Movie} from "./classes/Product.js" */
/** @import {Proposal} from "./classes/Proposal.js"; */

/** @typedef {import('./components/LoginForm/LoginForm.js').LoginForm} LoginForm */
/** @typedef {import('./components/RegisterForm/RegisterForm.js').RegisterForm} RegisterForm */

import  "./components/bundle.js";

import {store} from "./store/redux.js";
import {ProductFactory, PRODUCT_TYPE,} from "./classes/Product.js";
import {User} from "./classes/User.js";
// import {Club} from "./classes/Club.js";
// import {Proposal} from "./classes/Proposal.js";

import { generateClubActionButtons } from "./lib/generateClubActionButtons.js";
import { simpleFetch } from "./lib/simpleFetch.js";
import { HttpError } from "./classes/HttpError.js";


/**
 * import templates
 */
import { clubPageTemplate, clubDetailPageTemplate, bookProposalTemplate, movieProposalTemplate  } from "../templates/dinamic-content.templates.js";

export const API_PORT = location.port ? `:${location.port}` : '';

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
    // processData()
    
    /**
     * check auth status
     */
    checkAuthStatus()

    

    
    /**
     * show templates
     */
    const clubsPageLink = document.getElementById('clubsPageLink')
    clubsPageLink?.addEventListener('click', onClubsPageLinkClick)
    
    // ==EVENT LISTENERS==//

    // Login web component listener    
    window.addEventListener('login-form-submit', (event) => {
        onLoginComponentSubmit(/** @type {CustomEvent} */ (event).detail)
    })

    //register web component listener
    window.addEventListener('register-form-submit', (event) => {
        onRegisterComponentSubmit(/** @type {CustomEvent} */ (event).detail)
    })
}


//=====USER EVENTS=====//

/**
 * @param {User} apiUserData
 * @returns void
 */
async function onLoginComponentSubmit(apiUserData) {
    await loginUser(apiUserData)

    const loginWrapper = /** @type {LoginForm | null} */ (document.getElementById('loginWrapper'))
    loginWrapper?.cleanUpLoginForm();

    checkAuthStatus()
    await updateClubsList()
}

/**
 * @param {User} apiUserData
 * @returns void
 */
async function onRegisterComponentSubmit(apiUserData) {
    await loginNewUser(apiUserData)

    const registerWrapper = /** @type {RegisterForm | null} */ (document.getElementById('registerWrapper'))
    registerWrapper?.cleanUpRegisterForm();

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
 * @param {User} apiUserData
 */
async function loginUser(apiUserData) {
    if (!apiUserData) {
        alert ('Email o Contraseña incorrectos');
        return;
    }

    console.log(`Desde fuera del componente: `, apiUserData);

    const loggedUserData = {
        _id: apiUserData._id,
        email: apiUserData.email,
        name: apiUserData.name,
        token: apiUserData.token,
        clubs: apiUserData.clubs || [],
        products: apiUserData.products || [],
        proposals: apiUserData.proposals || [],
    };

    sessionStorage.setItem('loggedUser', JSON.stringify(loggedUserData));
    store.user.create(new User(loggedUserData));
    store.saveState();
}

/**
 * get logged user data
 * @returns {User | null}
 */
export function getLoggedUserData() {
    const storedUser = sessionStorage.getItem('loggedUser');
    return storedUser ? JSON.parse(storedUser) : null
}

/**
 * login new user
 * @param {User} apiUserData
 */
async function loginNewUser(apiUserData) {
    if (!apiUserData) {
        alert ('Email o Contraseña incorrectos');
        return;
    }

    console.log(`Desde fuera del componente: `, apiUserData);

        const loggedUserData = {
            _id: apiUserData._id,
            email: apiUserData.email,
            name: apiUserData.name,
            token: apiUserData.token,
            clubs: apiUserData.clubs || [],
            products: apiUserData.products || [],
            proposals: apiUserData.proposals || [],
        };

        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUserData));
        store.user.create(new User(loggedUserData));
        store.saveState();
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

    const deleteUserEmail = /** @type {HTMLInputElement} */ (document.getElementById('deleteUserEmail')).value
    const deleteUserPassword = /** @type {HTMLInputElement} */ (document.getElementById('deleteUserPassword')).value

    try {
        const validationData = JSON.stringify({email: deleteUserEmail, password: deleteUserPassword});

        const validationResponse = await getAPIUserData(`${location.protocol}//${location.hostname}${API_PORT}/api/validate/users`, 'POST', validationData);

        if (!validationResponse.success) {
            alert(validationResponse.message);
            throw new Error(validationResponse.message);
        }

        await getAPIUserData (`${location.protocol}//${location.hostname}${API_PORT}/api/delete/users/${loggedUser?._id}`, 'DELETE');

        store.user.delete(loggedUser);
        store.saveState();
        sessionStorage.removeItem('loggedUser');
        alert('Cuenta eliminada con exito');

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
    await loadClubsPage();
}
}

/**
 * 
 * @param {MouseEvent} e 
 */
function onSearchClubButtonClick(e) {
    e.preventDefault();
    searchClubs()
}

async function searchClubs() {
    const searchInput = document.getElementById('clubSearchName')
    if (!(searchInput instanceof HTMLInputElement)) {
        console.error('Search input not found or is not an input element');
        return;
    }
    const searchValue = searchInput.value.toLowerCase().trim();

    const clubsSearchResultsContainer = document.getElementById('clubsSearchResultsContainer');
    if (!searchValue) {
        console.warn ('Search value is empty');
        if (clubsSearchResultsContainer) {
            clubsSearchResultsContainer.innerHTML = '';
        }
        return;
    }

    try {
        const clubs = await getAPIClubData(`${location.protocol}//${location.hostname}${API_PORT}/api/filter/clubs/${searchValue}`, 'GET');

        renderSearchResults(clubs);

    } catch (error) {
        console.log('Error searching clubs: ', error);
    }
}

/**
 * 
 * @param {Club []} clubs 
 */
function renderSearchResults(clubs) {

    const clubsSearchResultsContainer = document.getElementById('clubsSearchResultsContainer');
    if (!clubsSearchResultsContainer) return;

    clubsSearchResultsContainer.innerHTML = '';

    if (!clubs || clubs.length === 0) {
        clubsSearchResultsContainer.innerHTML = 'No se encontraron clubs';
    }

    clubsSearchResultsContainer.innerHTML = clubs.map((club) => `
        <club-search-item club='${JSON.stringify(club)}'></club-search-item>
    `).join('');

    initializeClubButtonsListeners(clubsSearchResultsContainer)
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
    const clubType = /**@type {HTMLSelectElement} */ (document.getElementById('clubType')).value;
    const clubVisibility = /** @type {HTMLInputElement} */ (document.querySelector('input[name="clubVisibility"]:checked')).value;
    const isPrivate = clubVisibility === 'private';
    let clubPassword = null;
    if (isPrivate){
        clubPassword = /** @type {HTMLInputElement} */ (document.getElementById('clubPassword')).value;
        if (!clubPassword) {
            alert('Debes ingresar una contraseña para crear un club privado');
            return
        }
    }
    

    const loggedUser = getLoggedUserData();
    if (!loggedUser) {
        alert('Debes iniciar sesión para crear un club');
        return;
    }

    const userId = loggedUser._id;

    const newClub = {
        name: clubName,
        description: clubDescription,
        type: clubType,
        private: isPrivate,
        password: isPrivate ? clubPassword : null,
        admins: [loggedUser._id],
        members: [loggedUser._id],
        proposals: [],
        productCurrent: null,
        deadlineCurrent: null,
    };

    const payload = JSON.stringify({...newClub, userId});

    try {
        const apiClubData = await getAPIClubData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/clubs`, 'POST',  payload);

        if (!apiClubData) {
            throw new Error('Error al crear el club');
        }

        loggedUser.clubs.push(apiClubData._id);
        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        store.user.update(loggedUser);
        store.saveState();

    } catch (error) {
        console.log('Error: ', error);
    }
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
        /** @type {HTMLInputElement | null} */
        const selectedTypeRadio = document.querySelector('input[name="clubTypeFilter"]:checked');
        const selectedTypeFilter = selectedTypeRadio ? selectedTypeRadio.value : 'all';

        const clubNameFilter = document.getElementById('clubNameFilter');
        const filterValue = clubNameFilter instanceof HTMLInputElement 
        ? clubNameFilter.value.toLowerCase().trim() 
        : '';

        const apiClubsData = await getAPIClubData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/clubs`, 'POST', JSON.stringify({type: selectedTypeFilter !== "all" ? selectedTypeFilter : undefined}));
        
        const filteredClubs = apiClubsData.filter((/** @type {Club} */ club) => 
            club.name.toLowerCase().includes(filterValue)
        );

        const userClubs = filteredClubs.filter((/** @type {Club} */ club) => {
            if (!loggedUser) {
                return !club.private;
            } else { 
                return !club.private || club.members.includes(loggedUser._id);
            }
        });

        if (clubsList) {
            clubsList.innerHTML = userClubs.map((/** @type {Club} */ club) => `
                    <club-list-item club='${JSON.stringify(club)}'></club-list-item>
                `).join('');

            initializeClubButtonsListeners(clubsList)
        }
    } catch (error) {
        console.log('Error: ', error);
    }
}

/**
 * @param {HTMLElement} container
 */
function initializeClubButtonsListeners (container) {

    container.addEventListener("visit-club", async (event) => {
        const {clubId} = /** @type {CustomEvent} */ (event).detail;
        await visitClubPage((clubId));
    });

    container.addEventListener("join-club", async (event) => {
        const {clubId, password} = /** @type {CustomEvent} */ (event).detail;
        await joinClub(clubId, password)
    });

    container.addEventListener("leave-club", async (event) => {
        const {clubId} = /** @type {CustomEvent} */ (event).detail;
        await leaveClub(clubId);
    });

    container.addEventListener("edit-club", (event) => {
        const {clubId} = /** @type {CustomEvent} */ (event).detail;
        editClub(clubId)
    });

    container.addEventListener("delete-club", async (event) => {
        const {clubId} = /** @type {CustomEvent} */ (event).detail;
        await deleteClub(clubId)
    });
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
// function generateClubActionButtons(club, loggedUser) {
//     if (!loggedUser) return '';
//     let userButtons = '';

//     if (!club.members.includes(loggedUser._id)) {
//         userButtons += `
//             <button class="joinClubButton" data-id="${club._id}" data-private="${club.private}">Unirse al Club</button>`;
//     }
//     if (club.members.includes(loggedUser._id)) {
//         userButtons += `<button class="leaveClubButton" data-id="${club._id}">Salir del Club</button>`;
//     }
//     if (club.admins.includes(loggedUser._id)) {
//         userButtons += `
//             <button class="editClubButton" data-id="${club._id}">Editar Club</button>
//             <button class="deleteClubButton" data-id="${club._id}">Eliminar Club</button>
//         `;}
    
//     return userButtons;
// }

/**
 * add visit club event listener
 */
// async function addVisitListenerToClubsList(){
//     const visitClubButton = document.querySelectorAll('.visitClubButton');
//     visitClubButton.forEach((button) => {
//         button.addEventListener('click', async (e) => {
//             const target = /** @type {HTMLElement} */ (e.target)
//             if (target) {
//                 const clubId = target.getAttribute('data-id');
//                 if (clubId) {
//                     await visitClubPage(clubId);
//                 }
//             }
//         });
//     });
// }

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
            `${location.protocol}//${location.hostname}${API_PORT}/api/read/clubs/${clubId}`);

        if (!apiClubData || apiClubData.length === 0) {
            throw new Error ('Club no encontrado');
        }

        dynamicContent.innerHTML = clubDetailPageTemplate(apiClubData._id);
        
        const loggedUser = getLoggedUserData();
        const backToClubsListButton = document.getElementById('backToClubsListButton');

        if (backToClubsListButton) {
            backToClubsListButton.addEventListener('click', loadClubsPage);
        }

        if (loggedUser) {    
            const clubActionButtonsContainer = document.getElementById('clubActionButtonsContainer');
            if (clubActionButtonsContainer) {
                clubActionButtonsContainer.innerHTML = generateClubActionButtons(apiClubData, loggedUser);
                initializeListenersToClubButtons();
            }
        }

        const addProposalButton = document.getElementById('addProposalButton');
        if (addProposalButton && loggedUser && apiClubData.members.includes(loggedUser._id)) {
            addProposalButton.classList.remove('hidden');
            addProposalButton.addEventListener('click', onAddProposalButtonClick);
        }

        renderClubDetails(apiClubData);
        renderMemberDetails(apiClubData);
        renderClubProposals(apiClubData);

    } catch (error) {
        console.log('Error: ', error);
    }
}

async function loadClubsPage() {
    const dynamicContent = document.getElementById('dynamic-content');
    if (dynamicContent) {
        dynamicContent.innerHTML = clubPageTemplate;
        await updateClubsList();

        const loggedUser = getLoggedUserData();
        const createClubForm = document.getElementById('createClubForm');
        createClubForm?.addEventListener('submit', onCreateClubFormSubmit);
        if (loggedUser && createClubForm) {
            createClubForm.classList.remove('hidden');
        }

        const clubNameFilter = document.getElementById('clubNameFilter');
        if (clubNameFilter) {
            clubNameFilter.addEventListener('input', updateClubsList);
        }

        const filterRadios = document.querySelectorAll('input[name="clubTypeFilter"]');
        
        filterRadios.forEach(radio => {
            radio.addEventListener('change', updateClubsList);
        });

        document.querySelectorAll('input[name="clubVisibility"]').forEach(radio => {
            const input = /** @type {HTMLInputElement} */ (radio);
            input.addEventListener('change', () => {
                const clubPasswordField = document.getElementById('clubPasswordField');
                clubPasswordField?.classList.toggle('hidden', input.value !== 'private');
            })
        })

        //event listener for search club
        const searchClubButton = document.getElementById('searchClubButton');
        searchClubButton?.addEventListener('click', onSearchClubButtonClick);        
    }
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
async function renderMemberDetails(club) {
    const membersList = document.getElementById('clubMembersList');
    if (!membersList) {
        return;
    }

    try {
        const membersData = await getAPIUserData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/users`, 'POST', JSON.stringify({ids: club.members}))

        membersList.innerHTML = membersData.map((/** @type User */ member) => {
            const isAdmin = club.admins.includes(member._id);
            return `
        <li>${member ? member.name : ''} ${isAdmin ? '(Administrador)' : '(Miembro)'}</li>
        `
        }).join('');
    } catch (error) {
        console.log('Error: ', error)
    }
}

/**
 * render club proposals
 * @param {Club} club 
 */
async function renderClubProposals(club) {
    const proposalsList = document.getElementById('clubProposalsList');
    if (!proposalsList) {
        return;
    }

    try {
        const apiProposalData = await getAPIProposalData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/proposals`, 'POST', JSON.stringify({ids: club.proposals}));

        if (!apiProposalData || apiProposalData.length === 0) {
            proposalsList.innerHTML = 'No hay propuestas';
            return;
        }

        proposalsList.innerHTML = apiProposalData.map((/** @type {Proposal} */ proposal) => {
            return `
                <li>
                <-- TODO: METER LOS DATOS DE LAS PROPUESTAS. ${proposal} -->
                </li>
            `;
        }).join('');

        //TODO: METER LISTENERS PARA VOTACIONES

    } catch (error) {
        console.log('Error: ', error);
    }
}

/**
 * add join club event listener
 */
async function addJoinListenerToClubsList() {
    const joinClubButtons = document.querySelectorAll('.joinClubButton');

    joinClubButtons.forEach((button) => {
        button.removeEventListener('click', onJoinClubClick); // Eliminamos eventos previos
        button.addEventListener('click', onJoinClubClick);
    });
}

/**
 * 
 * @param {Event} e 
 * @returns 
 */
async function onJoinClubClick(e) {
    e.preventDefault();

    const target = /** @type {HTMLElement} */ (e.target);
    if (!target) return;

    const clubId = target.getAttribute('data-id') ?? "";
    if (!clubId) { alert("Hubo un error al intentar unirse al club."); return;
    }
    const isPrivate = target.getAttribute('data-private') === "true";
    let password = "";

    if (isPrivate) {
        password = prompt("Este club es privado. Ingresa la contraseña:") ?? "";
        if (!password.trim()) {
            alert("Debes ingresar la contraseña para unirte a este club.");
            return;
        }
    }
    
    try {
        await joinClub(clubId, password);
    } catch (error) {
        console.error("Error al unirse al club:", error);
        alert("Hubo un error al intentar unirse al club.");
    }
}


/**
 * @param {string} clubId
 * @param {string | null} [password]
 */
async function joinClub(clubId, password = null) {
    const loggedUser = getLoggedUserData();
    if (!loggedUser) {
        alert('Debes iniciar sesión para unirte a un club');
        return;
    }

    try {
        const requestData = JSON.stringify({ userId: loggedUser._id, password });

        const response = await getAPIClubData(
            `${location.protocol}//${location.hostname}${API_PORT}/api/join/clubs/${clubId}`, 
            'PUT', 
            requestData
        );

        if (!response || !response.acknowledged) {
            console.warn("Respuesta de la API no válida:", response);
            alert("No se pudo unir al club.");
            return;
        }

        if (!loggedUser.clubs.includes(clubId)) {
            loggedUser.clubs.push(clubId);
        }

        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        store.user.update(loggedUser);
        store.saveState();
        await visitClubPage(clubId);

    } catch (error) {
        console.error("Error al unirse al club:", error);
        alert("Hubo un error al intentar unirse al club.");
    }
}

/**
 * add leave club event listener
 */
async function addLeaveListenerToClubsList() {
    const leaveClubButton = document.querySelectorAll('.leaveClubButton');
    leaveClubButton.forEach((button) => {
        button.addEventListener('click', async (e) => {
            const target = /** @type {HTMLElement} */ (e.target)
            if (target) {
                const clubId = target.getAttribute('data-id');
                if (clubId) {
                    await leaveClub(clubId);
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

    try {
        const updateData = JSON.stringify({ userId: loggedUser._id });

        await getAPIClubData(`${location.protocol}//${location.hostname}${API_PORT}/api/leave/clubs/${clubId}`, 'PUT', updateData);

        loggedUser.clubs = loggedUser.clubs.filter((id) => id !== clubId);
        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        store.user.update(loggedUser);
        store.saveState();
        await loadClubsPage();

        } catch (error) {
        console.log('Error: ', error);
    }
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
    alert(`Editar club: ${clubId} (Funcionalidad en desarrollo)`);
    }
}

/**
 * add delete club event listener
 */
async function addDeleteListenerToClubsList() {
    const deleteClubButtons = document.querySelectorAll('.deleteClubButton');
    deleteClubButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
        const target = /** @type {HTMLElement} */ (e.target)
        if (target) { 
            const clubId = target.getAttribute('data-id');
            if (clubId) {
                await deleteClub(clubId);
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
    const loggedUser = getLoggedUserData();

    if (!loggedUser) {
        alert('Debes iniciar sesión para borrar un club');
        return;
    }

    if (!confirm("¿Estás seguro de eliminar este club?")) return;

    try {
        await getAPIClubData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/clubs/${clubId}/${loggedUser._id}`, 'DELETE');

        loggedUser.clubs = loggedUser.clubs.filter(id => id !== clubId);
        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        store.user.update(loggedUser);
        store.saveState();
        await loadClubsPage();

    } catch (error) {
        console.log('Error: ', error);
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
            name: productData.name,
            year: productData.year,
            genre: productData.genre,
            author: productData.author,
            pages: productData.pages
        });
    } else if (productType === PRODUCT_TYPE.MOVIE) {
        newProduct = productFactory.createProduct(PRODUCT_TYPE.MOVIE, {
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
export async function getAPIUserData (apiURL = `${location.protocol}//${location.hostname}${API_PORT}/api/read/users`, method = 'GET', data) {
    
    let apiUserData
    
    try {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', '*')
        if (data) {
          headers.append('Content-Length', String(JSON.stringify(data).length))
        }
        
        const loggedUser = getLoggedUserData();
        if (loggedUser) {
            headers.append('Authorization', `Bearer ${loggedUser.token}`)
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

    return apiUserData
}

/**
 * get club data from BBDD
 * @param {Object} [data]
 */
export async function getAPIClubData (apiURL = `${location.protocol}//${location.hostname}${API_PORT}/api/read/clubs`, method = 'GET', data) {

    let apiClubData

    try {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', '*')
        if (data) {
          headers.append('Content-Length', String(JSON.stringify(data).length))
        }

        const loggedUser = getLoggedUserData();
        if (loggedUser) {
            headers.append('Authorization', `Bearer ${loggedUser.token}`)
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
    return apiClubData
}

/**
 * get proposal data from BBDD
 * @param {Object} [data]
 */
async function getAPIProposalData (apiURL = `${location.protocol}//${location.hostname}${API_PORT}/api/read/proposals`, method = 'GET', data) {
    let apiProposalData

    try {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', '*')
        if (data) {
          headers.append('Content-Length', String(JSON.stringify(data).length))
        }

        const loggedUser = getLoggedUserData();
        if (loggedUser) {
            headers.append('Authorization', `Bearer ${loggedUser.token}`)
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

/**
 * get book data from BBDD
 * @param {Object} [data]
 */
async function getAPIBookData (apiURL = `${location.protocol}//${location.hostname}${API_PORT}/api/read/books`, method = 'GET', data) {

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
    console.log('apiBookData', apiBookData)
    return apiBookData
}

/**
 * get movie data from BBDD
 * @param {Object} [data]
 */
async function getAPIMovieData (apiURL = `${location.protocol}//${location.hostname}${API_PORT}/api/read/movies`, method = 'GET', data) {

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
    console.log('apiMovieData', apiMovieData)
    return apiMovieData
}

function letMeCommit(){
    getAPIBookData();
    getAPIMovieData();
}

letMeCommit()

/**
 * process Book Data
 */
// async function processBookData () {
//     const apiBookData = await getAPIBookData ();
//     const factory = new ProductFactory ();
//     apiBookData.map(( /** @type {Book} */ product) => {
//         const productData = {
//             id: product._id,
//             name: product.name,
//             year: product.year, 
//             genre: product.genre,
//             author: product.author,
//             pages: product.pages,
//         }

//         const bookInstance = factory.createProduct (PRODUCT_TYPE.BOOK, productData);
//         store.product.create(bookInstance);

//     });
// }

/**
 * process Movie Data
 */
// async function processMovieData () {
//     const apiMovieData = await getAPIMovieData();
//     const factory = new ProductFactory();
//     apiMovieData.map(( /** @type {Movie} */ product) => {
//         const productData = {

//             name: product.name,
//             year: product.year, 
//             genre: product.genre,
//             director: product.director,
//             minutes: product.minutes
//         }
        
//         const movieInstance = factory.createProduct (PRODUCT_TYPE.MOVIE, productData);
//         store.product.create(movieInstance);
//     }); 
// }

/**
 * process products Data
 */
// async function processData() {
//     const isApiDataProcessed = localStorage.getItem('isApiDataProcessed')
//     if (!isApiDataProcessed) {
//         await processBookData()
//         await processMovieData()
//         localStorage.setItem('isApiDataProcessed', 'true')
//         store.saveState()
//     }  

//     console.log('store state: ', store.getState())
// }
