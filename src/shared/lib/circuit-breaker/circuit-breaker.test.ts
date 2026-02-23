import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { CircuitBreakerFactory, CircuitBreakerOpenError } from "./index";

describe("CircuitBreaker", () => {
  let cb = CircuitBreakerFactory.database("test-db");

  beforeEach(async () => {
    // Override max failure and timeout for tests
    cb = CircuitBreakerFactory.database("test-db-2");
    // Hack to set options for testing if needed, or we just use default and mock time
    // For test-db-2, failureThreshold is 5, resetTimeoutMs is 30000.
    await cb.clearState();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const successAction = async () => "success";
  const failAction = async () => {
    throw new Error("DB Error");
  };

  it("should start in CLOSED state", async () => {
    expect(await cb.getState()).toBe("CLOSED");
  });

  it("should transition to OPEN after reaching failureThreshold", async () => {
    // 5 failures threshold
    for (let i = 0; i < 4; i++) {
      await expect(cb.execute(failAction)).rejects.toThrow("DB Error");
      expect(await cb.getState()).toBe("CLOSED");
    }

    // 5th failure should trigger OPEN
    await expect(cb.execute(failAction)).rejects.toThrow("DB Error");
    expect(await cb.getState()).toBe("OPEN");

    // Subsequent calls should fast-fail with CircuitBreakerOpenError
    await expect(cb.execute(successAction)).rejects.toThrow(CircuitBreakerOpenError);
  });

  it("should transition to HALF_OPEN after resetTimeoutMs", async () => {
    for (let i = 0; i < 5; i++) {
      await expect(cb.execute(failAction)).rejects.toThrow("DB Error");
    }
    expect(await cb.getState()).toBe("OPEN");

    // Fast-forward time by 30 seconds
    vi.advanceTimersByTime(30000);

    // After timeout, state should be HALF_OPEN
    expect(await cb.getState()).toBe("HALF_OPEN");
  });

  it("should return to CLOSED on success in HALF_OPEN", async () => {
    for (let i = 0; i < 5; i++) {
      await expect(cb.execute(failAction)).rejects.toThrow("DB Error");
    }
    vi.advanceTimersByTime(30000);

    // One successful request in HALF_OPEN should close it
    const result = await cb.execute(successAction);
    expect(result).toBe("success");
    expect(await cb.getState()).toBe("CLOSED");
  });

  it("should return to OPEN on failure in HALF_OPEN", async () => {
    for (let i = 0; i < 5; i++) {
      await expect(cb.execute(failAction)).rejects.toThrow("DB Error");
    }
    vi.advanceTimersByTime(30000);
    expect(await cb.getState()).toBe("HALF_OPEN");

    // One failure in HALF_OPEN should immediately open it again
    await expect(cb.execute(failAction)).rejects.toThrow("DB Error");
    expect(await cb.getState()).toBe("OPEN");
  });
});
