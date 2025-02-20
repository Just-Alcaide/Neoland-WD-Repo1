
/**
 * Adds event listeners to club action buttons within the specified container.
 * 
 * @param {ShadowRoot | HTMLElement} container - The DOM element containing the club action buttons.
 */

export function addClubButtonsListeners(container) {
    container.querySelector('.joinClubButton')?.addEventListener('click', (e) => handleJoinClub(e, container));
    container.querySelector('.leaveClubButton')?.addEventListener('click', (e) => handleLeaveClub(e, container));
    container.querySelector('.editClubButton')?.addEventListener('click', (e) => handleEditClub(e, container));
    container.querySelector('.deleteClubButton')?.addEventListener('click', (e) => handleDeleteClub(e, container));
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
    const clubId = e.target.getAttribute('data-id');
    const isPrivate = e.target.getAttribute('data-private') === "true";
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
    const clubId = e.target.getAttribute('data-id');

    container.dispatchEvent(new CustomEvent("leave-club", { bubbles: true, composed: true, detail: { clubId }}));
}

/**
 * Handles the "edit club" button click event.
 * Dispatches the "edit-club" custom event with the club ID as detail.
 * @param {MouseEvent} e - The click event.
 * @param {ShadowRoot | HTMLElement} container - The container element that will dispatch the custom event.
 */

function handleEditClub(e, container) {
    const clubId = e.target.getAttribute('data-id');

    container.dispatchEvent(new CustomEvent("edit-club", { bubbles: true, composed: true, detail: { clubId }}));
}

/**
 * Handles the "delete club" button click event.
 * Dispatches the "delete-club" custom event with the club ID as detail.
 * @param {MouseEvent} e - The click event.
 * @param {ShadowRoot | HTMLElement} container - The container element that will dispatch the custom event.
 */

function handleDeleteClub(e, container) {
    const clubId = e.target.getAttribute('data-id');

    container.dispatchEvent(new CustomEvent("delete-club", { bubbles: true, composed: true, detail: { clubId }}));
}