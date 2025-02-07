import { menuArray } from "./data.js";

// Display elements
let menuEl = document.getElementById("menu");
let checkoutEl = document.getElementById("checkout");
let orderDiv = document.getElementById("order-div");
let tpriceEl = document.getElementById("tprice");
let modalEl = document.getElementById("modal");
console.log(tpriceEl);

document.addEventListener("click", function (e) {
  if (e.target.dataset.additem) {
    handleAddItem(e.target.dataset.additem);
  } else if (e.target.dataset.plus) {
    handlePlus(e.target.dataset.plus);
  } else if (e.target.dataset.minus) {
    handleMinus(e.target.dataset.minus);
  }
});

function handlePlus(itemId) {
  let targetItemObj = menuArray.find(function (item) {
    if (item.id === parseInt(itemId)) {
      return item;
    }
  });

  let currentQuantity = (targetItemObj.quantity += 1);
  document.getElementById(`quantity-${targetItemObj.id}`).textContent =
    currentQuantity;
  let price = targetItemObj.price * currentQuantity;
  document.getElementById(
    `price-${targetItemObj.id}`
  ).textContent = `$${price}`;
  calculateTotalPrice();
}

function handleMinus(itemId) {
  let targetItemObj = menuArray.find(function (item) {
    if (item.id === parseInt(itemId)) {
      return item;
    }
  });
  if (targetItemObj.quantity >= 1) {
    let currentQuantity = (targetItemObj.quantity -= 1);
    document.getElementById(`quantity-${targetItemObj.id}`).textContent =
      currentQuantity;
    let price = targetItemObj.price * currentQuantity;
    document.getElementById(
      `price-${targetItemObj.id}`
    ).textContent = `$${price}`;
    calculateTotalPrice(targetItemObj);
  } else if (targetItemObj.quantity < 1) {
    targetItemObj.isAdded = false;
    document.getElementById(`checkout-item-${targetItemObj.id}`).remove();
    // if (
    //     orderDiv.innerHTML !==
    //     document.getElementById(`checkout-item-${targetItemObj.id}`)
    //   ) {
    //     checkoutEl.style.display = "none";
    //   }
  }
}

function handleAddItem(itemId) {
  checkoutEl.style.display = "flex";

  let targetItemObj = menuArray.find(function (item) {
    if (item.id === parseInt(itemId)) {
      return item;
    }
  });
  if (targetItemObj && targetItemObj.isAdded === false) {
    orderDiv.innerHTML += checkoutItem(targetItemObj);
    targetItemObj.isAdded = true;
    calculateTotalPrice(targetItemObj);
  }
}

function calculateTotalPrice(item) {
  let priceElements = document.querySelectorAll(".price");
  const pricesArray = Array.from(priceElements).map((element) => {
    const priceText = element.textContent;
    const numericValue = parseFloat(priceText.replace("$", ""));
    return numericValue;
  });
  const totalPrice = pricesArray.reduce(function (first, current) {
    return first + current;
  });
  tpriceEl.textContent = `$${totalPrice}`;
  if (totalPrice === 0) {
    item.isAdded = false;
    document.getElementById(`checkout-item-${item.id}`).remove();
    checkoutEl.style.display = "none";
  } else {
    checkoutEl.style.display = "flex";
  }
}

function checkoutItem(item) {
  let orderDivHtml = "";
  item.quantity = 1;
  orderDivHtml = `
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

  return orderDivHtml;
}

function renderfunction(arr) {
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

renderfunction(menuArray);
