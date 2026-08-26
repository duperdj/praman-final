// lib/registries/verhoeff.ts
// Verhoeff checksum algorithm for validating digit strings.
//
// Real UIDAI Aadhaar numbers pass this check. Every synthetic "aadhaarLike" number
// in this codebase DELIBERATELY fails it, so they can never collide with real Aadhaar.
// See: https://en.wikipedia.org/wiki/Verhoeff_algorithm

// Dihedral group D₅ multiplication table
const TABLE_D: readonly number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
] as const;

// Permutation table (8 permutations, cycled by position mod 8)
const TABLE_P: readonly number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
] as const;

// Inverse table: TABLE_D[x][TABLE_INV[x]] === 0 for all x
const TABLE_INV: readonly number[] = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9] as const;

/**
 * Returns true if the string passes the Verhoeff checksum.
 * A genuine Aadhaar number returns true here.
 * Synthetic Aadhaar-like numbers in this repo return false (by design).
 */
export function isValidVerhoeff(n: string): boolean {
  if (!/^\d{12}$/.test(n)) return false;
  const digits = n.split("").map(Number);
  let c = 0;
  // Process digits right-to-left; rightmost digit is at position 0.
  for (let i = digits.length - 1; i >= 0; i--) {
    const pos = digits.length - 1 - i;
    c = TABLE_D[c][TABLE_P[pos % 8][digits[i]]];
  }
  return c === 0;
}

/**
 * Returns true if the number FAILS the Verhoeff checksum.
 * Every aadhaarLike in this codebase must satisfy failsVerhoeff(n) === true.
 */
export function failsVerhoeff(n: string): boolean {
  return !isValidVerhoeff(n);
}

/**
 * Compute the valid Verhoeff check digit for an 11-digit prefix.
 * (Internal helper; exported for testing.)
 */
export function computeCheckDigit(prefix11: string): number {
  if (!/^\d{11}$/.test(prefix11)) {
    throw new Error(`prefix must be exactly 11 digits, got: "${prefix11}"`);
  }
  const digits = prefix11.split("").map(Number);
  let c = 0;
  // The check digit occupies position 0; prefix digits occupy positions 1..11.
  for (let i = digits.length - 1; i >= 0; i--) {
    const pos = digits.length - i; // 1 to 11
    c = TABLE_D[c][TABLE_P[pos % 8][digits[i]]];
  }
  return TABLE_INV[c];
}

/**
 * Generate a 12-digit synthetic Aadhaar-like number from an 11-digit prefix.
 * The last digit is deliberately offset (+1 mod 10) from the valid check digit,
 * ensuring the result ALWAYS fails the Verhoeff checksum.
 *
 * NEVER use these numbers to impersonate real Aadhaar. They are synthetic data only.
 */
export function makeSyntheticAadhaar(prefix11: string): string {
  const validCheck = computeCheckDigit(prefix11);
  const invalidCheck = (validCheck + 1) % 10; // deliberately wrong
  const result = prefix11 + String(invalidCheck);
  // Belt-and-suspenders assertion — should never trip
  if (isValidVerhoeff(result)) {
    throw new Error(`BUG: synthetic Aadhaar ${result} accidentally passes Verhoeff`);
  }
  return result;
}
