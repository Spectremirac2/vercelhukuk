// src/utils/domains.ts

export const DEFAULT_ALLOWED_DOMAINS = [
  "mevzuat.gov.tr",
  "resmigazete.gov.tr",
  "anayasa.gov.tr",
  "yargitay.gov.tr",
  "danistay.gov.tr",
  "barobirlik.org.tr",
];

export function isAllowedDomain(
  uri: string,
  allowedDomains: string[] = DEFAULT_ALLOWED_DOMAINS
): boolean {
  try {
    const url = new URL(uri);
    const hostname = url.hostname;

    // Check if hostname ends with any of the allowed domains
    // This handles subdomains like "www.mevzuat.gov.tr" or "corpus.mevzuat.gov.tr"
    return allowedDomains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}
