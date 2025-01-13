let shoppingList = []

function addToShoppingList () {
    /*let newArticle = document.getElementById('articulo').value
    shoppingList.push(newArticle)*/
    let newProductName = document.getElementById('product').value
    let newProductQty = document.getElementById('qty').value
    let newProductPrice = document.getElementById('price').value
    let newProductObject = {
        name: newProductName,
        qty: newProductQty,
        price: newProductPrice,
    }
    shoppingList.push(newProductObject)
    console.log('Añadido:', shoppingList)
}

function resetShoppingList (){
    shoppingList = []
    console.log('Lista eliminada', shoppingList)
}

function changeColor () {
    document.getElementsByTagName('body')[0].style.backgroundColor = 'silver'
}

//vamos a ver como añadirlo como objeto
/* el la función pilla el value, guarda la cadena de texto
queremos que añada el objeto, 
*/

/*let newarticleObject = {
    qty: 0,
    name: newArticle,
    price: 0,
}*/