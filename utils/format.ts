export const formatNumber = (number: number | string) => {
  return number ? new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(Number(number)) : "0";
};

export const getCoffeeImageUrl = (name: string) => {
  return `https://officeland.io/images/item/${name}.png`
}