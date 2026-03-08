export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizePhone(value: string) {
  const trimmed = value.trim();
  const hasLeadingPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasLeadingPlus ? `+${digits}` : digits;
}

export function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export function detectIdentifierType(value: string): "email" | "phone" {
  return EMAIL_REGEX.test(value.trim()) ? "email" : "phone";
}

export function normalizeIdentifier(value: string) {
  const trimmed = value.trim();
  if (EMAIL_REGEX.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  return normalizePhone(trimmed);
}

export function isValidIdentifier(value: string) {
  const trimmed = value.trim();
  return EMAIL_REGEX.test(trimmed) || isValidPhone(trimmed);
}
