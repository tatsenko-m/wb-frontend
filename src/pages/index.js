import "./index.css";
import { initialItems } from "../utils/constants";
import ItemCard from "../components/ItemCard";

function renderItems(itemsArr, listSelector, templateSelector, isUnavailable) {
  const itemsList = document.querySelector(listSelector);
  itemsArr.forEach((item) => {
    const itemCard = new ItemCard(item, templateSelector, isUnavailable);
    const itemCardElement = itemCard.createItemCard();
    itemsList.append(itemCardElement);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderItems(initialItems, "#added-items", "#item-template", false);
  // renderItems(initialItems, "#unavailable-items", "#item-template", true);
});
