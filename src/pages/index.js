import "./index.css";
import { initialItems } from "../utils/constants";
import ItemCard from "../components/ItemCard";

const accordionButtons = document.querySelectorAll(
  ".cart-items__accordion-btn"
);

function renderItems(itemsArr, listSelector, templateSelector, isUnavailable) {
  const itemsList = document.querySelector(listSelector);
  itemsArr.forEach((item) => {
    const itemCard = new ItemCard(item, templateSelector, isUnavailable);
    const itemCardElement = itemCard.createItemCard();
    itemsList.append(itemCardElement);
  });
}

function updateCartInfo() {
  const counterInputs = document.querySelectorAll(
    ".cart-items__list .counter__input"
  );

  let totalQuantity = 0;
  let totalNewCost = 0;
  let totalOldCost = 0;

  counterInputs.forEach((input) => {
    const itemCard = input.closest(".item");

    const checkbox = itemCard.querySelector(".checkbox-label__invisible-item");
    if (checkbox && !checkbox.checked) {
      return;
    }

    const quantity = parseInt(input.value) || 0;

    const newCost = parseFloat(
      itemCard
        .querySelector(".item__price-new-number")
        .textContent.replace(/\s+/g, "")
        .replace(",", ".")
    );
    const oldCost = parseFloat(
      itemCard
        .querySelector(".item__price-old")
        .textContent.replace(/\s+/g, "")
        .replace(",", ".")
    );

    totalQuantity += quantity;
    totalNewCost += newCost;
    totalOldCost += oldCost;
  });

  const totalQuantityElement = document.getElementById("total-quantity");
  totalQuantityElement.textContent = formatQuantity(totalQuantity);

  const totalNewCostElement = document.getElementById("total-new-cost");
  totalNewCostElement.textContent = formatPrice(totalNewCost);

  const totalOldCostElement = document.getElementById("total-old-cost");
  totalOldCostElement.textContent = formatPrice(totalOldCost);

  const totalDiscountElement = document.getElementById("total-discount");
  const totalDiscount = totalOldCost - totalNewCost;
  totalDiscountElement.textContent = formatPrice(totalDiscount);
}


function formatQuantity(quantity) {
  if (quantity % 10 === 1 && quantity % 100 !== 11) {
    return `${quantity} товар`;
  } else if (
    (quantity % 10 >= 2 && quantity % 10 <= 4) &&
    !(quantity % 100 >= 12 && quantity % 100 <= 14)
  ) {
    return `${quantity} товара`;
  } else {
    return `${quantity} товаров`;
  }
}

function formatPrice(price) {
  const formattedPrice = price
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    .replace(".", ",");
  return `${formattedPrice} сом`;
}

accordionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const content = button.parentElement.nextElementSibling;

    button.classList.toggle("cart-items__accordion-btn_active");

    if (content.style.display === "none") {
      content.style.display = "flex";
    } else {
      content.style.display = "none";
      if (button === accordionButtons[0]) {
        button.parentElement.style.marginBottom = "17px";
        button.parentElement.parentElement.style.marginBottom = "7px";
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  renderItems(initialItems, "#added-items", "#item-template", false);
  renderItems(initialItems, "#unavailable-items", "#item-template", true);

  const counterInputs = document.querySelectorAll(
    ".cart-items__list .counter__input"
  );
  counterInputs.forEach((input) => {
    input.addEventListener("input", () => {
      updateCartInfo();
    });
  });

  const checkboxes = document.querySelectorAll(
    ".cart-items__list .checkbox-label__invisible-item"
  );
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateCartInfo();
    });
  });

  updateCartInfo();
});
