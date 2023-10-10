class Counter {
  constructor(containerElement, maxQuantity, itemCardInstance) {
    this._maxQuantity = maxQuantity;
    this._containerElement = containerElement;
    this._input = this._containerElement.querySelector(".counter__input");
    this._plusButton =
      this._containerElement.querySelector(".counter__plus-btn");
    this._minusButton = this._containerElement.querySelector(
      ".counter__minus-btn"
    );
    this._itemCardInstance = itemCardInstance;

    this._plusButton.addEventListener(
      "click",
      this._handlePlusClick.bind(this)
    );
    this._minusButton.addEventListener(
      "click",
      this._handleMinusClick.bind(this)
    );

    this._updateButtonStyles(parseInt(this._input.value));
  }

  _handlePlusClick() {
    let currentValue = parseInt(this._input.value) || 0;

    if (currentValue < this._maxQuantity || !isFinite(this._maxQuantity)) {
      currentValue++;
      this._input.value = currentValue;
      this._updateButtonStyles(currentValue);
      this._itemCardInstance._updateCosts();
    }
  }

  _handleMinusClick() {
    let currentValue = parseInt(this._input.value) || 0;

    if (currentValue > 1) {
      currentValue--;
      this._input.value = currentValue;
      this._updateButtonStyles(currentValue);
      this._itemCardInstance._updateCosts();
    }
  }

  _updateButtonStyles(currentValue) {
    if (currentValue <= 1) {
      this._minusButton.classList.add("counter__btn_inactive");
    } else {
      this._minusButton.classList.remove("counter__btn_inactive");
    }

    if (currentValue >= this._maxQuantity) {
      this._plusButton.classList.add("counter__btn_inactive");
    } else {
      this._plusButton.classList.remove("counter__btn_inactive");
    }
  }
}

export default Counter;