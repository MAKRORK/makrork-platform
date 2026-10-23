import { useEffect, useState } from "preact/hooks";

type ApiStatus = "checking" | "online" | "offline";

export function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/health", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(() => setApiStatus("online"))
      .catch(() => {
        if (!controller.signal.aborted) setApiStatus("offline");
      });
    return () => controller.abort();
  }, []);

  return (
    <main class="shell">
      <header class="header">
        <span class="brand">▦ teampix</span>
        <span class="status">API: {apiStatus}</span>
      </header>
      <section class="placeholder">
        <h1>teampix</h1>
        <p>Здесь будет совместный пиксельный редактор.</p>
        <small>Preact + TypeScript · Rust + Axum</small>
      </section>
    </main>
  );
}
