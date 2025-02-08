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
  if (e.target.dataset.closest('[data-additem]')) {
    handleAddItem(e.target.dataset.closest('[data-additem]').dataset.additem);
  } else if (e.target.dataset.plus) {
    handlePlus(e.target.dataset.plus);
  } else if (e.target.dataset.minus) {
    handleMinus(e.target.dataset.minus);
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
  const totalPrice = menuArray.reduce((accumulator, currentItem) => {
    if (currentItem.isAdded === true) {
      // Only use these specific properties (others are ignored)
      const itemTotal = currentItem.price * currentItem.quantity;
      return accumulator + itemTotal;
    } else {
      // Still process the item, but contribute 0 to total
      return accumulator;
    }
  }, 0);

  const gstTax = totalPrice * 0.15;
  gstTotalEl.textContent = `$${gstTax.toFixed(2)}`;
  tpriceEl.textContent = `$${(totalPrice + gstTax).toFixed(2)}`;
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
          <i class="fa-sharp fa-regular fa-plus" id="item-add-btn-${
            item.id
          }" data-additem="${item.id}"></i>
        </button>
      </article>`;
    })
    .join("");
  return (menuEl.innerHTML = menuHtml);
}

defualtstate(menuArray);

//Code review by DeepSeek AI ================================================================================

// issues:

// 1. The function name defualtstate is misspelled. Should be defaultstate.

// 2. The plus and minus buttons in checkoutItem have duplicate ids. Should remove the ids since they're not used, or make them unique.

// 3. calculateTotalPrice is querying the DOM for prices, which could be replaced by using menuArray data for accuracy and efficiency.

// 4. In handleSubmitBtn, the alertEl's visibility isn't handled. If the alert was hidden before, setting its text might not show it. Maybe adding a display style to make it visible when there's an error.

// 5. The return statement in defualtstate (misspelled) function is unnecessary.

// 6. Possible code duplication in resetting menuArray items in handleAddItem and handleOrderAgainBtn. Could create a reset function.

// Now, let's outline the suggested changes:

// - Correct the spelling of defualtstate to defaultstate throughout.

// - Remove the duplicate ids in the checkoutItem's plus and minus icons, or make them unique. Since the code uses data attributes for event handling, the ids are unnecessary and can be removed.

// - Refactor calculateTotalPrice to use menuArray instead of querying the DOM.

// - Ensure alertEl is displayed when showing an error message in handleSubmitBtn.

// - Remove the return statement in the defaultstate function as it's redundant.

// - Create a helper function to reset the menuArray items' isAdded and quantity to avoid duplication.

// Applying the suggested changes: ================================================================================
// Let's go through each of these.

// First, the function name typo:

// The function is defined as:

// function defualtstate(arr) { ... }

// But should be:

// function defaultstate(arr) { ... }

// And called as defaultstate(menuArray) at the end and in handleOrderAgainBtn.

// Next, the duplicate ids in checkoutItem:

// In the checkoutItem function, the plus and minus icons have id="plus-btn" and id="minus-btn". These should be removed. So change:

// <i class="fa-sharp fa-solid fa-plus" id="plus-btn" data-plus="${item.id}"></i>

// to

// <i class="fa-sharp fa-solid fa-plus" data-plus="${item.id}"></i>

// Similarly for the minus icon.

// Then, in calculateTotalPrice, instead of querying the DOM, use the menuArray:

// function calculateTotalPrice() {

// const totalPrice = menuArray.reduce((acc, item) => {

// if (item.isAdded) {

// return acc + (item.price * item.quantity);

// }

// return acc;

// }, 0);

// const gstTax = totalPrice * (15 / 100);

// const subTotal = totalPrice + gstTax;

// gstTotalEl.textContent = `$${gstTax.toFixed(2)}`;

// tpriceEl.textContent = `$${subTotal.toFixed(2)}`;

// }

// This would make the function more efficient and reliable.

// In handleSubmitBtn, when showing the alert, ensure the element is visible. If the alert was hidden via CSS (e.g., display: none), setting the text won't show it. So maybe add:

// alertEl.style.display = 'block';

// But depends on the initial CSS. If the alert is initially hidden with display: none, then when there's an error, it should be displayed. So modifying handleSubmitBtn:

// function handleSubmitBtn(e) {

// e.preventDefault();

// if (nameInput.value && numberInput.value && cvcInput.value) {

// modalEl.style.display = "none";

// checkoutEl.style.display = "none";

// orderMsgEl.style.display = "flex";

// orderAgainBtn.style.display = "flex";

// document.getElementById("customer").textContent = `${nameInput.value}`;

// alertEl.style.display = "none"; // Hide alert on success

// } else {

// alertEl.textContent = "Please fill in all the details to complete your order.";

// alertEl.style.display = "block"; // Or whatever display value makes it visible

// }

// }

// But need to check the initial CSS for alertEl. If it's display: none by default, then setting display to block or flex would make it visible. The code should reflect that.

// Regarding the return statement in defaultstate function:

// The function is written as:

// function defualtstate(arr) {

// let menuHtml = ...;

// return (menuEl.innerHTML = menuHtml);

// }

// The return is unnecessary since the function is called for the side effect of setting menuEl.innerHTML. So it can be simplified to:

// function defaultstate(arr) {

// let menuHtml = ...;

// menuEl.innerHTML = menuHtml;

// }

// No need to return anything.

// Finally, creating a helper function to reset the menuArray items:

// function resetMenuArray() {

// menuArray.forEach((item) => {

// item.isAdded = false;

// item.quantity = 0;

// });

// }

// Then in handleAddItem and handleOrderAgainBtn, replace the forEach loops with resetMenuArray().

// In handleAddItem:

// if (orderMsgEl.style.display === "flex" || orderAgainBtn.style.display === "flex") {

// orderDiv.replaceChildren();

// resetMenuArray();

// }

// In handleOrderAgainBtn:

// menuArray.forEach((item) => { ... }); becomes resetMenuArray();

// This reduces code duplication.
