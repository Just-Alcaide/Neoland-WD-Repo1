// @ts-check
/** @typedef {import("../classes/Club.js").Club} Club */
/** @typedef {import("../classes/User.js").User} User */

/**
 * Generates action buttons for a club based on the user's membership and admin status.
 * 
 * @param {Club} club - The club object containing the club details.
 * @param {User} loggedUser - The currently logged-in user object.
 */

export function generateClubActionButtons(club, loggedUser) {
    if (!loggedUser || !club) {
        console.log('Error: Invalid club or logged user data.');
        return '';
    }

    let userButtons = '';

    if (!club.members.includes(loggedUser._id)) {
        userButtons += `
            <button class="joinClubButton" data-id="${club._id}" data-private="${club.private}">Unirse al Club</button>`;
    }
    if (club.members.includes(loggedUser._id)) {
        userButtons += `<button class="leaveClubButton" data-id="${club._id}">Salir del Club</button>`;
    }
    if (club.admins.includes(loggedUser._id)) {
        userButtons += `
            <button class="editClubButton" data-id="${club._id}">Editar Club</button>
            <button class="deleteClubButton" data-id="${club._id}">Eliminar Club</button>
        `;}
    
    return userButtons;
}