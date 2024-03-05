import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getDatabase, ref, onValue, push, get } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://playground-8cbf0-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListDB = ref(database, "shoppingList");

const inputField = document.getElementById("add-item");
const addBtn = document.getElementById("add-btn");
const shoppingList = document.getElementById("shopping-list");
const numberInputField = document.getElementById("amount");
const hintText = document.querySelector(".hint-text");

addBtn.addEventListener("click", addItem);
inputField.addEventListener("keydown", handleEnterKey);
numberInputField.addEventListener("keydown", handleEnterKey);

async function addItem() {
  const shoppingListText = `${inputField.value} x${numberInputField.value}`;
  if (!shoppingListText.trim()) {
    showError("enter the item you need!");
    return;
  } 
  if (!numberInputField.value) {
    showError("enter the amount of items needed!");
    return;
  }
  if (numberInputField.value <= 0) {
    showError("enter a valid amount!");
    return;
  }

  const snapshot = await get(shoppingListDB);
  const itemsArray = [];
  snapshot.forEach((item) => {
    itemsArray.push(item.val());
  });

  if (itemsArray.includes(shoppingListText)) {
    showError("Item already exists!");
    return;
  }

  push(shoppingListDB, shoppingListText);
  inputField.value = "";
}

function renderList(items) {
  shoppingList.innerHTML = "";
  items.forEach((item) => {
    const newItem = document.createElement("li");
    newItem.textContent = item;
    newItem.addEventListener("click", toggleHighlight);
    newItem.addEventListener("dblclick", toggleHighlight);
    shoppingList.appendChild(newItem);
  });
}

function toggleHighlight() {
  this.classList.toggle('highlighted');
  updateHintText();
}

function updateHintText() {
  if (document.querySelector('.hint-text')) {
    hintText.innerText = this.classList.contains('highlighted') ? 'Double tap to uncheck an item!' : 'Tap an item to check it!';
  }
}

function handleEnterKey(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    addItem();
  }
}

function showError(message) {
  swal.fire({
    title: message,
    icon: 'error',
    confirmButtonText: 'Okay',
    customClass: {
      container: 'swal-container',
      popup: 'swal-popup',
      confirmButton: 'confirm-button'
    }
  });
}

onValue(shoppingListDB, (snapshot) => {
  let itemsArray = [];
  snapshot.forEach((item) => {
    itemsArray.push(item.val());
  });
  renderList(itemsArray);
});