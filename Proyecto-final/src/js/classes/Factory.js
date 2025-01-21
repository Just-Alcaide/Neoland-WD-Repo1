class Product {
    name
    year
    genre
    constructor (productData) {
        this.name = productData.name
        this.year = productData.year
        this.genre = productData.genre
    }
}
// arriba puedo meter los datos name, year y genre construyendo y deconstruyendo (cuando toca si toca)
//OJO meterlos como objeto (Cuando?)
// const  productData = {
//     name: productName.value,
//     year: productYear.value,
//     genre: productGenre.value
// }
//Tiene que estar en el js (importarlo de allí)

class Book extends Product { 
    author
    constructor (productData, author) {
        super(productData.name, productData.year, productData.genre)
        this.author = author
    }
}

class Movie extends Product {
    director
    constructor (productData, director) {
        super(productData.name, productData.year, productData.genre)
        this.director = director
    }
}

const PRODUCT_TYPE = {
    BOOK: 'book',
    MOVIE: 'movie'
}

class ProductFactory {
    createProduct(type, productData, author, director) {
        switch(type) {
            case PRODUCT_TYPE.BOOK:
                return new Book (productData.name, author, productData.year, productData.genre)
            case PRODUCT_TYPE.MOVIE:
                return new Movie (productData.name, director, productData.year, productData.genre)
        } 
    }
}

//luego, en el código, a la hora de indicar el tipo de item a crear, basta con añadir el PRODUCT_TYPE.(lo que sea) y está localizado en un único lugar, para modificar o reutilizar

//se puede optimizar con un article data donde están definidos los parametros del articulo.
//(name, author, director, year)
// tres puntos significa desestructuración, es para comprimir y descomprimir un objeto en las diferentes valores. 
// meto los valores en un objeto, mando el objeto entero, lo uso en la factoria y luego lo descomprimo en la clase final con lo que necesite
//en este caso especifico no vale (autor y director no estarán en todos) pero vale para otras cosas 
//OJO al super hay que mandarselo como objeto