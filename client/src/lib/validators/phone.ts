/**
 * Nigeria-only phone normalisation.
 *
 * Accepts any of these forms and returns E.164 (+234XXXXXXXXXX):
 *   07068518999        → +2347068518999   (local, 11 digits with leading 0)
 *   7068518999         → +2347068518999   (10 digits, no leading 0)
 *   +2347068518999     → +2347068518999   (proper E.164)
 *   +23407068518999    → +2347068518999   (E.164 with extra leading 0 — user error, auto-fixed)
 *   234 706 851 8999   → +2347068518999   (spaces removed)
 *
 * Returns "" if input is "" (so the field can be cleared).
 * Returns null if the input is not a valid Nigerian mobile number.
 */
export function normalizeNigerianPhone(input: string): string | null {
    if (input === "") return "";

    // Strip spaces, dashes, parens
    const cleaned = input.replace(/[\s\-()]/g, "");

    // Strip a single leading "+"
    const digits = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;

    // Reject if not all digits
    if (!/^\d+$/.test(digits)) return null;

    let local: string;

    if (digits.startsWith("234")) {
        // Has country code
        const rest = digits.slice(3);
        // If the user also left a leading 0 after the country code, strip it
        local = rest.startsWith("0") ? rest.slice(1) : rest;
    } else if (digits.startsWith("0")) {
        // Local format with leading 0
        local = digits.slice(1);
    } else {
        // Bare 10 digits
        local = digits;
    }

    // Nigerian mobile numbers: 10 digits starting with 7, 8, or 9
    if (!/^[789]\d{9}$/.test(local)) return null;

    return `+234${local}`;
}