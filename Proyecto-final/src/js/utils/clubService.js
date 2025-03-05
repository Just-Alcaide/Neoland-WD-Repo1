//@ts-check

import { getAPIData, API_PORT } from "./apiService.js";
import { getLoggedUserData } from "./authService.js";
import { store } from "../store/redux.js";

/** @import {Club} from "../classes/Club.js"; */


export async function filterClubs() {
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

        return apiClubsData.filter((/** @type {Club} */ club) => club.name.toLowerCase().includes(filterValue));
    } catch (error) {
        console.error('Error obteniendo los clubes: ', error);
        return [];
    }
}

/**
 * 
 * @param {Club} clubData 
 * @returns 
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
        store.user.update(loggedUser);
        store.saveState();

        return apiClubData;
    } catch (error) {
        console.error('Error al crear el club:', error);
        return null;
    }
}

