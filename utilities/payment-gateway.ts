// Convert all amount to be coherent with Stripe
export function formatAmountForStripe(amount: number, currency: string) {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);

  let zeroDecimalCurrency = true;

  for (const part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }

  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

// Convert Stripe amount back to decimal format
export function reverseFormatAmountForStripe(
  amount: number,
  currency: string,
): number {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(1);
  const hasDecimal = parts.some((part) => part.type === "decimal");

  return hasDecimal ? amount / 100 : amount;
}
