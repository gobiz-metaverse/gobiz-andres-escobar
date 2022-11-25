export function convertNumberToCurrency(text) {
  if (text === "") return "";
  if (text === 0 || text === "0") return 0;
  const newCurrency = text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return newCurrency;
}