export function formatNumberWithThinSpace(number) {
  const formattedNumber = number
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "&thinsp;");
  return formattedNumber;
}

export function formatQuantity(quantity) {
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

export function formatPrice(price) {
  const formattedPrice = price
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    .replace(".", ",");
  return `${formattedPrice} сом`;
}

export function addSpaces(input) {
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

export function updateParentDisplay(container, childElementClass) {
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
