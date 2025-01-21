/**
 * Books Data Base
 */
const booksListProposal = []

/**
 * Proponer libro
 */
function submitNewBookProposal () {
    const newBookNameProposal = document.getElementById('newBookNameProposal').value
    const newBookAuthorProposal = document.getElementById('newBookAuthorProposal').value
    const newBookYearProposal = document.getElementById('newBookYearProposal').value
    const newBookGenreProposal = document.getElementById('newBookGenreProposal').value
    const newBookPagesProposal = document.getElementById('newBookPagesProposal').value
    const newBookProposerProposal = document.getElementById('newBookProposerProposal')
    const newBookGroupProposal = document.getElementById('newBookGroupProposal')
    const newBookProposal = {
        name: newBookNameProposal,
        author: newBookAuthorProposal,
        year: newBookYearProposal,
        genre: newBookGenreProposal,
        pages: newBookPagesProposal,
        proposer: newBookProposerProposal,
        group: newBookGroupProposal,        
    }
    booksList.push(newBookProposal)
}

/**
 * Show Book List in Interfaz
 */
function showBookList () {

}