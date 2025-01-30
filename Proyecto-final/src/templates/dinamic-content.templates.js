//@ts-check

/** @typedef {import('../js/classes/Club').Club} Club */
/** @typedef {import('../js/classes/Proposal').Proposal} Proposal */


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

export const clubDetailPageTemplate = (/** @type {Club} */ club) => `
    <section id="clubDetailPage">
        <h3>${club.name}</h3>
        <p>${club.description}</p>
        <p>Miembros: ${club.members.length || 0}</p>

        <h4>Propuestas de Libros o Películas</h4>
        <ul id="proposalsList"> 
        </ul>

        <button id="addProposalButton" data-id="${club.id}">Añadir Propuesta</button>

        <form class="hidden" id="addProposalTypeForm">
            <input type="text" id="proposalUser" placeholder="Tu Nombre de Usuario" required>
            <input type="text" id="proposalProduct" placeholder="Nombre de Libro o Película" required>
            <button type="submit" id="createNewProposalButton">Confirmar Propuesta </button>
        </form>
    </section>
`