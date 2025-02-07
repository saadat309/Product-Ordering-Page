import { menuArray } from "./data.js";

// Display elements
let menuEl = document.getElementById("menu");
let checkoutEl = document.getElementById("checkout");
let orderDiv = document.getElementById("order-div");
let modalEl = document.getElementById("modal");

document.addEventListener("click", function (e) {
  if (e.target.dataset.additem) {
    handleAddItem(e.target.dataset.additem);
  }
});

function handleAddItem(itemId) {
  let targetItemObj = menuArray.find(function (item) {
    if (item.id === parseInt(itemId)) {
      return item;
    }
  });
  if (targetItemObj) {
    checkoutEl.style.display = "flex";
    orderDiv.innerHTML += checkoutItem();
  }
  function checkoutItem() {
    let orderDivHtml = "";
    orderDivHtml = `
    <article class="checkout-item" id="checkout-item">
            <p>${targetItemObj.name}</p>
            <button class="plus-btn">
              <i class="fa-sharp fa-solid fa-plus"></i>
            </button>
            <p class="quantity">1</p>
            <button class="minus-btn">
              <i class="fa-sharp fa-solid fa-minus"></i>
            </button>
            <p class="price">$${targetItemObj.price}</p>
    </article>
  `;
    return orderDivHtml;
  }
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
