// @ts-check


// /** @typedef {import('./classes/Product.js').Product} Product */
// /** @typedef {import('./classes/Product.js').Movie} Movie */
// /** @typedef {import('./classes/Proposal.js').Proposal} Proposal } */
// /** @typedef {import('./classes/Product.js').Book} Book */


/** @import {Club} from "./classes/Club.js"; */
/** @import {Product, Book, Movie} from "./classes/Product.js" */
/** @import {Proposal} from "./classes/Proposal.js"; */
/** @import {Votes} from "./classes/Votes.js"; */

/** @typedef {import('./components/LoginForm/LoginForm.js').LoginForm} LoginForm */
/** @typedef {import('./components/RegisterForm/RegisterForm.js').RegisterForm} RegisterForm */
/** @typedef {import('./components/ClubDetail/ClubDetail.js').ClubDetail} ClubDetail*/

import  "./components/bundle.js";

import {store} from "./store/redux.js";
import {ProductFactory, PRODUCT_TYPE,} from "./classes/Product.js";
import {User} from "./classes/User.js";
// import {Club} from "./classes/Club.js";
// import {Proposal} from "./classes/Proposal.js";

// import { generateClubActionButtons } from "./lib/generateClubActionButtons.js";
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

    const loggedUserData = {
        _id: apiUserData._id,
        email: apiUserData.email,
        name: apiUserData.name,
        token: apiUserData.token,
        clubs: apiUserData.clubs || [],
        products: apiUserData.products || [],
        proposals: apiUserData.proposals || [],
        votes: apiUserData.votes || [],
    };

    sessionStorage.setItem('loggedUser', JSON.stringify(loggedUserData));
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

        const loggedUserData = {
            _id: apiUserData._id,
            email: apiUserData.email,
            name: apiUserData.name,
            token: apiUserData.token,
            clubs: apiUserData.clubs || [],
            products: apiUserData.products || [],
            proposals: apiUserData.proposals || [],
            votes: apiUserData.votes || [],
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
    const authForms = document.getElementById('auth-forms');
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
        <club-list-item club='${JSON.stringify(club)}'></club-list-item>
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
        const selectedTypeRadio = document.querySelector('input[name="club-type-filter"]:checked');
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

        dynamicContent.innerHTML = clubDetailPageTemplate(apiClubData);

        const backToClubsListButton = document.getElementById('back-to-clubs-list-button');
        if (backToClubsListButton) {
            backToClubsListButton.addEventListener('click', loadClubsPage);
        }
        
        /** @type {ClubDetail | null}  */
        const clubDetailComponent = document.querySelector('club-detail');
        if (clubDetailComponent) {
            clubDetailComponent.club = apiClubData; 
            initializeClubButtonsListeners(clubDetailComponent); 
        }

        const loggedUser = getLoggedUserData();
        const addProposalButton = document.getElementById('add-proposal-button');
        if (addProposalButton && loggedUser && apiClubData.members.includes(loggedUser._id)) {
            addProposalButton.classList.remove('hidden');
            addProposalButton.addEventListener('click', onAddProposalButtonClick);
        }

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
        const createClubForm = document.getElementById('create-club-form');
        createClubForm?.addEventListener('submit', onCreateClubFormSubmit);
        if (loggedUser && createClubForm) {
            createClubForm.classList.remove('hidden');
        }

        const clubNameFilter = document.getElementById('clubNameFilter');
        if (clubNameFilter) {
            clubNameFilter.addEventListener('input', updateClubsList);
        }

        const filterRadios = document.querySelectorAll('input[name="club-type-filter"]');
        
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

        
        const searchClubButton = document.getElementById('searchClubButton');
        searchClubButton?.addEventListener('click', onSearchClubButtonClick);        
    }
}

/**
 * @typedef {Object} apiProposal
 * @property {string} _id
 * @property {string} productId
 * @property {'book' | 'movie'} productType
 * @property {string} userId
 * @property {string} clubId
 * @property {string} [userName]
 * @property {number} votes
 * @property {Object} [productData]
 * @property {string} productData._id
 * @property {string} productData.name
 * @property {string} productData.genre
 * @property {number} productData.year
 * @property {string} [productData.author]
 * @property {string} [productData.director]
 * @property {number} [productData.pages]
 * @property {number} [productData.minutes]
 */
/**
 * render club proposals
 * @param {Club} club 
 */
