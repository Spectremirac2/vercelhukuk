// src/lib/rate-limit.ts - Simple in-memory rate limiting
// Note: For production, use Redis-based rate limiting

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

class RateLimiter {
  private cache: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Cleanup expired entries every minute
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.resetTime < now) {
        this.cache.delete(key);
      }
    }
  }

  check(
    key: string,
    config: RateLimitConfig
  ): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const entry = this.cache.get(key);

    if (!entry || entry.resetTime < now) {
      // New window
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + config.windowMs,
      };
      this.cache.set(key, newEntry);
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: newEntry.resetTime,
      };
    }

    if (entry.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    entry.count++;
    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Default configurations
export const RATE_LIMIT_CONFIGS = {
  // Chat endpoint: 20 requests per minute
  chat: {
    windowMs: 60 * 1000,
    maxRequests: 20,
  },
  // Upload endpoint: 10 requests per minute
  upload: {
    windowMs: 60 * 1000,
    maxRequests: 10,
  },
  // Strict limit for abuse prevention: 100 per hour
  hourly: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 100,
  },
} as const;

// Get client identifier (IP or fallback)
export function getClientId(request: Request): string {
  // Try various headers for IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback to a hash of user agent
  const userAgent = request.headers.get("user-agent") || "unknown";
  return `ua:${hashString(userAgent)}`;
}

// Simple string hash
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Rate limit check helper
export function checkRateLimit(
  request: Request,
  endpoint: keyof typeof RATE_LIMIT_CONFIGS
): {
  allowed: boolean;
  headers: Record<string, string>;
} {
  const clientId = getClientId(request);
  const config = RATE_LIMIT_CONFIGS[endpoint];
  const key = `${endpoint}:${clientId}`;

  const result = rateLimiter.check(key, config);

  const headers: Record<string, string> = {
    "X-RateLimit-Limit": config.maxRequests.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(result.resetTime / 1000).toString(),
  };

  if (!result.allowed) {
    headers["Retry-After"] = Math.ceil(
      (result.resetTime - Date.now()) / 1000
    ).toString();
  }

  return { allowed: result.allowed, headers };
}
