/// import initializeApp from firebasejs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
/// import push, rel and getDatabase from firebasejs
import {
  getDatabase,
  ref,
  onValue,
  push,
  get,
} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playground-8cbf0-default-rtdb.asia-southeast1.firebasedatabase.app/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListDB = ref(database, "shoppingList");
const inputField = document.getElementById("add-item");
const addBtn = document.getElementById("add-btn");
const shoppingList = document.getElementById("shopping-list");
const numberInputField = document.getElementById("amount");
const hintText = document.querySelector(".hint-text");

// Event listener for click event
addBtn.addEventListener("click", addItem);

// Event listener for 'Enter' key press
inputField.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    addItem();
  }
});

numberInputField.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    addItem();
  }
})

async function addItem() {
  const shoppingListText = `${inputField.value} x${numberInputField.value}`;
  // Check if input field is empty
  if (!shoppingListText.trim()) {
    // swal("Input field is empty!");
    swal.fire({
      title:'enter the item you need!',
      icon: 'error',
      confirmButtonText: 'Okay',
      customClass: {
        container: 'swal-container',
        popup: 'swal-popup',
        confirmButton: 'confirm-button'
      }
    })
    return;
    } 
    if (!numberInputField.value) {
      swal.fire({
        title:'enter the amount of items needed!',
        icon: 'error',
        confirmButtonText: 'Okay',
        customClass: {
          container: 'swal-container',
          popup: 'swal-popup',
          confirmButton: 'confirm-button'
        }
      })
    return;
    }
    if (numberInputField.value <= 0) {
      swal.fire({
        title:'enter a valid amount!',
        icon: 'error',
        confirmButtonText: 'Okay',
        customClass: {
          container: 'swal-container',
          popup: 'swal-popup',
          confirmButton: 'confirm-button'
        }
      })
    return
    } 

  // Check if item already exists in the database
  const snapshot = await get(shoppingListDB);
  const itemsArray = [];
  snapshot.forEach((item) => {
    itemsArray.push(item.val());
  });

  if (itemsArray.includes(shoppingListText)) {
    swal.fire({
      title:'Item already exists!',
      icon: 'error',
      confirmButtonText: 'Okay',
      customClass: {
        container: 'swal-container',
        popup: 'swal-popup',
        confirmButton: 'confirm-button'
      }
    })
    return;
  }

  // If checks pass, push item to the database
  push(shoppingListDB, shoppingListText);
  inputField.value = "";
}


function renderList(items) {
  shoppingList.innerHTML = "";
  items.forEach((item) => {
    const newItem = document.createElement("li");
    newItem.textContent = item;
    newItem.addEventListener("click", function() {
      this.classList.add('highlighted');
      // Check if the hint text already exists
      if (document.querySelector('.hint-text')) {
        hintText.innerText = 'Double tap to uncheck an item!'
      }
    });
    newItem.addEventListener("dblclick", function() {
      this.classList.remove('highlighted');
      // Check if the hint text already exists
      if (document.querySelector('.hint-text')) {
        hintText.innerText = 'Tap an item to check it!'
      }
    });
    shoppingList.appendChild(newItem);
  });
}


onValue(shoppingListDB, (snapshot) => {
  let itemsArray = [];
  snapshot.forEach((item) => {
    itemsArray.push(item.val());
  });
  renderList(itemsArray);
})
