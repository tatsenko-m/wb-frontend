import "./index.css";
import {
  initialItems,
  courierAddressHTML,
  pickupAddressHTML,
} from "../utils/constants";
import ItemCard from "../components/ItemCard";

const accordionButtons = document.querySelectorAll(
  ".cart-items__accordion-btn"
);
const refusalHoverableElements = document.querySelectorAll(
  ".refusal__text-hoverable"
);
const recipientInputs = document.querySelectorAll(".recipient__input");
const labelCheckAll = document.querySelector(".checkbox-label_type_check-all");
const secondDeliveryField = document.querySelectorAll(
  ".delivery__field_include-items"
)[1];
const openDeliveryPopupButtons = document.querySelectorAll(
  ".open-delivery-popup-btn"
);
const openPaymentPopupButtons = document.querySelectorAll(
  ".open-payment-popup-btn"
);
const deliveryPopup = document.querySelector("#popup-delivery");
const paymentPopup = document.querySelector("#popup-payment");
const confirmOrderButton = document.querySelector(".total__confirm-order-btn");
const paymentCaption = document.querySelector(".payment__caption");
const courierButton = document.querySelector(
  ".popup__menu-button:not(.popup__menu-button_active)"
);
const pickupButton = document.querySelector(".popup__menu-button_active");
const addressList = document.querySelector(".popup__address-list");
const phoneInput = document.querySelector('input[name="phone"]');

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

function addSpaces(input) {
  input = input.replace(/\s/g, "");
  let formatted = "";
  let groups = [0, 2, 5, 8, 10, 12];
  for (let i = 0; i < input.length; i++) {
    if (groups.includes(i)) {
      formatted += " " + input[i];
    } else {
      formatted += input[i];
    }
  }
  return formatted.trim();
}

