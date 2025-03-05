//@ts-check

import { getAPIData, API_PORT } from "./apiService.js";
import { getLoggedUserData } from "./authService.js";

/** @typedef {import("../classes/Club.js").Club} Club */
/** @typedef {import("../classes/User.js").User} User */


/**
 * Creates a new club in the database.
 *
 * Steps:
 * 1. Checks if the user is logged in.
 * 2. Sends a request to create a new club with the provided data.
 * 3. If successful, adds the club ID to the logged-in user's club list.
 * 4. Updates session storage.
 * 5. Returns the created club object.
 *
 * @param {Club} clubData - The club details.
 * @returns {Promise<Club | null>} The created club object or `null` if the user is not logged in.
 */
export async function createNewClub(clubData) {
    const loggedUser = getLoggedUserData();
    if (!loggedUser) {
        alert('Debes iniciar sesión para crear un club');
        return null;
    }

    try {
        const payload = JSON.stringify({ ...clubData, userId: loggedUser._id });
        const apiClubData = await getAPIData(
            `${location.protocol}//${location.hostname}${API_PORT}/api/create/clubs`,
            'POST',
            payload
        );

        if (!apiClubData) {
            throw new Error('Error al crear el club');
        }

        loggedUser.clubs.push(apiClubData._id);
        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));

        return apiClubData;
    } catch (error) {
        console.error('Error al crear el club:', error);
        return null;
    }
}

/**
 * Fetches club data from the API.
 *
 * Steps:
 * 1. Reads the selected club type filter.
 * 2. Reads the club name search input.
 * 3. Sends a request to retrieve all clubs matching the filter.
 * 4. Returns the fetched data.
 *
 * @returns {Promise<Club[]>} A list of clubs matching the filter criteria.
 */
export async function fetchClubData() {
    try {
        /** @type {HTMLInputElement | null} */
        const selectedTypeRadio = document.querySelector('input[name="club-type-filter"]:checked');
        const selectedTypeFilter = selectedTypeRadio ? selectedTypeRadio.value : 'all';

        const clubNameFilter = document.getElementById('clubNameFilter');
        const filterValue = clubNameFilter instanceof HTMLInputElement 
            ? clubNameFilter.value.toLowerCase().trim() 
            : '';

        const apiClubsData = await getAPIData(
            `${location.protocol}//${location.hostname}${API_PORT}/api/read/clubs`,
            'POST',
            JSON.stringify({ type: selectedTypeFilter !== "all" ? selectedTypeFilter : undefined })
        );

        if (!apiClubsData) {
            throw new Error("No se pudieron obtener los clubes.");
        }

        const filteredClubs = apiClubsData.filter((/** @type {{ name: string; }} */ club) =>
            club.name.toLowerCase().includes(filterValue)
        );

        return filteredClubs;
    } catch (error) {
        console.error('Error obteniendo los clubes:', error);
        return [];
    }
}

/**
 * Filters clubs based on user authentication and visibility.
 *
 * Steps:
 * 1. Calls fetchClubData() to retrieve clubs from the API.
 * 2. Filters clubs based on whether the user is logged in or not.
 * 3. Returns the filtered club list.
 *
 * @returns {Promise<Club[]>} A list of clubs accessible to the user.
 */
export async function filterClubs() {
    const loggedUser = getLoggedUserData();
    const clubs = await fetchClubData();
    const userClubs = clubs.filter((club) => {
        if (!loggedUser) return !club.private;
        return !club.private || club.members.includes(loggedUser._id);
    });

    return userClubs;
}

/**
 * Joins a club.
 *
 * Steps:
 * 1. Checks if the user is logged in.
 * 2. Sends a request to join the specified club.
 * 3. If successful, adds the club to the user's list.
 * 4. Updates session storage.
 *
 * @param {string} clubId - The ID of the club.
 * @param {string | null} [password] - The club password, if required.
 * @returns {Promise<void>}
 */
export async function joinClub(clubId, password = null) {
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

    } catch (error) {
        console.error("Error al unirse al club:", error);
        alert("Hubo un error al intentar unirse al club.");
    }
}


