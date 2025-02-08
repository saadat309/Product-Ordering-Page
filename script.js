import { menuArray } from "./data.js";

// Display elements
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

function handleAddItem(itemId) {
  checkoutEl.style.display = "flex";

  let targetItemObj = menuArray.find(function (item) {
    return item.id === parseInt(itemId);
  });

  if (targetItemObj && !targetItemObj.isAdded) {
    renderOrderDiv(targetItemObj);
    targetItemObj.isAdded = true;
  }
  calculateTotalPrice();
}

function updateNumbers(item) {
  document.getElementById(`quantity-${item.id}`).textContent = item.quantity;

  document.getElementById(`price-${item.id}`).textContent = `$${
    item.price * item.quantity
  }`;
  calculateTotalPrice();
}

function findingItem(arr, itemId) {
  return arr.find(function (item) {
    return item.id === parseInt(itemId);
  });
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

function handleOrderAgainBtn() {
  clearForm();
  orderDiv.replaceChildren();
  document.getElementById("order-msg").style.display = "none";
  document.getElementById("order-again-btn").style.display = "none";

  menuArray.forEach((item) => {
    item.isAdded = false;
    item.quantity = 0;
  });
  defualtstate(menuArray);
}

function handleCancelBtn(e) {
  e.preventDefault();
  modalEl.style.display = "none";
  clearForm();
}

function handleSubmitBtn(e) {
  e.preventDefault();
  if (nameInput.value && numberInput.value && cvcInput.value) {
    modalEl.style.display = "none";
    checkoutEl.style.display = "none";
    document.getElementById("order-msg").style.display = "flex";
    document.getElementById("customer").textContent = `${nameInput.value}`;
    document.getElementById("order-again-btn").style.display = "flex";
  } else {
    alertEl.textContent =
      "Please fill in all the details to complete your order.";
  }
}
function clearForm() {
  nameInput.value = "";
  numberInput.value = "";
  cvcInput.value = "";
  alertEl.textContent = "";
}

function handleOrderBtn() {
  clearForm();
  modalEl.style.display = "flex";
}

function calculateTotalPrice() {
  let priceElements = document.querySelectorAll(".price");
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

function checkoutItem(item) {
  item.quantity = 1;
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

function renderOrderDiv(item) {
  orderDiv.innerHTML += checkoutItem(item);
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
