/*
funcionalidad de la app:
-Añadir productos a la lista de la compra
-Poder eliminar lista de la compra
*/

//definimos la lista de la compra, array
let shoppingList = []
//definimos diccionario de productos habituales
const PRODUCTS = {
    MILK: 'leche',
    FRUIT: 'fruta',
    MEAT: 'carne',
    VEGETABLE: 'verdura',
    BEER: 'cerveza',

}
//TODO poner productos habituales
//poner PRODUCTS.MILK en la función de añadir a la lista de la compra cuando tenga que poner cadena leche mayúscula allí

//definimos funcion añadir al la lista
function addToShoppingList () {
    // creamos 3 variables según el valor del input de html, identificamos por id
    let newProductName = document.getElementById('product').value
    let newProductQty = document.getElementById('qty').value
    let newProductPrice = document.getElementById('price').value
    let shoppingListTable = document.getElementById('shoppingListTable')
    let shoppingListTableBody = document.getElementById('shoppingListTableBody')
    let shoppingListTableTotal = document.getElementById('shoppingListTableTotal')
    let totalAmount = 0

    //vamos a hacer que se vea en pantalla, no solo en consola
    let logtext = document.getElementById('log')


    // creamos el objeto que finalmente añadiremos a la lista
    let newProductObject = {
        name: '',
        qty: 0,
        price: 0,
    }

    // si el nombre es campo vacio, que de error y se salga de la función
    if (newProductName === '') {
        console.error('falta el nombre del articulo')
        return
    //si no es campo vacio, que lo ponga en mayúsculas
    } /*else {
        newProductName = newProductName.toUpperCase()
    }*/
   // revisa si el nombre del producto está en el diccionario de productos habituales y le añadimos valores al precio y cantidad
   //con products.product llamamos al diccionario
    switch (newProductName) {
    case PRODUCTS.MILK: 
        newProductQty = 12
        newProductPrice = 1
        break;
    case PRODUCTS.FRUIT:
        newProductQty = 3
        newProductPrice = 0.5
        break;
    case PRODUCTS.MEAT:
        newProductQty = 2
        newProductPrice = 5
        break;
    case PRODUCTS.VEGETABLE:
        newProductQty = 5
        newProductPrice = 2
        break;
    case PRODUCTS.BEER:
        newProductQty = 12
        newProductPrice = 1.5
        break;
    default:
        break;
    }
    
    //convertir en numero precio y cantidad
    newProductQty = Number(newProductQty)
    newProductPrice = Number(newProductPrice)
    
    //OJO meter toda esta vaina antes de crear el objeto del todo

    //actualizamos los valores del objeto que metemos en la lista de la compra
    
    newProductObject = {
        name: newProductName,
        qty: newProductQty,
        price: newProductPrice,
    }

    // push sirve para meter el objeto en la lista
    shoppingList.push(newProductObject)

    //calcular el total (estrucutra de bucle FOR)
    //entre parentesis la condición del bucle
    //en la llave el codigo del bucle
    for(let i = 0; i < shoppingList.length; i = i + 1) {
        //para cada item de la shopping list
        let shoppingListItem = shoppingList[i]
        let shoppingListItemSubtotal = shoppingListItem.qty * shoppingListItem.price
        //console.log('elementos del array: ', shoppingListItemSubtotal)
        totalAmount = totalAmount + shoppingListItemSubtotal
    }
     //console.log ('calculo total', totalAmount)
     shoppingListTableTotal.innerText = totalAmount

    
    //mostrar log de compra
    let newArticleElement = document.createElement('p')
    newArticleElement.innerText = 'He añadido: ' 
    + newProductQty
    + ' unidades de '
    + newProductName.toLowerCase() //poner el tolowercase si lo anterior está en mayúscula
    + ' al precio '
    + newProductPrice
    + ' €.'
    

    ////crear nuevo articulo en la tabla
    //1. crear filas
    let newTableRow = document.createElement('tr')
    //2. crear las celdas
    let nameCell = document.createElement('td')
    let qtyCell = document.createElement('td')
    let priceCell = document.createElement('td')
    let subtotalCell = document.createElement('td')
    //3. añado los valores a las celdas
    nameCell.innerText = newProductObject.name
    qtyCell.innerText = newProductObject.qty
    priceCell.innerText = newProductObject.price
    subtotalCell.innerText = newProductObject.qty * newProductObject.price + ' €'
    // 4. Añado las celdas a la fila
    newTableRow.appendChild(nameCell)
    newTableRow.appendChild(qtyCell)
    newTableRow.appendChild(priceCell)
    newTableRow.appendChild(subtotalCell)
    // 5. Añado la fila a shoppingListTableBody
    shoppingListTableBody.appendChild(newTableRow)



    //console.log('parrafo de log', logtext)
    
    logtext.innerText = 'Ha añadido: ' 
    + newProductQty
    + ' unidades de '
    + newProductName.toLowerCase() //poner el tolowercase si lo anterior está en mayúscula
    + ' al precio '
    + newProductPrice

    // para chequear en la consola
    //console.log('TABLA', shoppingListTable)
    //console.log('Añadido Producto:', newProductObject)
    //console.log ('Lista Actualizada:', shoppingList)


}//fin de la función añadir a lista de la compra

//definimos funcion para poner la lista de la compra en valores vacios, resetear la lista

function resetShoppingList (){
    shoppingList = []
    console.log('Lista eliminada', shoppingList)
}
/*
function changeColor () {
    document.getElementsByTagName('body')[0].style.backgroundColor = 'silver'
}
*/

//el triple igual está preguntando si lo que está a la izquierda y a la derecha el lo mismo en valor y tipo de variable
//con dos iguales solo pregunta si es el mismo valor, no el mismo tipo de variable 5 == cinco, 5 === 5





