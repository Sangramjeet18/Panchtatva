import time
from collections import defaultdict
from fastapi import Request, HTTPException

class InMemoryRateLimiter:
    """
    In-memory rate limiter per client IP for POST routes.
    Sliding window algorithm with zero external dependencies.
    """
    def __init__(self, max_requests: int = 60, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.history = defaultdict(list)

    def __call__(self, request: Request):
        client_ip = request.client.host if request.client else "127.0.0.1"
        now = time.time()
        cutoff = now - self.window_seconds

        # Clean timestamps older than window
        self.history[client_ip] = [t for t in self.history[client_ip] if t > cutoff]

        if len(self.history[client_ip]) >= self.max_requests:
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded: maximum {self.max_requests} requests per {self.window_seconds}s for POST endpoints."
            )
        self.history[client_ip].append(now)

rate_limit_post = InMemoryRateLimiter(max_requests=60, window_seconds=60)
