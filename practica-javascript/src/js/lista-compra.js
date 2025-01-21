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
// import USUAL_PRODUCTS from '../api/products.json' with { type: 'json'}

const shoppingList = []

document.addEventListener('DOMContentLoaded', onDomContentLoaded)

function onDomContentLoaded(){
    const newProductButton = document.getElementById('addProductButton');
    const newListButton = document.getElementById('newListButton')
    

    newProductButton.addEventListener('click', onNewProductClick)
    newListButton.addEventListener('click', onNewListClick)

    //esto lo puedo comentar
    // const productCheckbox = document.querySelectorAll('.productCheckbox')
    // for (let checkbox of productCheckbox) {
    //     checkbox.addEventListener('change', onProductCheckboxChecked)
    // } 

    getUsualProducts()

    // TODO: Repasar local storage
    const storedData = JSON.parse(localStorage.getItem('shoppingList'))
    storedData.forEach(savedArticle => {
        shoppingList.push(savedArticle)
        showNewProduct (savedArticle)
    });


    console.log('DOM completamente cargado y listo')
}
//Eventos

function onNewProductClick(e) {
    createNewProduct()
    calculateTotal()
    resetForm ()
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList))
}

function onNewListClick(e){
    resetList ()
    calculateTotal()
    resetForm()
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList))
}

function onProductCheckboxChecked(e){
    const checkbox = e.target;
    const checkboxRow = checkbox.closest('tr')
    if (checkbox.checked) {
        checkboxRow.classList.add('product-checked')
    } else {
        checkboxRow.classList.remove('product-checked')
    }
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
    const newProductCheckboxCell = document.createElement('td')
    const newProductCheckbox = document.createElement('input')
    

    newProductNameCell.innerText = newProduct.name
    newProductQtyCell.innerText = newProduct.qty
    newProductPriceCell.innerText = newProduct.price
    newProductSubtotalCell.innerText = newProduct.subTotal.toFixed(2) + ' €'
    newProductCheckbox.type = 'checkbox'
    newProductCheckbox.classList.add('productCheckbox')

    newProductCheckbox.addEventListener('change', onProductCheckboxChecked);

    newProductCheckboxCell.appendChild(newProductCheckbox)

    newProductTableRow.appendChild(newProductNameCell)
    newProductTableRow.appendChild(newProductQtyCell)
    newProductTableRow.appendChild(newProductPriceCell)
    newProductTableRow.appendChild(newProductSubtotalCell)
    newProductTableRow.appendChild(newProductCheckboxCell)
    

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
    totalAmount.innerText = total.toFixed(2)
}

//DE AQUI PABAJO TENGO QUE REPASAR PERO BIEN
// TODO: productos habituales => esto va con datalist, apidata o json, fetches y promesas...

/**
 * Get Usual Products and show usual products
 */
async function getUsualProducts() {
        const dataListElement = document.getElementById('usualProducts')
    const apiData = await getAPIData()
  
    apiData.forEach((product) => {
      const newOptionElement = document.createElement('option')
      newOptionElement.value = product.name
      dataListElement.appendChild(newOptionElement)
    })
  }

//VAMOS A DEFINIR UN METODO QUE SEA GET API DATA Y QUE TRAIGA LA INFORMACION (el import ya no será necesario)
/**
 * 
 * Get Api Data
 */
async function getAPIData () {
    const API_USUAL_PRODUCTS_URL = '../api/products.json'

    const apiData = await fetch(API_USUAL_PRODUCTS_URL)
        .then((response) => {
            if (!response.ok) {
                showError(response.status)
            }
            return response.json()
        })
    return apiData
}


// TODO: estilo de celdas de con numeros (derecha)
// TODO: boton para borrar tr del producto
// TODO: lo del focus, y cosillas de calidad de vida


/*
trasteamos con programación orientada a objetos
tenemos call, apply, bind, assign 
BIND: crea una copia de una función con el this, y los parametros que le digamos (Será el que más usemos)

check function deleteShoppingListItem (e, itemIdToDelete)

deleteShoppingListItem.bind(this, e, newArticleObject.id)

hay que inventarse el evento clickevent, con sus defaults y su target.

se envía una copia, con el entorno, el evento y el parametro
hemos parametrizado el metodo. hemos creado una copia y le hemos pasado las variables que necesitamos.

*/