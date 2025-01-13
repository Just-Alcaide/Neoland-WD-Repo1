
// 1. definimos (creamos) nuestra lista de la compra
//var shoppingList = ['carne', 'pescado', 'fruta']

//usamos var aquí, pero cuando trabajemos vamos a definir con let o con const
/*

let totalAmount = 0 //para variables que podemos modificar
const PERAS = 'peras' //para variables que no pueden modificar, se ponen en mayúscula
+/


//para imprimir la lista de la compra. vamos a usar console.log
console.log(shoppingList, totalAmount, PERAS)
//podemos hacer print de pseudocódigo
/*
console.info(shoppingList)
console.error(shoppingList)
las listas, en lugar de empezar en 1 empieza en 0
*/

//no definido es no existe

//vamos a trabajar cambiando contenido de shoppingList y recalculamos el totalAmount



//shoppingList = shoppingList + newArticle
//no sale bien, sale ['carne', 'pescado', 'frutaflanes'].
// el mas no funciona así, el más concatena.
// 4 + 5 o  'fruta' + 'flanes'

//cadena de texto
// let newArticle = 'flan'
//constantes
// const PERAS = 'peras'
//numero
// let totalAmount = 0
//arrays o listas
// let shoppingList = ['carne', 'pescado', 'fruta']
//OBJETO aunque todo sea objeto, es super importante esta definición de Objeto (con o mayúscula)
/*
let productInformation = {
    qty: 0,
    name: '',
    price: 0
}
let shoppingListWithObjects = [
    {
        qty: 1,
        name: 'fruta',
        price: 2,
    },
    {
        qty: 2,
        name: 'carne',
        price: 5,
    },
    {
        qty: 7,
        name: 'pescado',
        price: 1,

    }
]
*/
//el boton añadir lo que va a hacer es un shoppingList.push y añadir un nuevo item


//metodo, tecleando variable y pulsando punto: totalAmount. 
//es una función, un trozo de javascript que hace algo XD
/*function sayHello (){
    console.log('Hello')
}
let sayHello2 = function(){
    console.log('Hello 2')
}
// es lo mismo. una función es una variable, mas o menos.
//Esto mañana
*/

let shoppingList = []

function addToShoppingList () {
    let newArticle = document.getElementById('articulo').value
    shoppingList.push(newArticle)
    console.log('addToShoppingList', shoppingList)
}

function resetShoppingList (){
    shoppingList = []
    console.log('resetShoppingList', shoppingList)
}