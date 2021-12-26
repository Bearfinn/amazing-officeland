/**
 *
 * @returns
 * @see https://wax.api.atomicassets.io/docs/
 */

export const getLowestPriceOfRarity = async (rarity: string) => {
  const params = {
    symbol: "WAX",
    collection_name: "officelandio",
    schema_name: "staffs",
    limit: 1,
    "template_data.rarity": rarity,
  };
  const paramsString = Object.entries(params)
    .map(([key, value]: [key: string, value: any]) => `${key}=${value}`)
    .join("&");
  const res = await fetch(
    `https://wax.api.atomicassets.io/atomicmarket/v1/sales/templates?${paramsString}`
  );
  const data = await res.json();
  return data.data[0];
};
