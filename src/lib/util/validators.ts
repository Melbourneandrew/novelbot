export function validateEmail(email: string): boolean {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validatePassword(password: string): string {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  return "";
}

export function validateDisplayName(displayName: string): string {
  if (displayName.length < 3) {
    return "Display name must be at least 3 characters long.";
  }
  if (displayName.length > 20) {
    return "Display name must be less than 20 characters long.";
  }
  if (!/^[a-zA-Z0-9\- ]+$/.test(displayName)) {
    return "Display name must contain only letters, numbers, dashes, underscores, spaces.";
  }

  return "";
}
