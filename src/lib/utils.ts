// src/lib/utils.ts - Utility functions

/**
 * Creates a promise that rejects after the specified timeout
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = "Operation timed out"
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 1000,
    maxDelayMs = 10000,
    shouldRetry = () => true,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      const delay = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normalize URL for deduplication
 * - Removes trailing slashes
 * - Normalizes protocol to https
 * - Removes www. prefix
 * - Lowercases hostname
 */
export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);

    // Normalize protocol
    parsed.protocol = "https:";

    // Normalize hostname
    let hostname = parsed.hostname.toLowerCase();
    if (hostname.startsWith("www.")) {
      hostname = hostname.slice(4);
    }
    parsed.hostname = hostname;

    // Remove trailing slash from pathname
    if (parsed.pathname.endsWith("/") && parsed.pathname.length > 1) {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }

    // Remove default port
    parsed.port = "";

    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Deduplicate sources by normalized URL
 */
export function deduplicateSources<T extends { uri: string }>(
  sources: T[]
): T[] {
  const seen = new Map<string, T>();

  for (const source of sources) {
    const normalizedUri = normalizeUrl(source.uri);
    if (!seen.has(normalizedUri)) {
      seen.set(normalizedUri, source);
    }
  }

  return Array.from(seen.values());
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Generate a unique conversation ID
 */
export function generateConversationId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `conv_${timestamp}_${random}`;
}

/**
 * Check if an error is a network/timeout error that should be retried
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("timeout") ||
      message.includes("network") ||
      message.includes("fetch failed") ||
      message.includes("econnreset") ||
      message.includes("socket hang up")
    );
  }
  return false;
}

/**
 * Format error for user display (sanitized)
 */
export function formatUserError(error: unknown): string {
  if (error instanceof Error) {
    // Don't expose internal error details
    if (error.message.includes("API key")) {
      return "Sistem yapılandırma hatası. Lütfen daha sonra tekrar deneyin.";
    }
    if (error.message.includes("timeout")) {
      return "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.";
    }
    if (error.message.includes("rate limit")) {
      return "Çok fazla istek gönderildi. Lütfen bir dakika bekleyin.";
    }
  }
  return "Bir hata oluştu. Lütfen tekrar deneyin.";
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
