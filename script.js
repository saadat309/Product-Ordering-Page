import { menuArray } from "./data.js";

// DOM Accessors --------------------------------

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

// Button Click EvenListeners ------------------------------------------------------------------------------

document.addEventListener("click", function (e) {
  if (e.target.dataset.additem) {
    handleAddItem(e.target.dataset.additem);
  } else if (e.target.dataset.plus) {
    handlePlus(e.target.dataset.plus);
  } else if (e.target.dataset.minus) {
    handleMinus(e.target.dataset.minus);
  } else if (e.target.id == "order-btn") {
    handleOrderBtn();
  } else if (e.target.id === "submit-btn") {
    handleSubmitBtn(e);
  } else if (e.target.id === "cancel-btn") {
    handleCancelBtn(e);
  } else if (e.target.id === "order-again-btn") {
    handleOrderAgainBtn();
  }
});

// Handling + _ & Updating Prices, quantity ------------------------------------------------------------------------------

function handleAddItem(itemId) {
  checkoutEl.style.display = "flex";

  if (
    orderMsgEl.style.display === "flex" ||
    orderAgainBtn.style.display === "flex"
  ) {
    orderDiv.replaceChildren();
    menuArray.forEach((item) => {
      item.isAdded = false;
      item.quantity = 0;
    });
  }

  orderMsgEl.style.display = "none";
  orderAgainBtn.style.display = "none";

  let targetItemObj = findingItem(menuArray, itemId);

  if (targetItemObj && !targetItemObj.isAdded) {
    targetItemObj.quantity = 1;
    renderOrderDiv(targetItemObj);
    targetItemObj.isAdded = true;
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
    document.getElementById(`checkout-item-${targetItemObj.id}`).remove();
    targetItemObj.isAdded = false;
    checkoutEl.style.display = orderDiv.children.length === 0 ? "none" : "flex";
  }

  updateNumbers(targetItemObj);
}

function findingItem(arr, itemId) {
  return arr.find(function (item) {
    return item.id === parseInt(itemId);
  });
}

function updateNumbers(item) {
  document.getElementById(`quantity-${item.id}`).textContent = item.quantity;

  document.getElementById(`price-${item.id}`).textContent = `$${
    item.price * item.quantity
  }`;
  calculateTotalPrice();
}

function calculateTotalPrice() {
  const priceElements = document.querySelectorAll(".price");

  const pricesArray = Array.from(priceElements).map((element) => {
    const priceText = element.textContent;
    const numericValue = parseFloat(priceText.replace("$", ""));
    return numericValue;
  });

  const totalPrice = pricesArray.reduce(function (first, current) {
    return first + current;
  });

  const gstTax = totalPrice * (15 / 100);
  const subTotal = totalPrice + gstTax;
  gstTotalEl.textContent = `$${gstTax.toFixed(2)}`;
  tpriceEl.textContent = `$${subTotal.toFixed(2)}`;
}

// Handling Order complete & Form Buttons ------------------------------------------------------------------------------

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

  menuArray.forEach((item) => {
    item.isAdded = false;
    item.quantity = 0;
  });
  defualtstate(menuArray);
}

function clearForm() {
  nameInput.value = "";
  numberInput.value = "";
  cvcInput.value = "";
  alertEl.textContent = "";
}

// Rendering Strings Functions ----------------------------------------------------------------

function renderOrderDiv(item) {
  orderDiv.innerHTML += checkoutItem(item);
}

function checkoutItem(item) {
  return `
    <article class="checkout-item" id="checkout-item-${item.id}">
            <p>${item.name}</p>
            <button class="plus-btn">
              <i class="fa-sharp fa-solid fa-plus" id="plus-btn" data-plus="${item.id}"></i>
            </button>
            <p class="quantity" id="quantity-${item.id}">${item.quantity}</p>
            <button class="minus-btn">
              <i class="fa-sharp fa-solid fa-minus" id="minus-btn" data-minus="${item.id}"></i>
            </button>
            <p class="price" id="price-${item.id}" value="${item.price}">$${item.price}</p>
    </article>
  `;
}

function defualtstate(arr) {
  let menuHtml = arr
    .map(function (item) {
      return `<article class="item" id="item">
        <img src=${item.image} alt="${item.altText}" class="item-img" />
        <div class="item-desc">
          <h2>${item.name}</h2>
          <p>${item.ingredients.join(`, `)}</p>
          <p>$${item.price}</p>
        </div>
        <button class="item-add-btn">
          <i class="fa-sharp fa-solid fa-plus" id="item-add-btn-${
            item.id
          }" data-additem="${item.id}"></i>
        </button>
      </article>`;
    })
    .join("");
  return (menuEl.innerHTML = menuHtml);
}

defualtstate(menuArray);
