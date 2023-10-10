import { formatNumberWithThinSpace } from "../utils/utils";
class ItemCard {
  constructor(
    {
      image,
      name,
      features,
      warehouse,
      companyInfo,
      initialCounterValue,
      maxQuantity,
      oldPrice,
      newPrice,
    },
    templateSelector,
    isUnavailable
  ) {
    this._image = image;
    this._name = name;
    this._features = features;
    this._warehouse = warehouse;
    this._companyInfo = companyInfo;
    this._initialCounterValue = initialCounterValue;
    this._maxQuantity = maxQuantity;
    this._oldPrice = oldPrice;
    this._newPrice = newPrice;
    this._templateSelector = templateSelector;
    this._isUnavailable = isUnavailable;
    this._isLiked = false;
  }

  _getTemplate() {
    const itemElement = document
      .querySelector(this._templateSelector)
      .content.querySelector(".item")
      .cloneNode(true);

    return itemElement;
  }

  _fillFeatures() {
    const featuresContainer = this._element.querySelector(
      ".item__good-features"
    );
    if (!featuresContainer) return;

    if (this._features.length === 0) {
      featuresContainer.remove();
    } else {
      this._features.forEach((feature) => {
        const featureElement = document.createElement("p");
        featureElement.classList.add("item__good-feature");
        if (feature.name === "Размер") {
          featureElement.classList.add("item__good-feature_type_size");
        }
        featureElement.textContent = `${feature.name}: ${feature.value}`;
        featuresContainer.appendChild(featureElement);
      });
    }
  }

  _setQuantityWarning() {
    this._countContainer = this._element.querySelector(".item__count");
    if (!this._countContainer) return;

    if (this._maxQuantity < 10) {
      this._countContainer.classList.remove("item__count_no-warning");

      const countWarningElement = document.createElement("p");
      countWarningElement.classList.add("item__count-warning");
      countWarningElement.textContent = `Осталось ${this._maxQuantity} шт.`;

      const counterElement = this._countContainer.querySelector(".counter");
      if (counterElement) {
        this._countContainer.insertBefore(
          countWarningElement,
          counterElement.nextSibling
        );
      } else {
        this._countContainer.appendChild(countWarningElement);
      }
    }
  }

  _setCosts() {
    this._itemOldCostElement = this._element.querySelector(".item__price-old");
    this._itemNewCostElement = this._element.querySelector(
      ".item__price-new-number"
    );
    this._itemCounterInput.value = this._initialCounterValue;
    const oldCost = this._oldPrice * this._itemCounterInput.value;
    const newCost = this._newPrice * this._itemCounterInput.value;

    if (oldCost >= 10000) {
      this._itemOldCostElement.innerHTML =
        formatNumberWithThinSpace(oldCost) + " сом";
    } else {
      this._itemOldCostElement.textContent = oldCost + " сом";
    }

    if (newCost >= 10000) {
      this._itemNewCostElement.innerHTML = formatNumberWithThinSpace(newCost);
      this._itemNewCostElement.classList.add("item__price-new-number_big");
    } else {
      this._itemNewCostElement.textContent = newCost.toString();
    }
  }

  createItemCard() {
    this._element = this._getTemplate();

    this._itemImageElement = this._element.querySelector(".item-image__image");
    this._itemTitleElement = this._element.querySelector(".item__good-title");
    this._itemWarehouseElement =
      this._element.querySelector(".item__warehouse");
    this._itemCompanyElement = this._element.querySelector(
      ".item__company-name"
    );
    this._itemCounterInput = this._element.querySelector(".counter__input");

    this._itemImageElement.src = this._image;
    this._itemImageElement.alt = this._name;
    this._itemTitleElement.innerHTML = this._name;
    this._fillFeatures();
    this._itemWarehouseElement.textContent = this._warehouse;
    this._itemCompanyElement.textContent = this._companyInfo?.shortName;
    this._setQuantityWarning();
    this._setCosts();
    this._setEventListeners();

    if (this._isUnavailable) {
      this._element.querySelector(".checkbox-label").remove();
      this._element.querySelector(".item__vendor").remove();
      this._element.querySelector(".counter").remove();
      this._element.querySelector(".item__count-warning")?.remove();
      this._element.querySelector(".item__price").remove();

      this._element.classList.add("item_unavailable");
      this._itemImageElement.classList.add("item-image__image_unavailable");
      this._element
        .querySelector(".item__good-info")
        .classList.add("item__good-info_unavailable");
      this._countContainer.classList.add("item__count_unavailable");
    }

    return this._element;
  }

  _deleteItemCard() {
    this._element.remove();
    this._element = null;
  }

  _toggleLike() {
    this._isLiked = !this._isLiked;
    this._likeButtonElement.classList.toggle(
      "item__like-btn_active",
      this._isLiked
    );
  }

  _setEventListeners() {
    this._likeButtonElement = this._element.querySelector(".item__like-btn");
    this._deleteButtonElement =
      this._element.querySelector(".item__delete-btn");
    this._actionsElement = this._element.querySelector(".item__actions");

    this._deleteButtonElement.addEventListener("click", () => {
      this._deleteItemCard();
    });

    this._likeButtonElement.addEventListener("click", () => {
      this._toggleLike();
    });

    this._element.addEventListener('mouseenter', () => {
      this._actionsElement.style.visibility = 'visible';
    });

    this._element.addEventListener('mouseleave', () => {
      this._actionsElement.style.visibility = 'hidden';
    });
  }
}

export default ItemCard;
