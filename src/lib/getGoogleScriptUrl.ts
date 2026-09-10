export function getGoogleScriptUrl(): string {
  const raw = process.env.GOOGLE_SCRIPT_URL?.trim() || '';

  // Support accidental KEY=VALUE configuration
  const value = raw.replace(/^GOOGLE_SCRIPT_URL\s*=\s*/i, '').trim();

  if (!value || !/^https:\/\/script\.google\.com\//i.test(value)) {
    throw new Error('Invalid GOOGLE_SCRIPT_URL configuration');
  }

  return value;
}
