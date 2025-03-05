// @ts-check

/** @import {Club} from "./classes/Club.js"; */
/** @import {User} from "./classes/User.js"; */

/** @typedef {import('./components/LoginFormLit/LoginFormLit.js').LoginFormLit} LoginFormLit */
/** @typedef {import('./components/RegisterForm/RegisterForm.js').RegisterForm} RegisterForm */
/** @typedef {import('./components/ClubDetail/ClubDetail.js').ClubDetail} ClubDetail*/

import  "./components/bundle.js";

import {ProductFactory, PRODUCT_TYPE,} from "./classes/Product.js";

import { getAPIData, API_PORT } from "./utils/apiService.js";
import { handleLogin, getLoggedUserData, checkAuthStatus, } from "./utils/authService.js";
import { filterClubs, createNewClub, deleteClub, joinClub, leaveClub, editClub } from "./utils/clubService.js";

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

    const loginWrapper = /** @type {LoginFormLit | null} */ (document.getElementById('loginWrapper'))
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

    const clubNameInput = /** @type {HTMLInputElement} */ (document.getElementById('clubName'));
    const clubDescriptionInput = /** @type {HTMLTextAreaElement} */ (document.getElementById('clubDescription'));
    const clubTypeSelect = /** @type {HTMLSelectElement} */ (document.getElementById('clubType'));
    const clubVisibilityInput = /** @type {HTMLInputElement} */ (document.querySelector('input[name="clubVisibility"]:checked'));

    if (!clubNameInput || !clubDescriptionInput || !clubTypeSelect || !clubVisibilityInput) {
        alert('Todos los campos son obligatorios');
        return;
    }

    const isPrivate = clubVisibilityInput.value === 'private';
    let clubPassword = null;

    if (isPrivate) {
        const clubPasswordInput = /** @type {HTMLInputElement} */ (document.getElementById('clubPassword'));
        if (!clubPasswordInput?.value) {
            alert('Debes ingresar una contraseña para crear un club privado');
            return;
        }
        clubPassword = clubPasswordInput.value;
    }

    const newClub = {
        _id: null,
        name: clubNameInput.value,
        description: clubDescriptionInput.value,
        type: clubTypeSelect.value,
        private: isPrivate,
        password: clubPassword,
        admins: [],
        members: [],
        proposals: [],
        productCurrent: null,
        deadlineCurrent: null,
    };

    const createdClub = await createNewClub(newClub);

    if (createdClub) {
        cleanUpNewClubForm();
        await updateClubsList();
    }
}


//=====CLUB METHODS=====//

/**
 * clean up new club form
 */
