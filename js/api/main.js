// Einstieg für die Endpunkt-Seiten (api/times.html usw.).
// Standard: nur reines JSON. Mit ?view=1 eine formatierte Ansicht mit Kopieren/Download.
import { readQuery } from "./params.js";
import { execute } from "./run.js";
import { renderRaw, renderViewer } from "./view.js";

const name = document.body.dataset.endpoint;
const app = document.getElementById("app");
const query = readQuery();
const pretty = "view" in query;
// Steuer-Parameter nicht an den Endpunkt weitergeben
delete query.view;
delete query.raw;

const result = await execute(name, query);

// Für Browser-Automatisierung (z. B. Playwright)
window.apiResult = result;
document.documentElement.dataset.status = String(result.status);

if (!pretty) {
  renderRaw(app, result);
} else {
  document.body.classList.remove("raw-mode");
  document.title = `${result.status} · ${name} · Prayer Times API`;

  const jsonUrl = new URL(window.location.href);
  jsonUrl.searchParams.delete("view");

  app.innerHTML = `
    <header class="api-top">
      <div class="api-top-inner">
        <a class="back" href="index.html">← API-Dokumentation</a>
        <h1><span class="method-tag">GET</span> <span id="epName"></span></h1>
      </div>
    </header>
    <main class="api-main">
      <div id="viewer" class="panel glass"></div>
    </main>`;
  document.getElementById("epName").textContent = name;

  renderViewer(document.getElementById("viewer"), result, {
    url: `GET ${jsonUrl.href}`,
    rawUrl: jsonUrl.href,
    fileName: `${name}${query.date ? "-" + query.date : ""}${query.month ? "-" + query.month : ""}.json`
  });
}
