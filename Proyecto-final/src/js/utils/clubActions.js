// @ts-check
/** @typedef {import("../classes/Club.js").Club} Club */
/** @typedef {import("../classes/User.js").User} User */

/**
 * Generates action buttons for a club based on the user's membership and admin status.
 * 
 * @param {Club} club - The club object containing the club details.
 * @param {User} loggedUser - The currently logged-in user object.
 * @returns {string} - The HTML string with the buttons.
 */
export function generateClubActionButtons(club, loggedUser) {
    if (!loggedUser || !club) {
        console.log('Error: Invalid club or logged user data.');
        return '';
    }

    let userButtons = '';

    if (!club.members.includes(loggedUser._id)) {
        userButtons += `<button class="join-club-button" data-id="${club._id}" data-private="${club.private}">Unirse al Club</button>`;
    }
    if (club.members.includes(loggedUser._id)) {
        userButtons += `<button class="leave-club-button" data-id="${club._id}">Salir del Club</button>`;
    }
    if (club.admins.includes(loggedUser._id)) {
        userButtons += `
            <button class="edit-club-button" data-id="${club._id}">Editar Club</button>
            <button class="delete-club-button" data-id="${club._id}">Eliminar Club</button>
        `;
    }

    return userButtons;
}

/**
 * Adds event listeners to club action buttons within the specified container.
 * 
 * @param {ShadowRoot | HTMLElement} container - The DOM element containing the club action buttons.
 */
export function addClubButtonsListeners(container) {
    container.querySelectorAll('.join-club-button').forEach(button =>
        button.addEventListener('click', (e) => handleJoinClub(/** @type {MouseEvent} */ (e), container))
    );

    container.querySelectorAll('.leave-club-button').forEach(button =>
        button.addEventListener('click', (e) => handleLeaveClub(/** @type {MouseEvent} */ (e), container))
    );

    container.querySelectorAll('.edit-club-button').forEach(button =>
        button.addEventListener('click', (e) => handleEditClub(/** @type {MouseEvent} */ (e), container))
    );

    container.querySelectorAll('.delete-club-button').forEach(button =>
        button.addEventListener('click', (e) => handleDeleteClub(/** @type {MouseEvent} */ (e), container))
    );
}

/**
 * Handles the "join club" button click event.
 * Dispatches the "join-club" custom event with the club ID and password as detail.
 * If the club is private, it prompts the user for a password before dispatching the event.
 * @param {MouseEvent} e - The click event.
 * @param {ShadowRoot | HTMLElement} container - The container element that will dispatch the custom event.
 */
function handleJoinClub(e, container) {
    e.preventDefault();
    const target = /** @type {HTMLElement} */ (e.target); 
    const clubId = target.getAttribute('data-id');
    const isPrivate = target.getAttribute('data-private') === "true";
    let password = null;

    if (isPrivate) {
        password = prompt("Este club es privado. Ingresa la contraseña:");
        if (!password) return;
    }

    container.dispatchEvent(new CustomEvent("join-club", { bubbles: true, composed: true, detail: { clubId, password }}));
}

/**
 * Handles the "leave club" button click event.
 * Dispatches the "leave-club" custom event with the club ID as detail.
 * @param {MouseEvent} e - The click event.
 * @param {ShadowRoot | HTMLElement} container - The container element that will dispatch the custom event.
 */
function handleLeaveClub(e, container) {
    e.preventDefault();
    const target = /** @type {HTMLElement} */ (e.target);
    const clubId = target.getAttribute('data-id');

    container.dispatchEvent(new CustomEvent("leave-club", { bubbles: true, composed: true, detail: { clubId }}));
}

/**
 * Handles the "edit club" button click event.
 * Dispatches the "edit-club" custom event with the club ID as detail.
 * @param {MouseEvent} e - The click event.
 * @param {ShadowRoot | HTMLElement} container - The container element that will dispatch the custom event.
 */
function handleEditClub(e, container) {
    const target = /** @type {HTMLElement} */ (e.target);
    const clubId = target.getAttribute('data-id');

    container.dispatchEvent(new CustomEvent("edit-club", { bubbles: true, composed: true, detail: { clubId }}));
}

/**
 * Handles the "delete club" button click event.
 * Dispatches the "delete-club" custom event with the club ID as detail.
 * @param {MouseEvent} e - The click event.
 * @param {ShadowRoot | HTMLElement} container - The container element that will dispatch the custom event.
 */
function handleDeleteClub(e, container) {
    const target = /** @type {HTMLElement} */ (e.target);
    const clubId = target.getAttribute('data-id');

    container.dispatchEvent(new CustomEvent("delete-club", { bubbles: true, composed: true, detail: { clubId }}));
}