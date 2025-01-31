//@ts-check
/**@typedef {import ('../js/classes/Club.js')} Club */
/**@typedef {import ('../js/classes/Proposal.js')} Proposal */
/**@typedef {import('../js/classes/User.js')} User */

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
            <label>Privado<input type="radio" name="clubVisibility" value="private" required></label>
            <label>Publico<input type="radio" name="clubVisibility" value="public" required></label>
            <button type="submit">Crear Club</button>
        </form>
    </section>
`;

export const clubDetailPageTemplate = (/** @type {string} */ clubId)  =>  `
    <section id="clubDetailPage" data-id="${clubId}">
        <h3 id=clubDetailName></h3>
        <p id="clubDetailDescription"></p>

        <h4>Miembros del Club:</h4>
        <ul id="clubMembersList"></ul>

        <h4>Propuestas del Club:</h4>
        <ul id="clubProposalsList"></ul>

        <button id="addProposalButton" class="hidden">Agregar Propuesta</button>

        <form id="addProposalTypeForm" class="hidden">
            <label><input type="radio" name="proposalType" value="bookProposal">Propuesta de Libro</label>
            <label><input type="radio" name="proposalType" value="movieProposal">Propuesta de Película</label>
            <button type="submit" id="createNewProposalButton">Confirmar Propuesta</button>
        </form>

        <button id="editClubButton" class="hidden">Editar Club</button>
        <button id="deleteClubButton" class="hidden">Eliminar Club</button>
    </section>
`