import { menuArray } from "./data.js";

// Display elements
let menuEl = document.getElementById("menu");
let checkoutEl = document.getElementById("checkout");
let orderDiv = document.getElementById("order-div");
let modalEl = document.getElementById("modal");
let checkoutItemEl = document.getElementById("checkout-item");
let quantityEl = document.getElementById("quantity");

document.addEventListener("click", function (e) {
  if (e.target.dataset.additem) {
    handleAddItem(e.target.dataset.additem);
  } else if (e.target.dataset.plus) {
    handlePlus(e.target.dataset.plus);
  }
});

function handlePlus(itemId) {
  let targetItemObj = menuArray.find(function (item) {
    if (item.id === parseInt(itemId)) {
      return item;
    }
    if (targetItemObj) {
      let addition = targetItemObj.quantity++;
      quantityEl.innerHTML = addition;
    }
  });

  console.log(targetItemObj);
}

function handleAddItem(itemId) {
  let targetItemObj = menuArray.find(function (item) {
    if (item.id === parseInt(itemId)) {
      return item;
    }
  });
  if (targetItemObj) {
    checkoutEl.style.display = "flex";
    orderDiv.innerHTML += checkoutItem(targetItemObj);
  }
}

function checkoutItem(item) {
  let orderDivHtml = "";
  orderDivHtml = `
    <article class="checkout-item" id="checkout-item">
            <p>${item.name}</p>
            <button class="plus-btn">
              <i class="fa-sharp fa-solid fa-plus" id="plus-btn" data-plus="${item.id}"></i>
            </button>
            <p class="quantity" id="quantity">${item.quantity}</p>
            <button class="minus-btn">
              <i class="fa-sharp fa-solid fa-minus" id="minus-btn" data-minus="${item.id}"></i>
            </button>
            <p class="price">$${item.price}</p>
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
          <i class="fa-sharp fa-solid fa-plus" id="item-add-btn" data-additem="${
            item.id
          }"></i>
        </button>
      </article>`;
    })
    .join("");
  return (menuEl.innerHTML = menuHtml);
}

renderfunction(menuArray);
