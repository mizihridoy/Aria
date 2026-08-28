export interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
}

export class InMemoryRateLimiter {
  private requests = new Map<string, number[]>();

  constructor(private readonly options: RateLimiterOptions = { windowMs: 60_000, maxRequests: 10 }) {}

  public isRateLimited(key: string): { limited: boolean; retryAfterMs: number } {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];

    // Filter out timestamps outside current window
    const validTimestamps = timestamps.filter(t => now - t < this.options.windowMs);

    if (validTimestamps.length >= this.options.maxRequests) {
      const oldestValid = validTimestamps[0];
      const retryAfterMs = this.options.windowMs - (now - oldestValid);
      return { limited: true, retryAfterMs: Math.max(0, retryAfterMs) };
    }

    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    return { limited: false, retryAfterMs: 0 };
  }

  public reset(key: string): void {
    this.requests.delete(key);
  }

  public cleanup(): void {
    const now = Date.now();
    for (const [key, timestamps] of this.requests.entries()) {
      const valid = timestamps.filter(t => now - t < this.options.windowMs);
      if (valid.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, valid);
      }
    }
  }
}
