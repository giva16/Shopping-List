//UI Selectors
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.querySelector('ul');
const clearBtn = document.getElementById('clear');
const filterInput = document.querySelector('.filter');


/***************Feature:Display Items from storage************************/
function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => {
    addItemToDOM(item);
  });
  checkUI();
}

/***************Feature: Add items************************/
function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;
  //validate input
  if (newItem === '' || newItem.trim() == ''){
    alert('Please add an Item');
    return;
  }

  // Create item DOM element
  addItemToDOM(newItem);

  // add Item to storage
  addItemToStorage(newItem);

  // reset text input
  itemInput.value = '';

  checkUI();
}

function addItemToDOM(item) {
  // create list item
  const li = document.createElement('li');
  const textContent = document.createTextNode(item.trim());
  li.appendChild(textContent)

  const button = buildButton('remove-item btn-link text-red');
  li.appendChild(button);

  //add list item
  itemList.appendChild(li);
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  // add new item into array from storage
  itemsFromStorage.push(item);

  //convert back to JSON before adding to storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function buildButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  
  //create icon and add it to button
  const icon = buildIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function buildIcon(classes){
  const icon = document.createElement('i');
  icon.className = classes;

  return icon;
}
/***************Feature: Delete Items************************/

function deteleItem(e) {
  const item = e.target.parentElement.parentElement;
  
  if (e.target.parentElement.classList.contains('remove-item')) {
    if(confirm('Are you sure?')){
      deleteItemFromStorage(item.innerText);
      deleteItemFromDOM(e.target.parentElement.parentElement);
    }
  }

  checkUI();
}

function deleteItemFromDOM(item) {
  item.remove();
}

function deleteItemFromStorage(itemName) {
  let itemsFromStorage = getItemsFromStorage();
  console.log(itemName);
  itemsFromStorage = itemsFromStorage.filter((item) => item != itemName);

  updateStorage(JSON.stringify(itemsFromStorage));
}

function updateStorage(items){
  localStorage.setItem('items', items);
}

/***************Feature: Clear items ************************/
function clearItems() {
  while (itemList.firstElementChild != null){
    itemList.firstChild.remove();
  }
  checkUI();
}

/*************** Feature: remove unecessary UI **************/
function checkUI() {
  const items = document.querySelectorAll('li');
  if (items.length === 0){
    clearBtn.classList.add('inactive');
    filterInput.classList.add('inactive');
  } else {
    clearBtn.classList.remove('inactive');
    filterInput.classList.remove('inactive');
  }
}

/*************** Feature: Filter items **************/
// create Regex from input text for filtering
function createRegex(text) {
  return new RegExp(`^${text}`, 'i');
}

// check if all items are filtered out
function checkNotFound(items) {
  for (let item of items) {
    if (!item.classList.contains('inactive')) {
      return false;
    }
  }
  return true;
}

// iterate through each item to test its text content
// against the filter regEx
function filterItem(e) {
  const items = document.querySelectorAll('li');

  const filterRegex = createRegex(e.target.value);

  // hide items that do not match with regex
  items.forEach((item) => {
    if (!filterRegex.test(item.innerText)) {
      item.classList.add('inactive');
    } else {
      item.classList.remove('inactive');
    }
  });

  // check if no item is found
  // display placeholder if item isnt found
  const placeholder = itemList.querySelector('.not-found');
  if (checkNotFound(items)) {
    placeholder.classList.remove('inactive');
  } else {
    placeholder.classList.add('inactive');
  }
}

// Initialize app
function init() {
  //Even Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', deteleItem);
  clearBtn.addEventListener('click', clearItems);
  filterInput.addEventListener('input', filterItem);

  // get items from storage and display it when the DOM is loaded
  document.addEventListener('DOMContentLoaded', displayItems);
  
  // hide clear all button and filter items input if there are no it
  checkUI();
}

init();
