export const formatNumber = (number: number | string) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(Number(number));
};

export const getCoffeeImageUrl = (name: string) => {
  return `https://officeland.io/_next/image?url=%2Fimages%2Fitem%2F${name}.png&w=96&q=75`
}