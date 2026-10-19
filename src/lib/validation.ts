// Form checks for the interpreter sign-up. Same rules as the web app (vri-web src/lib/validation.ts).
// Each returns a message for the person filling in the form, or undefined when the value is fine.
// The API checks the same rules again, so these only help people fix a mistake before they send.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_PATTERN = /^\p{L}[\p{L}\s'’.-]*$/u;

/** Letters from any alphabet, plus spaces, hyphens, apostrophes and full stops (O'Neil, Anne-Marie). */
export function validateName(value: string, what = "your full name"): string | undefined {
  const name = value.trim();
  if (!name) return `Enter ${what}.`;
  if (name.length < 2) return "That is too short.";
  if (!NAME_PATTERN.test(name)) return "Use letters, spaces, hyphens and apostrophes only.";
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const email = value.trim();
  if (!email) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address, like name@example.com.";
  if (/^\d+$/.test(email.split("@")[0])) return "The part before the @ cannot be only numbers.";
  return undefined;
}

/** For choosing a new password only. Never use this on sign-in: older accounts must still get in. */
export function validatePassword(value: string): string | undefined {
  if (!value) return "Enter a password.";
  if (value.length < 8) return "Use at least 8 characters.";
  if (/^\d+$/.test(value)) return "Add some letters. A password cannot be only numbers.";
  return undefined;
}

/** `phone` is the international number the phone field produces, e.g. +256772123456, or "" when empty. */
export function validatePhoneNumber(phone: string): string | undefined {
  if (!phone) return "Enter your phone number.";
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) return "Enter a valid phone number for the selected country.";
  return undefined;
}
