import "./index.css";
import { initialItems } from "../utils/constants";
import ItemCard from "../components/ItemCard";

const accordionButtons = document.querySelectorAll(
  ".cart-items__accordion-btn"
);
const labelCheckAll = document.querySelector(".checkbox-label_type_check-all");

let totalQuantity = 0;
let totalNewCost = 0;
let totalOldCost = 0;

function renderItems(
  itemsArr,
  listSelector,
  templateSelector,
  isUnavailable,
  updateCartFunc,
  updateCheckboxesFunc
) {
  const itemsList = document.querySelector(listSelector);
  itemsArr.forEach((item) => {
    const itemCard = new ItemCard(
      item,
      templateSelector,
      isUnavailable,
      updateCartFunc,
      updateCheckboxesFunc
    );
    const itemCardElement = itemCard.createItemCard();
    itemsList.append(itemCardElement);
  });
}

function updateCartInfo() {
  const counterInputs = document.querySelectorAll(
    ".cart-items__list .counter__input"
  );

  totalQuantity = 0;
  totalNewCost = 0;
  totalOldCost = 0;

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
    quantity % 10 >= 2 &&
    quantity % 10 <= 4 &&
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

function addCounterInputEventListeners() {
  const counterInputs = document.querySelectorAll(
    ".cart-items__list .counter__input"
  );
  counterInputs.forEach((input) => {
    input.addEventListener("input", () => {
      updateCartInfo();
      updateCheckboxes();
    });
  });
}

function addCheckboxEventListeners() {
  const checkboxes = document.querySelectorAll('input[name="check"]');
  const checkAllCheckbox = document.querySelector('input[name="checkAll"]');

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateCartInfo();
      updateCheckboxes();
    });
  });

  checkAllCheckbox.addEventListener("change", () => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = checkAllCheckbox.checked;
      updateCartInfo();
    });
  });
}

function updateCheckboxes() {
  const checkboxes = document.querySelectorAll('input[name="check"]');
  const checkAllCheckbox = document.querySelector('input[name="checkAll"]');
  const atLeastOneUnchecked = [...checkboxes].some(
    (checkbox) => !checkbox.checked
  );
  checkAllCheckbox.checked = !atLeastOneUnchecked;
}

async function init() {
  await new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
    } else {
      window.addEventListener("load", resolve);
    }
  });

  renderItems(
    initialItems,
    "#added-items",
    "#item-template",
    false,
    updateCartInfo,
    updateCheckboxes
  );
  renderItems(initialItems, "#unavailable-items", "#item-template", true);

  addCounterInputEventListeners();
  addCheckboxEventListeners();

  accordionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const content = button.parentElement.nextElementSibling;

      button.classList.toggle("cart-items__accordion-btn_active");

      if (content.style.display === "none") {
        content.style.display = "flex";
        if (button === accordionButtons[0]) {
          button.parentElement.style.marginBottom = "0";
          button.parentElement.parentElement.style.marginBottom = "0";
          labelCheckAll.style.display = "flex";
          document.querySelector('.cart-items__list-heading').remove();
        }

      } else {
        content.style.display = "none";
        if (button === accordionButtons[0]) {
          button.parentElement.style.marginBottom = "17px";
          button.parentElement.parentElement.style.marginBottom = "7px";
          labelCheckAll.style.display = "none";
          const pElement = document.createElement("p");
          pElement.className = "cart-items__list-heading";
          pElement.textContent = `${formatQuantity(totalQuantity)} · ${formatPrice(totalNewCost)}`;
          button.parentElement.insertBefore(pElement, button);
        }
      }
    });
  });

  updateCartInfo();
  updateCheckboxes();
}

init();
