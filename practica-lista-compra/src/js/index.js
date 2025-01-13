let shoppingList = []

function addToShoppingList () {
    /*let newArticle = document.getElementById('articulo').value
    shoppingList.push(newArticle)*/
    let newArticleName = document.getElementById('articulo').value
    let newArticleQty = document.getElementById('qty').value
    let newArticlePrice = document.getElementById('price').value
    let newarticleObject = {
        qty: newArticleQty,
        name: newArticleName,
        price: newArticlePrice,
    }
    shoppingList.push(newarticleObject)
    console.log('addToShoppingList', shoppingList)
}

function resetShoppingList (){
    shoppingList = []
    console.log('resetShoppingList', shoppingList)
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