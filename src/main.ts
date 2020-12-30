import App from "./App.svelte";

const app = new App({
  target: document.body,
});

// install service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

export default app;
