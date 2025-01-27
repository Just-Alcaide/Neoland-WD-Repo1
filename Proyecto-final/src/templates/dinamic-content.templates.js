//@ts-check
import {store} from "../js/store/redux.js";
import {Club} from "../js/classes/Club.js";
const clubs = store.getState()?.clubs || [];

export const clubPageTemplate = `
    <section id="clubsPage">
        <h2>Tu Lista de Clubs:</h2>
        <ul id="clubsList">
            ${clubs.map((/** @type {Club} */ club) => 
                `
                <li>
                    <h3>Nombre: ${club.name}</h3>
                    <p>Descripción: ${club.description}</p>
                    <p>Miembros: ${club.members.length || 0}</p>
                </li>
                `
            ).join('')}
        </ul>
        <form id="createClubForm">
            <h4>Crear Nuevo Club</h4>
            <label for="clubName">Nombre del Club:</label>
            <input type="text" name="clubName" id="clubName" required>
            <label for="clubDescription">Descripción del Club:</label>
            <input type="text" name="clubDescription" id="clubDescription" required>
            <button type="submit">Crear Club</button>
        </form>
    </section>
`;
