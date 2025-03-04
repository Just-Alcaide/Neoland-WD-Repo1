// @ts-check
import { getAPIData, API_PORT } from './apiService.js';
/** @typedef {import("../classes/User.js").User} User */


/**
 * Logs in a user by storing their data in session storage.
 *
 * @param {Object} apiUserData - User data returned from the API upon successful authentication.
 * @param {string} apiUserData._id - The unique identifier of the user.
 * @param {string} apiUserData.email - The user's email.
 * @param {string} apiUserData.name - The user's name.
 * @param {string} apiUserData.token - The authentication token.
 * @param {Array<string>} [apiUserData.clubs=[]] - List of club IDs the user is part of.
 * @param {Array<string>} [apiUserData.products=[]] - List of product IDs associated with the user.
 * @param {Array<string>} [apiUserData.proposals=[]] - List of proposal IDs created by the user.
 * @param {Array<string>} [apiUserData.votes=[]] - List of votes cast by the user.
 * 
* @returns {Promise<void>}
 */

export async function handleLogin(apiUserData) {
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
 * Retrieves the logged-in user data from session storage.
 * 
 * @returns {User | null} The user data if available, otherwise `null`.
 */
export function getLoggedUserData() {
    const storedUser = sessionStorage.getItem('loggedUser');
    return storedUser ? JSON.parse(storedUser) : null
}

/**
 * Checks the authentication status of the user and updates the UI accordingly.
 *
 * If the user is logged in, it:
 * - Hides the authentication forms.
 * - Displays the user menu with logout and delete account options.
 * - Updates the welcome message.
 *
 * @returns {void}
 */
export function checkAuthStatus() {
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
    
            document.getElementById('logoutButton')?.addEventListener('click', logoutUser);
            document.getElementById('deleteAccountButton')?.addEventListener('click', deleteAccountForm);
        }

        if (welcomeMessage) {
            welcomeMessage.innerText = `Bienvenid@, ${loggedUser.name}, a Sophia Social, tu comuniad de lectura y cine.`;
        }
    }
}

/**
 * Logs out the user by clearing session storage and reloading the page.
 *
 * @returns {void}
 */
export function logoutUser() {
    sessionStorage.removeItem('loggedUser');
    location.reload();
}

/**
 * Displays the delete account confirmation popup.
 *
 * - If the user clicks "Cancel", the popup closes.
 * - If the user clicks "Delete", it calls `deleteUser()`.
 *
 * @returns {void}
 */
export function deleteAccountForm() {
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
    
    document.getElementById('deleteUserButton')?.addEventListener('click', deleteUser);
}

/**
 * Deletes the currently logged-in user's account.
 *
 * Steps:
 * 1. Validates the user's credentials with the server.
 * 2. If validation fails, displays an error message.
 * 3. If successful, deletes the user's account from the database.
 * 4. Removes the user from session storage.
 * 5. Displays a confirmation message and reloads the page.
 *
 * @returns {Promise<void>}
 */

export async function deleteUser() {
    const loggedUser = getLoggedUserData();

    const deleteUserEmail = /** @type {HTMLInputElement} */ (document.getElementById('deleteUserEmail')).value
    const deleteUserPassword = /** @type {HTMLInputElement} */ (document.getElementById('deleteUserPassword')).value

    try {
        const validationData = JSON.stringify({email: deleteUserEmail, password: deleteUserPassword});

        const validationResponse = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/validate/users`, 'POST', validationData);

        if (!validationResponse.success) {
            alert(validationResponse.message);
            throw new Error(validationResponse.message);
        }

        await getAPIData (`${location.protocol}//${location.hostname}${API_PORT}/api/delete/users/${loggedUser?._id}`, 'DELETE');

        sessionStorage.removeItem('loggedUser');
        alert('Cuenta eliminada con exito');
        location.reload();

    } catch (error) {
        console.log('Error: ', error);
    }
}