async function renderClubProposals(club) {
    const proposalsList = document.getElementById('club-proposals-list');
    if (!proposalsList) return;

    try {
        const apiProposalData = await getAPIProposalData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/proposals`, 'POST', JSON.stringify({ids: club.proposals}));

        if (!apiProposalData || apiProposalData.length === 0) {
            proposalsList.innerHTML = 'No hay propuestas';
            return;
        }

        const loggedUser = getLoggedUserData();

        const userVotes = await getAPIVotesData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/votes`, 'POST', JSON.stringify({ user_id: loggedUser?._id }));


        const votedProposals = userVotes.map((/** @type {{ proposalId: string }} */ vote) => vote.proposalId);

        proposalsList.innerHTML = apiProposalData.map((/** @type {apiProposal} */ apiProposal) => {
            const product = apiProposal.productData;
            if (!product) return '';
            
            const hasVoted = votedProposals.map((/** @type {string} */ id) => String(id)).includes(String(apiProposal._id));

            return `
                <li class="proposal-item">
                    <p><strong>Nombre: </strong>${product.name}</p>
                    <p>${apiProposal.productType === 'book' ? 'Libro' : 'Película'}</p>
                    <p><strong>Propuesta de:</strong> ${apiProposal.userName || 'Usuario desconocido'}</p>
                    <p><strong>Votos: </strong><span class="vote-count">${apiProposal.votes || 0}</span></p>
                    <button class="toggleProposalDetailsButton" data-id="${apiProposal._id}">Ver más</button>
                    <div id="proposal-details-${apiProposal._id}" class="proposal-details hidden">
                        <p><strong>${apiProposal.productType === 'book' ? 'Autor' : 'Director'}:</strong> ${product.author || product.director}</p>
                        <p><strong>Año:</strong> ${product.year}</p>
                        <p><strong>Género:</strong> ${product.genre}</p>
                        ${
                            apiProposal.productType === 'book'
                                ? `<p><strong>Páginas:</strong> ${product.pages}</p>`
                                : `<p><strong>Minutos:</strong> ${product.minutes} min</p>`
                        }
                    </div>
                    ${hasVoted ? '' : `<button class="voteProposalButton" data-id="${apiProposal._id}">+1 Voto</button>`}
                </li>
            `;
        }).join('');

        proposalsList.querySelectorAll('.toggleProposalDetailsButton').forEach(button => {
            button.addEventListener('click', (e) => {
                const target = /**@type {HTMLElement} */ (e.target);
                const proposalId = target.getAttribute('data-id');
                const detailsElement = document.getElementById(`proposal-details-${proposalId}`);

                if (detailsElement) {
                    detailsElement.classList.toggle('hidden');
                    target.textContent = detailsElement.classList.contains('hidden') ? 'Ver más' : 'Ver menos';
                }
            });
        });

        proposalsList.querySelectorAll('.voteProposalButton').forEach(button => {
            button.addEventListener('click', async (e) => {
                const target = /**@type {HTMLElement} */ (e.target);
                const proposalId = target.getAttribute('data-id');

                if (proposalId) {
                    await voteForProposal(proposalId);
                }                    
            });
        });

    } catch (error) {
        console.log('Error: ', error);
    }
}

/**
 * @param {string} proposalId - id de la propuesta
 */
