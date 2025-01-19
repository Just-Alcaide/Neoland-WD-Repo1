// Shopping List database
const shoppingList = []
// Assign DOM Content Loaded event
document.addEventListener('DOMContentLoaded', onDomContentLoaded)

// ======== EVENTS ======== //
function onDomContentLoaded() {
  const articleNameElement = document.getElementById('articleName')
  const newArticleElement = document.getElementById('newArticle')
  const newListElement = document.getElementById('newList')

  articleNameElement.addEventListener('keyup', onArticleNameKeyUp)
  newArticleElement.addEventListener('click', onNewArticleClick)
  newListElement.addEventListener('click', onNewListClick)
  // Set Up shopping list Class
  shoppingList.empty = function() {
    while (this.length > 0){
      this.pop()
    }
  }

  // Get shoppingList from localStorage
  const storedData = JSON.parse(localStorage.getItem('shoppingList'))
  storedData.forEach(savedArticle => {
    shoppingList.push(savedArticle)
    addNewRowToShoppingListTable(savedArticle)
  });
  getShoppingListTotalAmount()
}

function onArticleNameKeyUp(e) {
  const articleNameElement = document.getElementById('articleName')
  const newArticleElement = document.getElementById('newArticle')

  if (articleNameElement.value !== '') {
    newArticleElement.disabled = undefined
  } else {
    newArticleElement.disabled = true
  }
}

function onNewArticleClick(e) {
  createShoppingListItem()
  cleanUpForm()
}

function onNewListClick(e) {
  resetShoppingList()
}

// ======== METHODS ======== //

/**
 * Reset shopping list
 */
function resetShoppingList() {
  // 1. Empty the shopping list
  shoppingList.empty()
  // 2. Empty Table Element
  emptyTableElement()
  // 3. Update Table total amount cell
  getShoppingListTotalAmount()
  // 4. Clean Up form
  cleanUpForm()
}

/**
 * Clean up form
 */
function cleanUpForm() {
  // 1. Get inputs and save them in const
  const articleNameElement = document.getElementById('articleName')
  const qtyElement = document.getElementById('qty')
  const priceElement = document.getElementById('price')
  // 2. Set input values to ''
  articleNameElement.value = ''
  qtyElement.value = ''
  priceElement.value = ''
}

// C.R.U.D.

/**
 * Create new shopping list item
 */
function createShoppingListItem() {
  const articleNameElement = document.getElementById('articleName')
  const qtyElement = document.getElementById('qty')
  const priceElement = document.getElementById('price')
  const timestamp = new Date()
  // Template literals:
  // TODO: ver la próxima semana
  // const id = `${articleNameElement.value}_${String(timestamp.getTime())}`
  const id = articleNameElement.value + '_' + String(timestamp.getTime())
  const newArticleObject = {
    id: id,
    name: articleNameElement.value,
    qty: Number(qtyElement.value),
    price: Number(priceElement.value)
  }
  shoppingList.push(newArticleObject)
  // Save shoppingList on localStorage
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList))
  getShoppingListTotalAmount()
  addNewRowToShoppingListTable(newArticleObject)
  resetFocus()
}

/**
 * Add a new row to the shopping list table element
 */
function addNewRowToShoppingListTable(newArticleObject){
  const shoppingListTableBodyElement = document.getElementById('shoppingListTableBody')
  // 1. Create HTML Elements that represents the new article
  const newArticleTableRow = document.createElement('tr')
  const newArticleTableCellQty = document.createElement('td')
  const newArticleTableCellName = document.createElement('td')
  const newArticleTableCellPrice = document.createElement('td')
  const newArticleTableCellSubtotal = document.createElement('td')
  const newArticleDeleteButtonCell = document.createElement('td')
  const newArticleDeleteButton = document.createElement('button')
  // 1.1. Assign Table Cells values
  newArticleTableCellQty.innerText = newArticleObject.qty
  newArticleTableCellName.innerText = newArticleObject.name
  newArticleTableCellPrice.innerText = newArticleObject.price
  newArticleTableCellSubtotal.innerText = newArticleObject.qty * newArticleObject.price
  newArticleDeleteButton.innerText = '🗑'
  newArticleDeleteButton.className = 'delete-button'
  newArticleDeleteButton.setAttribute('id-to-delete', newArticleObject.id)
  // TODO: revisar la semana que viene
  newArticleDeleteButton.addEventListener('click', deleteShoppingListItem)
  newArticleDeleteButtonCell.appendChild(newArticleDeleteButton)
  // 1.2. Append Table Cells to Table Row
  newArticleTableRow.appendChild(newArticleTableCellQty)
  newArticleTableRow.appendChild(newArticleTableCellName)
  newArticleTableRow.appendChild(newArticleTableCellPrice)
  newArticleTableRow.appendChild(newArticleTableCellSubtotal)
  newArticleTableRow.appendChild(newArticleDeleteButtonCell)
  // 2. Append the new Table Row to the shoppingListTableBodyElement
  shoppingListTableBodyElement.appendChild(newArticleTableRow)
}

/**
 * Update existing shopping list item
 */
function updateShoppingListItem() {
  getShoppingListTotalAmount()
}

/**
 * Delete existing shopping list item
 */
function deleteShoppingListItem(e) {
  const itemIdToDelete = e.target.getAttribute('id-to-delete')
  const rowToDelete = e.target.closest('tr')
  // 1. Delete item from shoppingList
  // 1.1. Find item inside shoppingList
  const itemIndex = shoppingList.findIndex((shoppingListItem) => shoppingListItem.id === itemIdToDelete)
  // 1.2. Delete item from shoppingList Array
  shoppingList.splice(itemIndex, 1)
  rowToDelete.remove()
  getShoppingListTotalAmount()
  // Save shoppingList on localStorage
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList))
}

/**
 * Empty table element
 */
function emptyTableElement() {
  const shoppingListTableBodyRowsList = document.querySelectorAll('tbody>tr')
  // 1. For each table row found
  for (let tableRow of shoppingListTableBodyRowsList) {
    // 2. Remove it from the table element
    tableRow.remove()
  }
}

/**
 * Calculate shopping list total amount
 */
function getShoppingListTotalAmount() {
  const shoppingListTableTotalElement = document.getElementById('shoppingListTableTotal')
  let totalAmount = 0
  for (let article of shoppingList) {
    // 1. Calculate subtotals for each article
    const subtotal = article.qty * article.price
    // 2. Add all subtotals
    totalAmount += subtotal
  }
  // 3. Show it on table total amount cell
  shoppingListTableTotalElement.innerText = totalAmount
}

/**
 * Sets the focus on the first form field
 */
function resetFocus(){
  const articleNameElement = document.getElementById('articleName')
  articleNameElement.focus()
}