function formatPhoneNumber() {
  const regex = /[a-zA-Zа-яА-Я]/g;
  phoneInput.value = addSpaces(phoneInput.value);

  if (regex.test(phoneInput.value)) {
    phoneInput.value = phoneInput.value.replace(regex, "");
  }
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

function handleEscClose(popup, closePopupFunc, evt) {
  if (evt.key === "Escape") {
    closePopupFunc(popup);
  }
}

function submitPopup(popup, closePopupFunc, evt) {
  evt.preventDefault();
  closePopupFunc(popup);
}

function deletePopupAddress() {
  this.parentElement.style.display = "none";
}

function courierButtonClickHandler() {
  courierButton.classList.add("popup__menu-button_active");
  pickupButton.classList.remove("popup__menu-button_active");
  addressList.innerHTML = courierAddressHTML;
  const addressDeleteButtons =
    deliveryPopup.querySelectorAll(".popup__delete-btn");
  addressDeleteButtons.forEach((btn) => {
    btn.addEventListener("click", deletePopupAddress.bind(btn));
  });
}

function pickupButtonClickHandler() {
  pickupButton.classList.add("popup__menu-button_active");
  courierButton.classList.remove("popup__menu-button_active");
  addressList.innerHTML = pickupAddressHTML;
  const addressDeleteButtons =
    deliveryPopup.querySelectorAll(".popup__delete-btn");
  addressDeleteButtons.forEach((btn) => {
    btn.addEventListener("click", deletePopupAddress.bind(btn));
  });
}

function openPopup(popup, closePopupFunc) {
  const popupCloseButton = popup.querySelector(".popup__close-button");
  const popupSubmitButton = popup.querySelector(".popup__choose-button");

  popup.classList.add("popup_opened");

  popupCloseButton.addEventListener("click", closePopupFunc.bind(null, popup));
  popupSubmitButton.addEventListener(
    "click",
    submitPopup.bind(null, popup, closePopupFunc)
  );
  document.addEventListener(
    "keydown",
    handleEscClose.bind(null, popup, closePopupFunc)
  );

  if (popup.id === "popup-delivery") {
    const addressDeleteButtons = popup.querySelectorAll(".popup__delete-btn");
    addressDeleteButtons.forEach((btn) => {
      btn.addEventListener("click", deletePopupAddress.bind(btn));
    });

    courierButton.addEventListener("click", courierButtonClickHandler);
    pickupButton.addEventListener("click", pickupButtonClickHandler);
  }
}

function closePopup(popup) {
  const popupCloseButton = popup.querySelector(".popup__close-button");
  const popupSubmitButton = popup.querySelector(".popup__choose-button");

  popup.classList.remove("popup_opened");

  popupCloseButton.removeEventListener("click", closePopup);
  popupSubmitButton.removeEventListener("click", submitPopup);
  document.removeEventListener("keydown", handleEscClose);

  if (popup.id === "popup-delivery") {
    const addressDeleteButtons = popup.querySelectorAll(".popup__delete-btn");
    addressDeleteButtons.forEach((btn) => {
      btn.removeEventListener("click", deletePopupAddress);
    });

    courierButton.removeEventListener("click", courierButtonClickHandler);
    pickupButton.removeEventListener("click", pickupButtonClickHandler);
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

  function validateName(input, errorSpan) {
    if (input.value.trim() === "") {
      errorSpan.textContent = "Укажите имя";
      input.classList.add("error");
    } else {
      errorSpan.textContent = "";
      input.classList.remove("error");
    }
  }

  function validateSurname(input, errorSpan) {
    if (input.value.trim() === "") {
      errorSpan.textContent = "Введите фамилию";
      input.classList.add("error");
    } else {
      errorSpan.textContent = "";
      input.classList.remove("error");
    }
  }

  function validateEmail(input, errorSpan) {
    if (input.value.trim() === "") {
      errorSpan.textContent = "Укажите электронную почту";
      input.classList.add("error");
    } else {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(input.value)) {
        errorSpan.textContent = "Проверьте адрес электронной почты";
        input.classList.add("error");
      } else {
        errorSpan.textContent = "";
        input.classList.remove("error");
      }
    }
  }

  function validatePhone(input, errorSpan) {
    if (input.value.trim() === "") {
      errorSpan.textContent = "Укажите номер телефона";
      input.classList.add("error");
    } else {
      const phoneRegex = /^\+\d \d{3} \d{3} \d{2} \d{2}$/;
      if (!phoneRegex.test(input.value)) {
        errorSpan.textContent = "Формат: +9 999 999 99 99";
        input.classList.add("error");
      } else {
        errorSpan.textContent = "";
        input.classList.remove("error");
      }
    }
  }

  function validateInn(input, errorSpan) {
    if (input.value.trim() === "") {
      errorSpan.textContent = "Укажите ИНН";
      input.classList.add("error");
    } else {
      if (input.value.trim().length !== 14 || isNaN(input.value.trim())) {
        errorSpan.textContent = "Проверьте ИНН";
        input.classList.add("error");
      } else {
        errorSpan.textContent = "";
        input.classList.remove("error");
      }
    }
  }

  function handleInputBlur(input) {
    const correspondingLabel = document.querySelector(
      `[for="${input.getAttribute("id")}"]`
    );
    let errorSpan;

    if (input.value === "") {
      errorSpan = input.nextElementSibling.classList.contains(
        "recipient__error"
      )
        ? input.nextElementSibling
        : input.nextElementSibling.nextElementSibling;
      if (!input.classList.contains("error")) {
        correspondingLabel.classList.remove("recipient__label_visible");
      }
    } else {
      switch (input.getAttribute("name")) {
        case "name":
          errorSpan = input.nextElementSibling.classList.contains(
            "recipient__error"
          )
            ? input.nextElementSibling
            : input.nextElementSibling.nextElementSibling;
          validateName(input, errorSpan);
          break;
        case "surname":
          errorSpan = input.nextElementSibling.classList.contains(
            "recipient__error"
          )
            ? input.nextElementSibling
            : input.nextElementSibling.nextElementSibling;
          validateSurname(input, errorSpan);
          break;
        case "email":
          errorSpan = input.nextElementSibling.classList.contains(
            "recipient__error"
          )
            ? input.nextElementSibling
            : input.nextElementSibling.nextElementSibling;
          validateEmail(input, errorSpan);
          break;
        case "phone":
          errorSpan = input.nextElementSibling.classList.contains(
            "recipient__error"
          )
            ? input.nextElementSibling
            : input.nextElementSibling.nextElementSibling;
          validatePhone(input, errorSpan);
          break;
        case "inn":
          errorSpan = input.nextElementSibling.classList.contains(
            "recipient__error"
          )
            ? input.nextElementSibling
            : input.nextElementSibling.nextElementSibling;
          validateInn(input, errorSpan);
          break;
        default:
          break;
      }
    }
  }

  recipientInputs.forEach((input) => {
    input.addEventListener("focus", function () {
      const correspondingLabel = document.querySelector(
        `[for="${input.getAttribute("id")}"]`
      );
      correspondingLabel.classList.add("recipient__label_visible");
    });

    input.addEventListener("blur", function () {
      handleInputBlur(input);
    });
  });

  document.querySelector("form").addEventListener("submit", function (evt) {
    evt.preventDefault();
    formSubmitted = true;

    recipientInputs.forEach((input) => {
      let errorSpan;
      if (input.nextElementSibling.classList.contains("recipient__error")) {
        errorSpan = input.nextElementSibling;
      } else {
        errorSpan = input.nextElementSibling.nextElementSibling;
      }

      if (input.value.trim() === "" && input.getAttribute("name") === "name") {
        errorSpan.textContent = "Укажите имя";
      } else if (
        input.value.trim() === "" &&
        input.getAttribute("name") === "surname"
      ) {
        errorSpan.textContent = "Введите фамилию";
      } else if (
        input.value.trim() === "" &&
        input.getAttribute("name") === "email"
      ) {
        errorSpan.textContent = "Укажите электронную почту";
      } else if (
        input.value.trim() === "" &&
        input.getAttribute("name") === "phone"
      ) {
        errorSpan.textContent = "Укажите номер телефона";
      } else if (
        input.value.trim() === "" &&
        input.getAttribute("name") === "inn"
      ) {
        errorSpan.textContent = "Укажите ИНН";
      } else {
        errorSpan.textContent = "";
      }

      if (input.getAttribute("name") === "email" && input.value.trim() !== "") {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(input.value)) {
          errorSpan.textContent = "Проверьте адрес электронной почты";
        }
      }

      if (input.getAttribute("name") === "phone" && input.value.trim() !== "") {
        const phoneRegex = /^\+\d \d{3} \d{3} \d{2} \d{2}$/;
        if (!phoneRegex.test(input.value)) {
          errorSpan.textContent = "Формат: +9 999 999 99 99";
        }
      }

      if (input.getAttribute("name") === "inn" && input.value.trim() !== "") {
        if (input.value.trim().length !== 14 || isNaN(input.value.trim())) {
          errorSpan.textContent = "Проверьте ИНН";
        }
      }
    });
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
  phoneInput.addEventListener("input", formatPhoneNumber);

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

  openDeliveryPopupButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      openPopup(deliveryPopup, closePopup);
    });
  });

  openPaymentPopupButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      openPopup(paymentPopup, closePopup);
    });
  });

  recipientInputs.forEach((input) => {
    input.addEventListener("input", function () {
      handleInputBlur(input);
    });

    input.addEventListener("focus", function () {
      const correspondingLabel = document.querySelector(
        `[for="${input.getAttribute("id")}"]`
      );
      correspondingLabel.classList.add("recipient__label_visible");
    });

    input.addEventListener("blur", function () {
      const correspondingLabel = document.querySelector(
        `[for="${input.getAttribute("id")}"]`
      );
      if (input.value === "") {
        correspondingLabel.classList.remove("recipient__label_visible");
      }
    });
  });

  confirmOrderButton.addEventListener("click", function (evt) {
    evt.preventDefault();

    const nameInput = document.getElementById("name");
    const surnameInput = document.getElementById("surname");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const innInput = document.getElementById("inn");

    if (window.innerWidth <= 767) {
      const recipientErrorFields =
        document.querySelectorAll(".recipient__error");
      let errorField = null;
      recipientErrorFields.forEach((error) => {
        if (error.textContent.trim() !== "") {
          errorField = error;
        }
      });
      if (errorField) {
        errorField.scrollIntoView({ behavior: "smooth" });
      }
    }
    validateName(nameInput, nameInput.nextElementSibling);
    validateSurname(surnameInput, surnameInput.nextElementSibling);
    validateEmail(emailInput, emailInput.nextElementSibling);
    validatePhone(phoneInput, phoneInput.nextElementSibling);
    validateInn(innInput, innInput.nextElementSibling.nextElementSibling);
  });

  updateCartInfo();
  updateCheckboxes();
}

init();