async function voteForProposal(proposalId) {
    const loggedUser = getLoggedUserData();
    if (!loggedUser) {
        alert('Debes iniciar sesión para votar por una propuesta');
        return;
    }

    try {
        const response = await getAPIVotesData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/votes`, 'POST', JSON.stringify({proposalId: proposalId, userId: loggedUser._id}));

        const data = response;

        if (data.acknowledged) {
            updateVoteUI(proposalId);
            loggedUser.votes.push(proposalId);
            sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));

        } else {
            console.error('Error al registrar el voto');
        }
        
    } catch (error) {
        console.log('Error al votar: ', error);
    }
}


/**
 * 
 * @param {string} proposalId 
 */
function updateVoteUI(proposalId) {
    const voteButton = document.querySelector(`.voteProposalButton[data-id="${proposalId}"]`);
    if (voteButton) {
        const proposalItem = voteButton.closest('.proposal-item');
        const voteCountElement = proposalItem?.querySelector('.vote-count');

        if (voteCountElement && voteCountElement.textContent !== null) {
            let currentVotes = parseInt(voteCountElement.textContent, 10) || 0;
            voteCountElement.textContent = String(currentVotes + 1);
        }

        if (voteButton instanceof HTMLButtonElement) {
            voteButton.disabled = true;
        }
        voteButton.classList.add('hidden');
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
 * edit club
 * @param {string} clubId 
 */
async function editClub(clubId) {
    const club = await getAPIClubData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/clubs/${clubId}`);

    const membersData = await getAPIUserData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/users`, 'POST', JSON.stringify({ids: club.members}));


    let dialog = document.getElementById('edit-club-dialog');
    if (!dialog) {
        dialog = document.createElement('dialog');
        dialog.id = 'edit-club-dialog';
        dialog.innerHTML = `
            <form method="dialog">
                <h2>Editar Club</h2>
                <label>Nombre:</label>
                <input type="text" id="editClubName" value="${club.name}" required>
                <label>Descripción:</label>
                <textarea id="editClubDescription">${club.description}</textarea>
                
                <h3>Nombrar nuevos administradores</h3>
                <ul id="nonAdminsList">
                    ${membersData
                        .filter((/** @type {User} */ member) => !club.admins.includes(member._id))
                        .map((/** @type {User} */ member) => `<li>${member.name} <button class="assignAdminButton" data-user-id="${member._id}">Nombrar Admin</button></li>`)
                        .join("")}
                </ul>

                <button type="submit" id="saveClubChanges">Guardar cambios</button>
                <button type="button" id="closeDialog">Cancelar</button>
            </form>
        `;
        document.body.appendChild(dialog);
    }

    document.querySelectorAll(".assignAdminButton").forEach((button) => {
        /** @type {HTMLButtonElement} */
        const assignAdminButton = /** @type {HTMLButtonElement} */ (button);
    
        assignAdminButton.onclick = async (event) => {
            const target = event.target;
    
            if (!(target instanceof HTMLElement)) {
                console.error("Error: event.target no es un HTMLElement.");
                return;
            }
    
            const userId = target.dataset.userId || "";
    
            if (!userId.trim()) {
                console.error("Error: userId no es válido.");
                return;
            }
    
            await assignAdmin(clubId, userId);
        };
    });

    if (dialog instanceof HTMLDialogElement) dialog.showModal();

    const saveButton = document.getElementById("saveClubChanges");
    if (saveButton) {
        saveButton.onclick = () => saveClubChanges(clubId);  
    } 
    
    const closeDialog = document.getElementById("closeDialog");
    if (closeDialog && dialog instanceof HTMLDialogElement) {
        closeDialog.onclick = () => dialog.close();
    } 
}

/**
 * 
 * @param {String} clubId 
 */
async function saveClubChanges(clubId) {

    const editClubName = document.getElementById('editClubName')

    const editClubDescription = document.getElementById('editClubDescription')

    if (editClubName instanceof HTMLInputElement && editClubDescription instanceof HTMLInputElement) {
        
        const updatedClub = {
            name: editClubName.value,
            description: editClubDescription.value, 
        };

        const response = await getAPIClubData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/clubs/${clubId}`, 'PUT', JSON.stringify(updatedClub));

        if(!response){
            alert('Hubo un error al actualizar el club');
            return;
        }

        alert('Club actualizado correctamente');

        const editClubDialog = document.getElementById('edit-club-dialog');
        if (editClubDialog instanceof HTMLDialogElement) editClubDialog.close();
        await loadClubsPage();
    }
}



/**
 * @param {string} clubId - The ID of the club.
 * @param {string} userId - The ID of the user to be assigned as admin.
 */

