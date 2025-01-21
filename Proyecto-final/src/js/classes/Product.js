// arriba puedo meter los datos name, year y genre construyendo y deconstruyendo (cuando toca si toca)
//OJO meterlos como objeto (Cuando?)
// const  productData = {
//     productName: productName.value,
//     productYear: productYear.value,
//     productGenre: productGenre.value
// }
//Tiene que estar en el js (importarlo de allí)

export class Product {
    productName
    productYear
    productGenre
    constructor (productData) {
        this.productName = productData.productName
        this.productYear = productData.productYear
        this.productGenre = productData.productGenre
    }
}

export class Book extends Product { 
    productAuthor
    productPages
    constructor (productData, productAuthor, productPages) {
        super(productData)
        this.productAuthor = productAuthor
        this.productPages = productPages
    }
}

export class Movie extends Product {
    productDirector
    productMinutes
    constructor (productData, productDirector, productMinutes) {
        super(productData)
        this.productDirector = productDirector
        this.productMinutes = productMinutes
    }
}

export const PRODUCT_TYPE = {
    BOOK: 'book',
    MOVIE: 'movie'
}

export class ProductFactory {
    createProduct(productType, productData, productAuthor, productPages, productDirector, productMinutes) {
        switch(productType) {
            case PRODUCT_TYPE.BOOK:
                return new Book (productData, productAuthor, productPages)
            case PRODUCT_TYPE.MOVIE:
                return new Movie (productData, productDirector, productMinutes)
        } 
    }
}

//TODO:______________________________
//cambiar los nombres de productName a name??? (me gusta el orden,)
// otra constante que sea details? como product data, con los detalles (autor, paginas, director, minutos)
//_______________________________

//luego, en el código, a la hora de indicar el tipo de item a crear, basta con añadir el PRODUCT_TYPE.(lo que sea) y está localizado en un único lugar, para modificar o reutilizar

//se puede optimizar con un article data donde están definidos los parametros del articulo.
//(name, author, director, year)
// tres puntos significa desestructuración, es para comprimir y descomprimir un objeto en las diferentes valores. 
// meto los valores en un objeto, mando el objeto entero, lo uso en la factoria y luego lo descomprimo en la clase final con lo que necesite
//en este caso especifico no vale (autor y director no estarán en todos) pero vale para otras cosas 
//OJO al super hay que mandarselo como objeto