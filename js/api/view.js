// Darstellung von API-Antworten: Roh-JSON oder formatierter Viewer.

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const TOKEN = /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

/** JSON-Text → HTML mit Farb-Klassen für Schlüssel, Strings, Zahlen usw. */
export function highlightJson(json) {
  return escapeHtml(json).replace(TOKEN, (token) => {
    let type = "num";
    if (token.startsWith('"')) type = token.trimEnd().endsWith(":") ? "key" : "str";
    else if (token === "true" || token === "false") type = "bool";
    else if (token === "null") type = "null";
    return `<span class="j-${type}">${token}</span>`;
  });
}

function statusClass(status) {
  if (status < 300) return "ok";
  if (status < 500) return "warn";
  return "fail";
}

function statusText(status) {
  return {
    200: "OK", 400: "Ungültige Anfrage", 404: "Nicht gefunden",
    422: "Nicht verarbeitbar", 500: "Interner Fehler", 502: "Dienst nicht erreichbar"
  }[status] ?? "";
}

export function renderRaw(container, result) {
  const pre = document.createElement("pre");
  pre.id = "output";
  pre.className = "raw";
  pre.textContent = JSON.stringify(result, null, 2);
  container.replaceChildren(pre);
}

/**
 * Formatierter Viewer mit Status, URL, Kopieren und Download.
 * options: { url, rawUrl, fileName, compact }
 */
export function renderViewer(container, result, options = {}) {
  const json = JSON.stringify(result, null, 2);
  const cls = statusClass(result.status);

  container.innerHTML = `
    <div class="viewer ${options.compact ? "compact" : ""}">
      <div class="viewer-head">
        <span class="status ${cls}">${result.status} ${statusText(result.status)}</span>
        <code class="viewer-url"></code>
        <div class="viewer-actions">
          <button class="btn" type="button" data-action="copy">Kopieren</button>
          <button class="btn" type="button" data-action="download">Download</button>
          ${options.rawUrl ? `<a class="btn" data-action="raw">Roh-JSON</a>` : ""}
        </div>
      </div>
      <pre class="json">${highlightJson(json)}</pre>
    </div>`;

  container.querySelector(".viewer-url").textContent = options.url ?? "";
  if (options.rawUrl) container.querySelector('[data-action="raw"]').href = options.rawUrl;

  const copyBtn = container.querySelector('[data-action="copy"]');
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(json);
      copyBtn.textContent = "Kopiert ✓";
    } catch {
      copyBtn.textContent = "Nicht möglich";
    }
    setTimeout(() => { copyBtn.textContent = "Kopieren"; }, 1500);
  });

  container.querySelector('[data-action="download"]').addEventListener("click", () => {
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = options.fileName ?? `${result.endpoint}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  });
}
