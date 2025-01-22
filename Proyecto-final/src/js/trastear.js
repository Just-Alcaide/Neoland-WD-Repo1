
const bookProposalTemplate = `
    <form id="bookProposalForm">
    <fieldset>
        <label>Nombre: <input type="text" name="name" id="name"></label>
        <label>Año: <input type="text" name="year" id="year"></label>
        <label>Género: <input type="text" name="genre" id="genre"> </label>
        <label>Autor: <input type="text" name="author" id="author"></label>
        <label>Páginas: <input type="text" name="pages" id="pages"></label>
        <button type="submit">Enviar Propuesta</button>
    </fieldset>
    </form>
`

const movieProposalTemplate = `
    <form id="movieProposalForm">
    <fieldset>
        <label>Nombre: <input type="text" name="name" id="name"></label>
        <label>Año: <input type="text" name="year" id="year"></label>
        <label>Género: <input type="text" name="genre" id="genre"></label>
        <label>Director: <input type="text" name="director" id="director"></label>
        <label>Minutos: <input type="text" name="minutes" id="minutes"></label>
    </fieldset>
    </form>
`
const bookProposal = document.getElementById('bookProposal')
const movieProposal = document.getElementById('movieProposal')

const formContainer = document.getElementById('formContainer')

bookProposal.addEventListener('change', onBookProposalChange)
movieProposal.addEventListener('change', onMovieProposalChange)

function onBookProposalChange() {
    formContainer.innerHTML = bookProposalTemplate;
}

function onMovieProposalChange() {
    formContainer.innerHTML = movieProposalTemplate;
}


