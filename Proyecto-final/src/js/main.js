// @ts-check

/** @import {Club} from "./classes/Club.js"; */
/** @import {User} from "./classes/User.js"; */

/** @typedef {import('./components/LoginForm/LoginForm.js').LoginForm} LoginForm */
/** @typedef {import('./components/RegisterForm/RegisterForm.js').RegisterForm} RegisterForm */
/** @typedef {import('./components/ClubDetail/ClubDetail.js').ClubDetail} ClubDetail*/

import  "./components/bundle.js";

import {store} from "./store/redux.js";
import {ProductFactory, PRODUCT_TYPE,} from "./classes/Product.js";

import { getAPIData, API_PORT } from "./utils/apiService.js";
import { handleLogin, getLoggedUserData, checkAuthStatus, } from "./utils/authService.js";

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
     * check auth status
     */
    checkAuthStatus()
    

    
    // ==EVENT LISTENERS==//

    // Login web component listener    
    window.addEventListener('login-form-submit', (event) => {
        onLoginComponentSubmit(/** @type {CustomEvent} */ (event).detail)
    })
    
    //register web component listener
    window.addEventListener('register-form-submit', (event) => {
        onRegisterComponentSubmit(/** @type {CustomEvent} */ (event).detail)
    })

    //show club template
    const clubsPageLink = document.getElementById('clubsPageLink')
    clubsPageLink?.addEventListener('click', onClubsPageLinkClick)
}


//=====USER=====//

/**
 * @param {User} apiUserData
 * @returns void
 */
async function onLoginComponentSubmit(apiUserData) {
    await handleLogin(apiUserData)

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
    await handleLogin(apiUserData)

    const registerWrapper = /** @type {RegisterForm | null} */ (document.getElementById('registerWrapper'))
    registerWrapper?.cleanUpRegisterForm();

    checkAuthStatus()
    await updateClubsList()    
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
        const clubs = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/filter/clubs/${searchValue}`, 'GET');

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
        const apiClubData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/clubs`, 'POST',  payload);

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

        const apiClubsData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/clubs`, 'POST', JSON.stringify({type: selectedTypeFilter !== "all" ? selectedTypeFilter : undefined}));
        
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
        const apiClubData = await getAPIData(
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
        const apiProposalData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/proposals`, 'POST', JSON.stringify({ids: club.proposals}));

        if (!apiProposalData || apiProposalData.length === 0) {
            proposalsList.innerHTML = 'No hay propuestas';
            return;
        }

        const loggedUser = getLoggedUserData();

        const userVotes = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/votes`, 'POST', JSON.stringify({ user_id: loggedUser?._id }));


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
        const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/votes`, 'POST', JSON.stringify({proposalId: proposalId, userId: loggedUser._id}));

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

        const response = await getAPIData(
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

        await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/leave/clubs/${clubId}`, 'PUT', updateData);

        
        loggedUser.clubs = loggedUser.clubs.filter((/** @type {string} */ id) => id !== clubId);
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
    const club = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/clubs/${clubId}`);

    const membersData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/users`, 'POST', JSON.stringify({ids: club.members}));


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

        const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/clubs/${clubId}`, 'PUT', JSON.stringify(updatedClub));

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
    await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/clubs/${clubId}/admins`, 'PUT', payload);

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
        await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/clubs/${clubId}/${loggedUser._id}`, 'DELETE');

        loggedUser.clubs = loggedUser.clubs.filter((/** @type {string} */ id) => id !== clubId);
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
        } 

        const clubDetailPage = document.getElementById('create-detail-page');
        const clubId = clubDetailPage?.getAttribute('data-id');

        if (clubId) {
            const updatedClubData = await getAPIData(
                `${location.protocol}//${location.hostname}${API_PORT}/api/read/clubs/${clubId}`
            );
        
            if (updatedClubData) {
                renderClubProposals(updatedClubData);
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
        const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/proposals`, 'POST', JSON.stringify(newProposal));


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
                selectedApiFunction = getAPIData;
                requestEndpoint = `${location.protocol}//${location.hostname}${API_PORT}/api/create/books`;
                break;
            case PRODUCT_TYPE.MOVIE:
                selectedApiFunction = getAPIData;
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
