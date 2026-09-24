const CURRENCY_EXPONENTS: Record<string, number> = {
    NGN: 2,
    USD: 2,
    EUR: 2,
    GBP: 2,
    JPY: 0,
    BHD: 3,
};

const CURRENCY_SYMBOLS: Record<string, string> = {
    NGN: "₦",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    BHD: "BD ",
};

export function formatMoney(
    amountFlat: string | bigint,
    currency: string,
    opts: { withSymbol?: boolean } = { withSymbol: true },
): string {
    const exponent = CURRENCY_EXPONENTS[currency] ?? 2;
    const symbol = opts.withSymbol ? (CURRENCY_SYMBOLS[currency] ?? "") : "";

    const s = amountFlat.toString().padStart(exponent + 1, "0");
    const whole = exponent === 0 ? s : s.slice(0, -exponent);
    const fraction = exponent === 0 ? "" : s.slice(-exponent);

    const wholeFormatted = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const decimal = exponent === 0 ? "" : `.${fraction}`;

    return `${symbol}${wholeFormatted}${decimal}`;
}