class ItemCard {
  constructor(
    { image, name, features, warehouse, companyInfo, initialCounterValue, maxQuantity, oldPrice, newPrice },
    templateSelector,
    isUnavailable,
    handleDelButtonClick,
    handleLikeItemCard
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
    this._handleDelButtonClick = handleDelButtonClick;
    this._handleLikeItemCard = handleLikeItemCard;
  }

  _getTemplate() {
    const itemElement = document
      .querySelector(this._templateSelector)
      .content.querySelector(".item")
      .cloneNode(true);

    return itemElement;
  }

  _fillFeatures() {
    const featuresContainer = this._element.querySelector('.item__good-features');
    if (!featuresContainer) return;

    if (this._data.features.length === 0) {
      featuresContainer.remove();
    } else {
      this._data.features.forEach((feature) => {
        const featureElement = document.createElement('p');
        featureElement.classList.add('item__good-feature');
        if (feature.name === 'Размер') {
          featureElement.classList.add('item__good-feature_type_size');
        }
        featureElement.textContent = `${feature.name}: ${feature.value}`;
        featuresContainer.appendChild(featureElement);
      });
    }
  }

  _setQuantityWarning() {
    this._countContainer = this._element.querySelector('.item__count');
    if (!this._countContainer) return;

    if (this._maxQuantity < 10) {
      this._countContainer.classList.remove('item__count_no-warning');

      const countWarningElement = document.createElement('p');
      countWarningElement.classList.add('item__count-warning');
      countWarningElement.textContent = `Осталось ${this._maxQuantity} шт.`;

      const counterElement = this._countContainer.querySelector('.counter');
      if (counterElement) {
        this._countContainer.insertBefore(countWarningElement, counterElement.nextSibling);
      } else {
        this._countContainer.appendChild(countWarningElement);
      }
    }
  }

  createItemCard() {
    this._element = this._getTemplate();

    this._itemImageElement = this._element.querySelector(".item-image__image");
    this._itemTitleElement = this._element.querySelector(".item__good-title");
    this._itemWarehouseElement = this._element.querySelector(".item__warehouse");
    this._itemCompanyElement = this._element.querySelector(".item__company-name");
    this._itemOldCostElement = this._element.querySelector(".item__price-old");
    this._itemNewCostElement = this._element.querySelector(".item__price-new-number");
    this._itemCounterInput = this._element.querySelector(".counter__input");

    this._itemImageElement.src = `<%=require(${this._image})%>`;
    this._itemImageElement.alt = this._name;
    this._itemTitleElement.textContent = this._name;
    this._fillFeatures();
    this._itemWarehouseElement.textContent = this._warehouse;
    this._itemCompanyElement.textContent = this._companyInfo?.shortName;
    this._itemCounterInput.value = this._initialCounterValue;
    this._itemOldCostElement.textContent = this._oldPrice * this._itemCounterInput.value;
    this._itemNewCostElement.textContent = this._newPrice * this._itemCounterInput.value;
    this._setQuantityWarning();

    if (this._isUnavailable) {
      this._element.querySelector(".checkbox-label").remove();
      this._element.querySelector(".item__vendor").remove();
      this._element.querySelector(".counter").remove();
      this._element.querySelector(".item__count-warning")?.remove();
      this._element.querySelector(".item__price").remove();

      this._element.classList.add('item_unavailable');
      this._itemImageElement.classList.add('item-image__image_unavailable');
      this._element.querySelector(".item__good-info").classList.add('item__good-info_unavailable');
      this._countContainer.classList.add('item__count_unavailable');
    }

    return this._element;
  }

  // handleDeleteItemCard() {
  //   this._element.remove();
  //   this._element = null;
  // }

  // _setEventListeners() {
  //   this._likeButtonElement = this._element.querySelector(".card__like-button");
  //   this._deleteButtonElement = this._element.querySelector(
  //     ".card__delete-button"
  //   );
  //   this._likeCounter = this._element.querySelector(".card__like-counter");

  //   if (this._ownerId !== this._userId) {
  //     this._deleteButtonElement.remove();
  //     this._deleteButtonElement = null;
  //   } else {
  //     this._deleteButtonElement.addEventListener("click", () => {
  //       this._handleDelButtonClick();
  //     });
  //   }

  //   this._cardImageElement.addEventListener("click", () => {
  //     this._handleCardClick(this._name, this._link);
  //   });

  //   this._likeButtonElement.addEventListener("click", () => {
  //     this._handleLikeCard(this._cardId);
  //   });
  // }
}

export default ItemCard;
