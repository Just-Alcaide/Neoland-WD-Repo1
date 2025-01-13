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

function changeColor () {
    document.getElementsByTagName('body')[0].style.backgroundColor = 'silver'
}
