export type LoginErrors = {
  identifier?: string;
  password?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The API accepts an email or a phone number, so only check the email format when it looks like one.
// Password rules (length, common passwords) are enforced at sign-up, not at sign-in.
export function validateLogin(identifier: string, password: string): LoginErrors {
  const errors: LoginErrors = {};
  const value = identifier.trim();

  if (!value) {
    errors.identifier = "Enter your email address or phone number.";
  } else if (value.includes("@") && !EMAIL_PATTERN.test(value)) {
    errors.identifier = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Enter your password.";
  }

  return errors;
}