/**
 * Leaves a club.
 *
 * Steps:
 * 1. Checks if the user is logged in.
 * 2. Sends a request to remove the user from the club.
 * 3. Removes the club from the user's list.
 * 4. Updates session storage.
 *
 * @param {string} clubId - The ID of the club.
 * @returns {Promise<void>}
 */
export async function leaveClub(clubId) {
    const loggedUser = getLoggedUserData();
    if (!loggedUser) {
        alert('Debes iniciar sesión para salir de un club');
        return;
    }

    try {
        const updateData = JSON.stringify({ userId: loggedUser._id });

        await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/leave/clubs/${clubId}`, 'PUT', updateData);

        loggedUser.clubs = loggedUser.clubs.filter(id => id !== clubId);
        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));

    } catch (error) {
        console.log('Error al salir del club: ', error);
    }
}


/**
 * Opens the edit club dialog.
 *
 * Steps:
 * 1. Fetches club details from the API.
 * 2. Fetches club members to list non-admin users.
 * 3. Creates or reuses an HTML `<dialog>` element for editing the club.
 * 4. Populates input fields with existing club data.
 * 5. Displays a list of non-admin members, allowing the assignment of new admins.
 * 6. Attaches event listeners for:
 *    - Assigning admins.
 *    - Saving changes.
 *    - Closing the dialog.
 *
 * @param {string} clubId - The ID of the club to edit.
 * @returns {Promise<void>}
 */
export async function editClub(clubId) {
    try {
        const club = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/clubs/${clubId}`);
        const membersData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/users`, 'POST', JSON.stringify({ ids: club.members }));

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

        dialog.querySelectorAll(".assignAdminButton").forEach((button) => {
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

    } catch (error) {
        console.log('Error al editar club: ', error);
    }
}


/**
 * Saves club modifications (name & description).
 *
 * Steps:
 * 1. Retrieves input values from the edit dialog.
 * 2. Sends an API request to update the club details.
 * 3. Closes the edit dialog if successful.
 *
 * @param {string} clubId - The ID of the club being updated.
 * @returns {Promise<void>}
 */
async function saveClubChanges(clubId) {
    const editClubName = document.getElementById('editClubName');
    const editClubDescription = document.getElementById('editClubDescription');

    if (editClubName instanceof HTMLInputElement && editClubDescription instanceof HTMLTextAreaElement) {
        const updatedClub = {
            name: editClubName.value,
            description: editClubDescription.value,
        };

        const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/clubs/${clubId}`, 'PUT', JSON.stringify(updatedClub));

        if (!response) {
            alert('Hubo un error al actualizar el club');
            return;
        }

        alert('Club actualizado correctamente');
        const editClubDialog = document.getElementById('edit-club-dialog');
        if (editClubDialog instanceof HTMLDialogElement) editClubDialog.close();
    }
}


/**
 * Assigns a user as an admin in the club.
 *
 * Steps:
 * 1. Sends an API request to add the user as an admin.
 * 2. Displays a confirmation message upon success.
 *
 * @param {string} clubId - The ID of the club.
 * @param {string} userId - The ID of the user to be assigned as an admin.
 * @returns {Promise<void>}
 */
async function assignAdmin(clubId, userId) {
    const payload = JSON.stringify({ userId });
    await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/clubs/${clubId}/admins`, 'PUT', payload);
    alert('Admin asignado correctamente');
}


/**
 * Deletes a club.
 *
 * Steps:
 * 1. Checks if the user is logged in.
 * 2. Prompts the user for confirmation.
 * 3. Sends a request to delete the club.
 * 4. Removes the club from the user's list.
 * 5. Updates session storage.
 *
 * @param {string} clubId - The ID of the club.
 * @returns {Promise<void>}
 */
export async function deleteClub(clubId) {
    const loggedUser = getLoggedUserData();

    if (!loggedUser) {
        alert('Debes iniciar sesión para borrar un club');
        return;
    }

    if (!confirm("¿Estás seguro de eliminar este club?")) return;

    try {
        await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/clubs/${clubId}/${loggedUser._id}`, 'DELETE');

        loggedUser.clubs = loggedUser.clubs.filter(id => id !== clubId);
        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));

    } catch (error) {
        console.log('Error al eliminar el club: ', error);
    }
}