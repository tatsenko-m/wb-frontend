import "./index.css";
import { initialItems } from "../utils/constants";
import ItemCard from "../components/ItemCard";

const accordionButtons = document.querySelectorAll(
  ".cart-items__accordion-btn"
);
const refusalHoverableElements = document.querySelectorAll(
  ".refusal__text-hoverable"
);
const labelCheckAll = document.querySelector(".checkbox-label_type_check-all");
const secondDeliveryField = document.querySelectorAll(
  ".delivery__field_include-items"
)[1];
const confirmOrderButton = document.querySelector(".total__confirm-order-btn");
const paymentCaption = document.querySelector(".payment__caption");

let totalQuantity = 0;
let totalNewCost = 0;
let totalOldCost = 0;

function renderItems(
  itemsArr,
  listSelector,
  templateSelector,
  isUnavailable,
  updateCartFunc,
  updateCheckboxesFunc,
  updateBadgesFunc
) {
  const itemsList = document.querySelector(listSelector);
  itemsArr.forEach((item) => {
    const itemCard = new ItemCard(
      item,
      templateSelector,
      isUnavailable,
      updateCartFunc,
      updateCheckboxesFunc,
      updateBadgesFunc
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
      const cardId = input.getAttribute("id");
      const inputValue = parseInt(input.value) || 0;
      updateBadges(cardId, inputValue);
    });
  });
}

function updateParentDisplay(container, childElementClass) {
  const childElements = container.querySelectorAll(childElementClass);
  let hasVisibleElement = false;

  childElements.forEach((element) => {
    if (window.getComputedStyle(element).display !== "none") {
      hasVisibleElement = true;
      return;
    }
  });

  container.parentElement.style.display = hasVisibleElement ? "flex" : "none";
}

function addCheckboxEventListeners() {
  const checkboxes = document.querySelectorAll('input[name="check"]');
  const checkAllCheckbox = document.querySelector('input[name="checkAll"]');
  const payImmediatelyCheckbox = document.querySelector(
    'input[name="payImmediately"]'
  );

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateCartInfo();
      updateCheckboxes();

      const checkboxId = checkbox.id.match(/\d+/);
      if (checkboxId) {
        const deliveryItems = document.querySelectorAll(
          `.delivery__item_id-${checkboxId}`
        );

        deliveryItems.forEach((item) => {
          item.classList.toggle("delivery__item_hidden");
          updateParentDisplay(item.parentElement, ".delivery__item");
        });
      }
    });
  });

  checkAllCheckbox.addEventListener("change", () => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = checkAllCheckbox.checked;
      updateCartInfo();
    });
  });

  payImmediatelyCheckbox.addEventListener("change", () => {
    if (payImmediatelyCheckbox.checked) {
      payImmediatelyCheckbox.parentElement.nextElementSibling.style.display =
        "none";
      paymentCaption.style.display = "none";
      paymentCaption.parentElement.style.maxHeight = "112px";
      confirmOrderButton.textContent = `Оплатить ${formatPrice(totalNewCost)}`;
    } else {
      payImmediatelyCheckbox.parentElement.nextElementSibling.style.display =
        "block";
      paymentCaption.style.display = "block";
      paymentCaption.parentElement.style.maxHeight = "inherit";
      confirmOrderButton.textContent = "Заказать";
    }
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

function updateBadges(cardId, inputValue) {
  const allListItems = document.querySelectorAll(
    `.item-image.delivery__item.delivery__item_id-${cardId}`
  );
  const listItem = allListItems[1] || allListItems[0];

  if (listItem) {
    let badge = listItem.querySelector(".notification-badge_delivery");
    let modifiedBadge = listItem.querySelector(
      ".notification-badge_delivery-modified"
    );

    if (inputValue > 1) {
      if (!badge) {
        const newBadge = document.createElement("div");
        newBadge.classList.add(
          "notification-badge",
          "notification-badge_delivery"
        );
        listItem.insertBefore(newBadge, listItem.firstChild);
        badge = newBadge;
      }

      badge.textContent = inputValue;

      if (inputValue > 184) {
        if (!modifiedBadge) {
          const newModifiedBadge = document.createElement("div");
          newModifiedBadge.classList.add(
            "notification-badge",
            "notification-badge_delivery",
            "notification-badge_delivery-modified"
          );
          listItem.insertBefore(newModifiedBadge, listItem.firstChild);
          modifiedBadge = newModifiedBadge;
        }
        modifiedBadge.textContent = inputValue - 184;
      } else if (modifiedBadge) {
        modifiedBadge.remove();
        secondDeliveryField.style.display = "none";
      }
    } else if (badge) {
      badge.remove();
    }
  }
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
    updateCheckboxes,
    updateBadges
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
          document.querySelector(".cart-items__list-heading").remove();
        }
      } else {
        content.style.display = "none";
        if (button === accordionButtons[0]) {
          button.parentElement.style.marginBottom = "17px";
          button.parentElement.parentElement.style.marginBottom = "7px";
          labelCheckAll.style.display = "none";
          const pElement = document.createElement("p");
          pElement.className = "cart-items__list-heading";
          pElement.textContent = `${formatQuantity(
            totalQuantity
          )} · ${formatPrice(totalNewCost)}`;
          button.parentElement.insertBefore(pElement, button);
        }
      }
    });
  });

  refusalHoverableElements.forEach((el) => {
    el.addEventListener("mouseover", () => {
      el.parentElement.nextElementSibling.style.display = "flex";
    });

    el.addEventListener("mouseout", () => {
      el.parentElement.nextElementSibling.style.display = "none";
    });
  });

  updateCartInfo();
  updateCheckboxes();
}

init();
