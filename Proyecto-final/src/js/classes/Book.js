export class Book {
    bookId
    bookName
    bookAuthor
    bookYear
    bookPages
    bookGenre
    constructor (
        bookId,
        bookName,
        bookAuthor,
        bookYear,
        bookPages,
        bookGenre,
    ) {
        this.bookId = bookName + '_' + String(timestamp.getTime())
        this.bookName = bookName
        this.bookAuthor = bookAuthor
        this.bookYear = bookYear
        this.bookPages = bookPages
        this.bookGenre = bookGenre
    }
}