function cleanUpNewClubForm() {
    const clubNameInput = /** @type {HTMLInputElement} */ (document.getElementById('clubName'));
    const clubDescriptionInput = /** @type {HTMLTextAreaElement} */ (document.getElementById('clubDescription'));
    const clubVisibilityInputs = /** @type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll('input[name="clubVisibility"]'));

    if (clubNameInput) clubNameInput.value = '';
    if (clubDescriptionInput) clubDescriptionInput.value = '';
    clubVisibilityInputs.forEach(radio => (radio.checked = false));
}

/**
 * update clubs list
 */
async function updateClubsList() {
    const clubsList = document.getElementById('clubsList');
    if (!clubsList) {
        console.warn("[updateClubsList] No clubsList element found in the DOM.");
        return;
    }

    const userClubs = await filterClubs();

    if (!userClubs || userClubs.length === 0) {
        console.warn("[updateClubsList] No clubs found.");
        clubsList.innerHTML = "<p>No se encontraron clubs</p>";
        return;
    }

    clubsList.innerHTML = userClubs.map((club) => `
        <club-list-item club='${JSON.stringify(club)}'></club-list-item>
    `).join('');

    initializeClubButtonsListeners(clubsList);
}

/**
 * @param {HTMLElement} container
 */
function initializeClubButtonsListeners (container) {

    container.removeEventListener('visit-club', async (event) => {
        await onVisitClubClick(/** @type {CustomEvent} */ (event));
    });
    container.addEventListener('visit-club', async (event) => {
        await onVisitClubClick(/** @type {CustomEvent} */ (event));
    });

    container.removeEventListener('join-club', async (event) => {
        await onJoinClub(/** @type {CustomEvent} */ (event));
    });
    container.addEventListener('join-club', async (event) => {
        await onJoinClub(/** @type {CustomEvent} */ (event));
    });
    
    container.removeEventListener('leave-club',  async (event) => {
        await onLeaveClub(/** @type {CustomEvent} */ (event));
    });
    container.addEventListener('leave-club', async (event) => {
        await onLeaveClub(/** @type {CustomEvent} */ (event));
    });

    container.removeEventListener('edit-club', async (event) => {
        await onEditClub(/** @type {CustomEvent} */ (event));
    });
    container.addEventListener('edit-club', async (event) => {
        await onEditClub(/** @type {CustomEvent} */ (event));
    });
    
    container.removeEventListener('delete-club', async (event) => {
        await onDeleteClub(/** @type {CustomEvent} */ (event));
    });
    container.addEventListener('delete-club', async (event) => {
        await onDeleteClub(/** @type {CustomEvent} */ (event));
    });
}

/**
 * @param {CustomEvent} event
 */
async function onVisitClubClick(event) {
    const {clubId} = /** @type {CustomEvent} */ (event).detail;
    await visitClubPage(clubId);
}

/**
 * @param {CustomEvent} event
 */
async function onJoinClub(event) {
    const { clubId, password } = /** @type {CustomEvent} */ (event).detail;
    await joinClub(clubId, password);
    await visitClubPage(clubId);

}

/**
 * @param {CustomEvent} event
 */
async function onLeaveClub(event) {
    const { clubId } = /** @type {CustomEvent} */ (event).detail;
    await leaveClub(clubId);
    await loadClubsPage();
}

/**
 * @param {CustomEvent} event
 */
async function onEditClub(event) {
    const { clubId } = /** @type {CustomEvent} */ (event).detail;
    await editClub(clubId);
    await loadClubsPage();
}

/**
 * @param {CustomEvent} event
 */
async function onDeleteClub(event) {
    const { clubId } = /** @type {CustomEvent} */ (event).detail;
    await deleteClub(clubId);
    await loadClubsPage();
}

/**
 * visit club page
 * @param {string} clubId
 */
export async function visitClubPage(clubId) {
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

/**
 * Loads and renders the clubs page.
 */
export async function loadClubsPage() {
    const dynamicContent = document.getElementById('dynamic-content');
    if (!dynamicContent) return;

    dynamicContent.innerHTML = clubPageTemplate; 

    const clubsList = document.getElementById('clubsList');
    if (clubsList) {
        const clubs = await filterClubs(); 
        clubsList.innerHTML = clubs.map(club => `
            <club-list-item club='${JSON.stringify(club)}'></club-list-item>
        `).join('');

        initializeClubButtonsListeners(clubsList);
    }

    const createClubForm = document.getElementById('create-club-form');
    if (createClubForm) {
        createClubForm.addEventListener('submit', onCreateClubFormSubmit);
        if (getLoggedUserData()) createClubForm.classList.remove('hidden');
    }

    const clubNameFilter = document.getElementById('clubNameFilter');
    clubNameFilter?.addEventListener('input', updateClubsList);

    document.querySelectorAll('input[name="club-type-filter"]').forEach(radio => {
        radio.addEventListener('change', updateClubsList);
    });

    
    document.querySelectorAll('input[name="clubVisibility"]').forEach(input => {
        const visibilityInput = /** @type {HTMLInputElement} */ (input);
        visibilityInput.addEventListener('change', () => {
            const clubPasswordField = /** @type {HTMLElement | null} */ (document.getElementById('clubPasswordField'));
            if (clubPasswordField) {
                clubPasswordField.classList.toggle('hidden', visibilityInput.value !== 'private');
            }
        });
    });

    const searchClubButton = document.getElementById('searchClubButton');
    searchClubButton?.addEventListener('click', onSearchClubButtonClick);
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
