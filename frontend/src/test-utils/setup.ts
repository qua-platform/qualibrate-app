// Global test setup file
import "@testing-library/jest-dom";
import "vitest-canvas-mock";
import { beforeAll, afterAll, afterEach, beforeEach, vi } from "vitest";
import { server } from "./mocks/server";

/**
 * Console Output Suppression
 *
 * Console output and stderr are buffered during test execution and only shown
 * if a test fails. This keeps output clean when all tests pass, but shows
 * helpful debug information when tests fail.
 *
 * To see ALL console output (even for passing tests):
 * - Set environment variable: DEBUG_TESTS=true npm test
 * - Or use npm script: npm run test:unit:debug
 */

const DEBUG_TESTS = process.env.DEBUG_TESTS === "true";

// Signal to vitest.config.ts that tests are running
(globalThis as unknown as { __vitest_tests_running__: boolean }).__vitest_tests_running__ = true;

// Store original console methods and stderr
const originalConsole = {
  log: console.log.bind(console),
  debug: console.debug.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};
const originalStderrWrite = process.stderr.write.bind(process.stderr);

// Buffers for capturing output during each test
let consoleBuffer: Array<{ type: keyof typeof originalConsole; args: unknown[] }> = [];
let stderrBuffer: string[] = [];

if (!DEBUG_TESTS) {
  // Create buffering console methods
  const createBufferingConsole = (type: keyof typeof originalConsole) => {
    return (...args: unknown[]) => {
      consoleBuffer.push({ type, args });
    };
  };

  // Replace console methods with buffering versions
  global.console = {
    ...console,
    log: createBufferingConsole("log") as typeof console.log,
    debug: createBufferingConsole("debug") as typeof console.debug,
    info: createBufferingConsole("info") as typeof console.info,
    warn: createBufferingConsole("warn") as typeof console.warn,
    error: createBufferingConsole("error") as typeof console.error,
  };

  // Override stderr.write to buffer ALL stderr output (including React errors)
  // This will be printed only if the test fails
  process.stderr.write = ((chunk: string | Uint8Array) => {
    const text = typeof chunk === "string" ? chunk : chunk.toString();
    stderrBuffer.push(text);
    // Return true to indicate success (required by Node.js stream API)
    return true;
  }) as typeof process.stderr.write;
}

// Clear buffers before each test
beforeEach(() => {
  consoleBuffer = [];
  stderrBuffer = [];
});

// After each test, print buffered output only if test failed
afterEach(async (context: { task?: { result?: { state?: string; errors?: unknown[] } } }) => {
  if (DEBUG_TESTS) {
    return; // In debug mode, output already appeared in real-time
  }

  // Wait a tick to ensure test state is updated
  await new Promise(resolve => setTimeout(resolve, 0));

  // Check if test failed
  const testFailed =
    context?.task?.result?.state === "fail" ||
    (context?.task?.result?.errors && context.task.result.errors.length > 0);

  if (testFailed) {
    // Print buffered console output
    if (consoleBuffer.length > 0) {
      originalConsole.log("\n━━━ Console Output (Test Failed) ━━━");
      consoleBuffer.forEach(({ type, args }) => {
        originalConsole[type](...args);
      });
    }

    // Print buffered stderr
    if (stderrBuffer.length > 0) {
      originalConsole.log("\n━━━ Stderr Output (Test Failed) ━━━");
      stderrBuffer.forEach((chunk) => {
        originalStderrWrite(chunk);
      });
    }

    if (consoleBuffer.length > 0 || stderrBuffer.length > 0) {
      originalConsole.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    }
  }

  // Clear buffers for next test
  consoleBuffer = [];
  stderrBuffer = [];
});

// Mock WebSocket globally
global.WebSocket = vi.fn(() => ({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  send: vi.fn(),
  close: vi.fn(),
  readyState: 1, // OPEN
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})) as any;

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})) as any;

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})) as any;

// Setup MSW server
// Configure to bypass WebSocket URLs and silence warnings for unhandled requests
beforeAll(() =>
  server.listen({
    onUnhandledRequest(request) {
      // Ignore WebSocket connection attempts
      const url = new URL(request.url);
      if (url.protocol === "ws:" || url.protocol === "wss:") {
        return;
      }

      // Silence warnings about unhandled HTTP requests in tests
      // We don't need to mock every endpoint, only the ones that matter for our tests
    },
  })
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());