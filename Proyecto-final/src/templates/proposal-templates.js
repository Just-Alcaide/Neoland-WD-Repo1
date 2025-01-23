// @ts-check

export const bookProposalTemplate = `
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

export const movieProposalTemplate = `
<form id="movieProposalForm">
<fieldset>
    <label>Nombre: <input type="text" name="name" id="name"></label>
    <label>Año: <input type="text" name="year" id="year"></label>
    <label>Género: <input type="text" name="genre" id="genre"></label>
    <label>Director: <input type="text" name="director" id="director"></label>
    <label>Minutos: <input type="text" name="minutes" id="minutes"></label>
    <button type="submit">Enviar Propuesta</button>
</fieldset>
</form>
`