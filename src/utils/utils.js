export function formatNumberWithThinSpace(number) {
  const formattedNumber = number
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "&thinsp;");
  return formattedNumber;
}
