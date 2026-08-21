export const getSalePercentage = (price: number, originalPrice: number) =>
  originalPrice && price 
    ? `${Math.round(((originalPrice - price) * 100) / originalPrice)}%` 
    : '';