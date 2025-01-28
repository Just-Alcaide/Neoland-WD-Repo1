//@ts-check
import {store} from "../js/store/redux.js";
import {Club} from "../js/classes/Club.js";
import { User } from "../js/classes/User.js";

const clubs = store.getState()?.clubs || [];
const user = store.getState()?.user || [];

export const clubPageTemplate = `
    <section id="clubsPage">
        <h2>Tu Lista de Clubs:</h2>
        <ul id="clubsList">
        </ul>
        <form id="createClubForm">
            <h4>Crear Nuevo Club</h4>
            <label for="clubName">Nombre del Club:</label>
            <input type="text" name="clubName" id="clubName" required>
            <label for="clubDescription">Descripción del Club:</label>
            <textarea name="clubDescription" id="clubDescription" required></textarea>
            <button type="submit">Crear Club</button>
        </form>
    </section>
`;

export const userPageTemplate = `
            
`
