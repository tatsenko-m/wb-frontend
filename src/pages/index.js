import "./index.css";
import { initialItems } from "../utils/constants";
import ItemCard from "../components/ItemCard";

const accordionButtons = document.querySelectorAll(
  ".cart-items__accordion-btn"
);
const addedItemsList = document.querySelector("#added-items");
const unavailableItemsList = document.querySelector("#unavailable-items");
const deliverySection = document.querySelector(".delivery");

function renderItems(itemsArr, listSelector, templateSelector, isUnavailable) {
  const itemsList = document.querySelector(listSelector);
  itemsArr.forEach((item) => {
    const itemCard = new ItemCard(item, templateSelector, isUnavailable);
    const itemCardElement = itemCard.createItemCard();
    itemsList.append(itemCardElement);
  });
}

accordionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const content = button.parentElement.nextElementSibling;

    if (content.style.display === "none") {
      content.style.display = "flex";
    } else {
      content.style.display = "none";
      if (button === accordionButtons[0]) {
        button.parentElement.style.marginBottom = "17px";
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  renderItems(initialItems, "#added-items", "#item-template", false);
  renderItems(initialItems, "#unavailable-items", "#item-template", true);
});
