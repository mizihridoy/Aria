export class AriaError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'ARIA_ERROR',
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AriaError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AIProviderError extends AriaError {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly isRateLimit: boolean = false,
    details?: unknown
  ) {
    super(message, 'AI_PROVIDER_ERROR', details);
    this.name = 'AIProviderError';
  }
}

export class DatabaseError extends AriaError {
  constructor(message: string, details?: unknown) {
    super(message, 'DATABASE_ERROR', details);
    this.name = 'DatabaseError';
  }
}

export class PermissionError extends AriaError {
  constructor(message: string) {
    super(message, 'PERMISSION_ERROR');
    this.name = 'PermissionError';
  }
}

export class RateLimitError extends AriaError {
  constructor(
    message: string,
    public readonly retryAfterMs: number
  ) {
    super(message, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}
