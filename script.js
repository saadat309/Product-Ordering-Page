import { menuArray } from "./data.js";

// DOM Accessors ---------------------------------------------------------------------------

const menuEl = document.getElementById("menu");
const checkoutEl = document.getElementById("checkout");
const orderDiv = document.getElementById("order-div");
const tpriceEl = document.getElementById("tprice");
const gstTotalEl = document.getElementById("gstTotal");
const modalEl = document.getElementById("modal");
const nameInput = document.getElementById("name");
const numberInput = document.getElementById("number");
const cvcInput = document.getElementById("cvc");
const alertEl = document.getElementById("alert");
const orderMsgEl = document.getElementById("order-msg");
const orderAgainBtn = document.getElementById("order-again-btn");

// Button Click EvenListeners -------------------------------------------------------------------

document.addEventListener("click", function (e) {
  if (e.target.closest("[data-additem]")) {
    handleAddItem(e.target.closest("[data-additem]").dataset.additem);
  } else if (e.target.closest("[data-plus]")) {
    handlePlus(e.target.closest("[data-plus]").dataset.plus);
  } else if (e.target.closest("[data-minus]")) {
    handleMinus(e.target.closest("[data-minus]").dataset.minus);
  } else if (e.target.id === "order-btn") {
    handleOrderBtn();
  } else if (e.target.id === "submit-btn") {
    handleSubmitBtn(e);
  } else if (e.target.id === "cancel-btn") {
    handleCancelBtn(e);
  } else if (e.target.id === "order-again-btn") {
    handleOrderAgainBtn();
  }
});

// Helper functions ------------------------------------------------------------------------------

function findingItem(arr, itemId) {
  return arr.find(function (item) {
    return item.id === parseInt(itemId);
  });
}

function resetMenuArray() {
  menuArray.forEach((item) => {
    item.isAdded = false;
    item.quantity = 0;
  });
}

// Handling + _ & Updating Prices, quantity ----------------------------------------------

function handleAddItem(itemId) {
  checkoutEl.style.display = "flex";

  document
    .querySelector(`[data-additem="${itemId}"]`)
    .classList.remove("added");

  if (
    orderMsgEl.style.display === "flex" ||
    orderAgainBtn.style.display === "flex"
  ) {
    orderDiv.replaceChildren();
    resetMenuArray();
  }

  orderMsgEl.style.display = "none";
  orderAgainBtn.style.display = "none";

  let targetItemObj = findingItem(menuArray, itemId);

  if (targetItemObj && !targetItemObj.isAdded) {
    targetItemObj.quantity = 1;
    renderOrderDiv(targetItemObj);
    targetItemObj.isAdded = true;
    document.querySelector(`[data-additem="${itemId}"]`).classList.add("added");

    setTimeout(() => {
      const newItemElement = document.getElementById(
        `checkout-item-${targetItemObj.id}`
      );
      if (newItemElement) {
        newItemElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 20);
  }

  calculateTotalPrice();
}

function handlePlus(itemId) {
  let targetItemObj = findingItem(menuArray, itemId);

  targetItemObj.quantity += 1;

  updateNumbers(targetItemObj);
}

function handleMinus(itemId) {
  let targetItemObj = findingItem(menuArray, itemId);

  if (targetItemObj.quantity >= 1) {
    targetItemObj.quantity -= 1;
  }

  if (targetItemObj.quantity === 0) {
    document
      .querySelector(`[data-additem="${itemId}"]`)
      .classList.remove("added");
    document.getElementById(`checkout-item-${targetItemObj.id}`).remove();
    targetItemObj.isAdded = false;
    checkoutEl.style.display = orderDiv.children.length ? "flex" : "none";
  }

  updateNumbers(targetItemObj);
}

function updateNumbers(item) {
  document.getElementById(`quantity-${item.id}`).textContent = item.quantity;

  document.getElementById(`price-${item.id}`).textContent = `$${
    item.price * item.quantity
  }`;
  calculateTotalPrice();
}

function calculateTotalPrice() {
  const totalPrice = menuArray.reduce((accumulator, currentItem) => {
    if (currentItem.isAdded === true) {
      const itemTotal = currentItem.price * currentItem.quantity;
      return accumulator + itemTotal;
    } else {
      return accumulator;
    }
  }, 0);

  const gstTax = totalPrice * 0.15;
  gstTotalEl.textContent = `$${gstTax.toFixed(2)}`;
  tpriceEl.textContent = `$${(totalPrice + gstTax).toFixed(2)}`;
}

// Order Completion & Form Handling -----------------------------------------------------------

function handleOrderBtn() {
  clearForm();
  modalEl.style.display = "flex";
}

function handleSubmitBtn(e) {
  e.preventDefault();
  if (nameInput.value && numberInput.value && cvcInput.value) {
    modalEl.style.display = "none";
    checkoutEl.style.display = "none";
    orderMsgEl.style.display = "flex";
    orderAgainBtn.style.display = "flex";
    document.getElementById("customer").textContent = `${nameInput.value}`;
  } else {
    alertEl.textContent =
      "Please fill in all the details to complete your order.";
  }
}

function handleCancelBtn(e) {
  e.preventDefault();
  modalEl.style.display = "none";
  clearForm();
}

function handleOrderAgainBtn() {
  clearForm();

  orderDiv.replaceChildren();
  orderMsgEl.style.display = "none";
  orderAgainBtn.style.display = "none";

  resetMenuArray();
  defaultState(menuArray);
}

function clearForm() {
  nameInput.value = "";
  numberInput.value = "";
  cvcInput.value = "";
  alertEl.textContent = "";
}

// Rendering Functions ----------------------------------------------------------------------

function renderOrderDiv(item) {
  orderDiv.innerHTML += checkoutItem(item);
}

function checkoutItem(item) {
  return `
    <article class="checkout-item" id="checkout-item-${item.id}">
            <p>${item.name}</p>
            <button class="plus-btn" data-plus="${item.id}">
              <i class="fa-sharp fa-solid fa-plus"></i>
            </button>
            <p class="quantity" id="quantity-${item.id}">${item.quantity}</p>
            <button class="minus-btn" data-minus="${item.id}">
              <i class="fa-sharp fa-solid fa-minus"></i>
            </button>
            <p class="price" id="price-${item.id}" ">$${item.price}</p>
    </article>
  `;
}

function defaultState(arr) {
  let menuHtml = arr
    .map(function (item) {
      return `<article class="item" id="item">
        <img src=${item.image} alt="${item.altText}" class="item-img" />
        <div class="item-desc">
          <h2>${item.name}</h2>
          <p>${item.ingredients.join(`, `)}</p>
          <p>$${item.price}</p>
        </div>
        <button class="item-add-btn" data-additem="${item.id}">
          <i class="fa-sharp fa-regular fa-plus" ></i>
        </button>
      </article>`;
    })
    .join("");
  menuEl.innerHTML = menuHtml;
}

// Initialize ------------------------------------------------------------------------------

defaultState(menuArray);
