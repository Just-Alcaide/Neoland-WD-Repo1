//@ts-check


export const clubPageTemplate = `
    <section id="clubsPage">
        <h2>Tu Lista de Clubs:</h2>

        <fieldset id="clubTypeFilter">
            <legend>Filtrar Clubs por Tipo:</legend>
            <label><input type="radio" name="clubTypeFilter" value="all" checked> Todos </label>
            <label><input type="radio" name="clubTypeFilter" value="book"> Clubs de Lectura </label>
            <label><input type="radio" name="clubTypeFilter" value="movie"> Clubs de Cine </label>
            <legend>Filtrar Clubs por Nombre:</legend>
            <input type="text" name="clubNameFilter" id="clubNameFilter" placeholder="Filtrar por Nombre">
        </fieldset>

        <ul id="clubsList">
        </ul>
        <form id="createClubForm" class="hidden">
            <h4>Crear Nuevo Club</h4>
            <label for="clubName">Nombre del Club:</label>
            <input type="text" name="clubName" id="clubName" required>
            <label for="clubPassword">Contraseña:</label>
            <input type="password" name="clubPassword" id="clubPassword">
            <label>Tipo de Club:</label>
            <label for="clubDescription">Descripción del Club:</label>
            <textarea name="clubDescription" id="clubDescription" required></textarea>
            <select name="clubType" id="clubType" required>
                <option value="book">Club de Lectura</option>
                <option value="movie">Club de Cine</option>
            </select>
            <label>Privado<input type="radio" name="clubVisibility" value="private" required></label>
            <label>Publico<input type="radio" name="clubVisibility" value="public" required></label>
            <button type="submit">Crear Club</button>
        </form>
    </section>
`;

export const clubDetailPageTemplate = (/** @type {string} */ clubId)  =>  `
    <section id="clubDetailPage" data-id="${clubId}">
    
        <button id="backToClubsListButton">Volver a la Lista de Clubs</button>

        <h3 id=clubDetailName></h3>
        <p id="clubDetailDescription"></p>

        <h4>Miembros del Club:</h4>
        <ul id="clubMembersList"></ul>

        <div id="clubActionButtonsContainer"></div>

        <h4>Propuestas del Club:</h4>
        <ul id="clubProposalsList"></ul>

        <button id="addProposalButton" class="hidden">Agregar Propuesta</button>

        <form id="addProposalTypeForm" class="hidden">
            <label><input type="radio" name="proposalType" id="bookProposal" value="bookProposal">Propuesta de Libro</label>
            <label><input type="radio" name="proposalType" id="movieProposal" value="movieProposal">Propuesta de Película</label>
        </form>
        <section id="createNewProposalContainer"></section>

    </section>
`

export const bookProposalTemplate = `
<fieldset>
    <label>Nombre: <input type="text" name="name" id="name"></label>
    <label>Año: <input type="text" name="year" id="year"></label>
    <label>Género: <input type="text" name="genre" id="genre"> </label>
    <label>Autor: <input type="text" name="author" id="author"></label>
    <label>Páginas: <input type="text" name="pages" id="pages"></label>
    <button type="submit">Enviar Propuesta</button>
</fieldset>
`

export const movieProposalTemplate = `
<fieldset>
    <label>Nombre: <input type="text" name="name" id="name"></label>
    <label>Año: <input type="text" name="year" id="year"></label>
    <label>Género: <input type="text" name="genre" id="genre"></label>
    <label>Director: <input type="text" name="director" id="director"></label>
    <label>Minutos: <input type="text" name="minutes" id="minutes"></label>
    <button type="submit">Enviar Propuesta</button>
</fieldset>
`