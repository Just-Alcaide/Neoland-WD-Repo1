/*
FUNCIONALIDAD DE LA APP
1-Añadir productos a la lista de la compra
2-Mostrar lista de la compra con productos, cantidades, precio y total estimado
3-Eliminar un producto de la lista de la compra
4-borrar toda la lista de la compra y empezar una nueva
5-Lista de productos habituales
(+opción para hacer check en un objeto de la lista y aparezca como "comprado")

"PSEUDOCÓDIGO":
1-Añadir productos a la lista de la compra
1.1-Comprobar que los datos de nombre, cantidad y precio son validos
1.2-Si el producto coincide con un producto habitual, poder rellenar automáticamente
1.3-Crear el objeto del producto con los datos de nombre, cantidad y precio
1.4-Añadir el producto a la lista de la compra
1.5-Mostrar el producto en la interfaz (tabla) con lista de la compra, sus valores y el total estimado

2-Mostrar lista de la compra
2.1-Comprobar la lista de la compra (array de productos)
2.2-Por cada objeto en el array, crear una fila en la tabla con nombre - cantidad - precio - subtotal
2.3-Mostrar en interfaz 
2.4-Calcular el total estimado sumando los subtotales

3-Eliminar productos
3.1-Poner un botón en cada fila para identificar el objeto en el array
3.2-Al pulsar el botón, eliminar el producto del array
3.3-Actualizar la tabla y el total estimado

4-Borrar toda la lista
4.1-Identificar el botón para eliminar la lista de la compra
4.2-Eliminar el contenido del array lista de compra
4.3-Eliminar los elementos de la tabla lista de compra
4.4-Recalcular el total estimado a 0


(5-Lista de productos habituales)
5.1-Poner un botón que en tabla que permita guardar los valores del objeto en lista de objetos habituales
5.2-Detectar que un producto está en la lista de productos habituales
5.3-Permitir seleccionar el producto de la lista de productos habituales o poner los valores manualmente
5.4-Añadir el producto al array lista de compra e interfaz

+-Check producto comprado
+.1-Poner botón para producto comprado en la fila
+.2-Al pulsar botón, texto en interfaz se muestra tachado

COMO *** TRADUZCO ESTO A PSUDOCÓDIGO Y LUEGO A CÓDIGO
*/

const shoppingList = []

document.addEventListener('DOMContentLoaded', onDomContentLoaded)

function onDomContentLoaded(){
    const newProductButton = document.getElementById('addProductButton');
    const newListButton = document.getElementById('newListButton')

    newProductButton.addEventListener('click', onNewProductClick)
    newListButton.addEventListener('click', onNewListClick)

    console.log('DOM completamente cargado y listo')
}
//Eventos

function onNewProductClick(e) {
    createNewProduct()
    calculateTotal()
    resetForm ()
}

function onNewListClick(e){
    resetList ()
    calculateTotal()
    resetForm()
}

//Métodos

/**
 * Create new product
 */
function createNewProduct () {
    const newProductName = document.getElementById('productName').value;
    const newProductQty = Number(document.getElementById('productQty').value);
    const newProductPrice = Number(document.getElementById('productPrice').value);
    const newProductSubtotal = newProductQty * newProductPrice;
    const newProduct = {
        name: newProductName,
        qty: newProductQty,
        price: newProductPrice,
        subTotal: newProductSubtotal,
    }
    
    showLogText (`Añadido ${newProduct.qty} unidades de ${newProduct.name} por valor de ${newProduct.price}€`)
    showNewProduct(newProduct) //PREGUNTAR
    shoppingList.push(newProduct)
}
/**
 * Delete list
 */
function resetList () {
    shoppingList.splice(0, shoppingList.length)
    showLogText('Nueva lista')
    const newListTable = document.getElementById('shoppingListTableBody')
    newListTable.innerHTML = ''
}
/**
 * Show Log Text
 */
function showLogText (logMessage) {
    const logText = document.getElementById('log')
    logText.innerText = logMessage
}
/**
 * Reset Form
 */
function resetForm () {
    document.getElementById('productName').value = ''
    document.getElementById('productQty').value = ''
    document.getElementById('productPrice').value = ''
}
/**
 * show products in interfaz
 */
function showNewProduct (newProduct) {
    //Toa la pesca con el html
    const newProductTable = document.getElementById('shoppingListTableBody')
    const newProductTableRow = document.createElement('tr')
    const newProductNameCell = document.createElement('td')
    const newProductQtyCell = document.createElement('td')
    const newProductPriceCell = document.createElement('td')
    const newProductSubtotalCell = document.createElement('td')

    newProductNameCell.innerText = newProduct.name
    newProductQtyCell.innerText = newProduct.qty
    newProductPriceCell.innerText = newProduct.price
    newProductSubtotalCell.innerText = newProduct.subTotal

    newProductTableRow.appendChild(newProductNameCell)
    newProductTableRow.appendChild(newProductQtyCell)
    newProductTableRow.appendChild(newProductPriceCell)
    newProductTableRow.appendChild(newProductSubtotalCell)

    newProductTable.appendChild(newProductTableRow)
}

/**
 * Calculate total
 */
function calculateTotal () {
    const totalAmount = document.getElementById('shoppingListTableTotal')
    let total = 0
    for (let product of shoppingList) {
        total += product.subTotal
    }
    totalAmount.innerText = total
}

