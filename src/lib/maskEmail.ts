export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain || local.length <= 2) return email;

  const visible = local.slice(0, 2);
  const masked = "*".repeat(local.length - 2);
  return `${visible}${masked}@${domain}`;
}