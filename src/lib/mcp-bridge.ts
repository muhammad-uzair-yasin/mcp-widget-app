/**
 * MCP Apps bridge: when embedded in a ChatGPT iframe, exchange
 * ui/initialize and ui/notifications/initialized with the host via postMessage.
 * No-op when not in an iframe (window === window.top).
 */

let initialized = false;

export function initMcpBridge(): void {
  if (window !== window.top) {
    // Already set up once
    if (initialized) return;
    initialized = true;

    const parent = window.parent;
    let initSent = false;
    let initializedSent = false;

    const sendInitialize = (): void => {
      if (initSent) return;
      initSent = true;
      parent.postMessage(
        {
          jsonrpc: "2.0",
          id: "ui-init-" + Date.now(),
          method: "ui/initialize",
          params: {},
        },
        "*"
      );
    };

    const sendInitialized = (): void => {
      if (initializedSent) return;
      initializedSent = true;
      parent.postMessage(
        {
          jsonrpc: "2.0",
          method: "ui/notifications/initialized",
          params: {},
        },
        "*"
      );
    };

    const handler = (event: MessageEvent): void => {
      const msg = event.data;
      if (!msg || typeof msg !== "object" || msg.jsonrpc !== "2.0") return;

      sendInitialize();

      // When host responds (result or capabilities), send ui/notifications/initialized once
      if (msg.result !== undefined || msg.method !== undefined) {
        sendInitialized();
      }
    };

    window.addEventListener("message", handler);

    // Send ui/initialize shortly after load so host can respond
    window.setTimeout(sendInitialize, 100);
  }
}