async function assignAdmin(clubId, userId) {
    const payload = JSON.stringify({ userId });
    await getAPIClubData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/clubs/${clubId}/admins`, 'PUT', payload);

    alert('Admin asignado correctamente');
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

//=====PROPOSAL EVENTS=====//

/**
 * 
 * @param {MouseEvent} e 
 */
function onAddProposalButtonClick(e) {
    e.preventDefault();

    const addProposalTypeForm = document.getElementById('add-proposal-type-form');
    if (!addProposalTypeForm) return;

    /** @type {ClubDetail | null} */
    const clubDetailComponent = document.querySelector('club-detail');
    if (!clubDetailComponent) return;
    const clubType = clubDetailComponent.club?.type;

    if (clubType === "book") {
        document.getElementById("bookProposal")?.parentElement?.classList.remove('hidden');
    } else if (clubType === "movie") {
        document.getElementById("movieProposal")?.parentElement?.classList.remove('hidden');
    } else if (clubType === "mixed") {
        document.getElementById("bookProposal")?.parentElement?.classList.remove('hidden');
        document.getElementById("movieProposal")?.parentElement?.classList.remove('hidden');
    }

    if (addProposalTypeForm) {
        addProposalTypeForm.classList.remove('hidden');

        addProposalTypeForm.addEventListener('change', onProposalTypeChange);
    }

    const addProposalButton = document.getElementById('add-proposal-button');
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
    const createNewProposalContainer = document.getElementById('create-new-proposal-container');

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
async function onCreateNewProposalSubmit(e) {
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

    try {

        const newProduct = await createNewProduct(productData, productType);

        if (newProduct && newProduct._id) {
            await createNewProposal(newProduct._id, productType);
        } else {
            console.log('No se pudo cargar el id del producto');
        }

        const clubDetailPage = document.getElementById('create-detail-page');
        const clubId = clubDetailPage?.getAttribute('data-id');

        if (clubId) {
            const updatedClubData = await getAPIClubData(
                `${location.protocol}//${location.hostname}${API_PORT}/api/read/clubs/${clubId}`
            );
        
            if (updatedClubData) {
                renderClubProposals(updatedClubData);
            } else {
                console.log("No se encontraron datos actualizados del club");
            }
        }

        form.reset();
        document.getElementById('add-proposal-type-form')?.classList.add('hidden');

        const createNewProposalContainer = document.getElementById('create-new-proposal-container');
        if (createNewProposalContainer) createNewProposalContainer.innerHTML = '';

        document.getElementById('add-proposal-button')?.classList.remove('hidden');

        

    } catch (error) {
        console.log('Error: ', error);
    } 
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

/**
 * @param {string} productId
 * @param {string} productType
 */

async function createNewProposal(productId, productType) {
    const loggedUser = getLoggedUserData();
    const clubDetailPage = document.getElementById('create-detail-page');
    const clubId = clubDetailPage?.getAttribute('data-id');

    if (!loggedUser || !clubId) {
        alert("Debes estar en un club para agregar una propuesta.");
        return;
    }

    const newProposal = {
        productId,
        productType,
        userId: loggedUser._id,
        clubId,
    };

    try {
        const response = await getAPIProposalData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/proposals`, 'POST', JSON.stringify(newProposal));


        if(!response) {
            throw new Error('No se pudo crear la propuesta.');
        }

        loggedUser.proposals.push(response._id);
        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));

        alert('La propuesta se ha registrado correctamente.');
        return response;

    } catch (error) {
        console.log('Error: ', error);
    }
}

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
    return new Promise((resolve, reject) => {

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
            return reject ('Product type not found');
        }

        let selectedApiFunction;
        let requestEndpoint;

        switch (productType) {
            case PRODUCT_TYPE.BOOK:
                selectedApiFunction = getAPIBookData;
                requestEndpoint = `${location.protocol}//${location.hostname}${API_PORT}/api/create/books`;
                break;
            case PRODUCT_TYPE.MOVIE:
                selectedApiFunction = getAPIMovieData;
                requestEndpoint = `${location.protocol}//${location.hostname}${API_PORT}/api/create/movies`;
                break;
            default:
                console.error('Product type not found');
                return reject ('Product type not found');
        }

        selectedApiFunction?.(requestEndpoint, 'POST', JSON.stringify(newProduct))
        .then(response => {
            resolve(response);
        })
        .catch(error => {
            console.error("Error al crear el producto:", error);
            reject(error);
        });
    });
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

        const loggedUser = getLoggedUserData();
        if (loggedUser) {
            headers.append('Authorization', `Bearer ${loggedUser.token}`)
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
async function getAPIMovieData (apiURL = `${location.protocol}//${location.hostname}${API_PORT}/api/read/movies`, method = 'GET', data) {

    let apiMovieData

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
 * get votes data from BBDD
 * @param {Object} [data]
 */
async function getAPIVotesData (apiURL = `${location.protocol}//${location.hostname}${API_PORT}/api/read/votes`, method = 'GET', data) {

    let apiVotesData

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

        apiVotesData = await simpleFetch(apiURL, {
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
    return apiVotesData
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
