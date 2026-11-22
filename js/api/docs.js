// Doku-Seite (api/index.html): URL-Baukasten, Live-Vorschau, Endpunkt-Referenz.
// Mit ?raw=1 liefert die Seite stattdessen die Übersicht als reines JSON.
import { CALCULATION_METHODS, MADHABS } from "../config.js";
import { todayIn, browserTimeZone } from "../core/time.js";
import { endpoints } from "./endpoints.js";
import { readQuery } from "./params.js";
import { execute } from "./run.js";
import { renderRaw, renderViewer } from "./view.js";

const $ = (id) => document.getElementById(id);

/* ---------- Roh-Modus ---------- */

if ("raw" in readQuery()) {
  const result = await execute("index", {});
  window.apiResult = result;
  document.body.classList.add("raw-mode");
  renderRaw($("app"), result);
} else {
  initBuilder();
  renderReference(await endpoints.index());
}

/* ---------- URL-Baukasten ---------- */

function initBuilder() {
  const form = $("builder");
  $("bMethod").replaceChildren(...CALCULATION_METHODS.map((m) => new Option(`${m.label} (${m.id})`, m.id)));
  $("bMadhab").replaceChildren(...MADHABS.map((m) => new Option(`${m.label} (${m.id})`, m.id)));
  $("bMethod").value = "TURKEY";
  $("bDate").value = todayIn(browserTimeZone());
  $("bMonth").value = $("bDate").value.slice(0, 7);

  const update = () => {
    syncVisibility();
    $("builtUrl").textContent = buildUrl().href;
    $("openLink").href = buildUrl().href;
  };
  form.addEventListener("input", update);
  form.addEventListener("change", update);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const btn = $("runBtn");
    btn.disabled = true;
    btn.textContent = "Läuft …";
    const { endpoint, query } = readForm();
    const result = await execute(endpoint, query);
    renderViewer($("preview"), result, { compact: true, fileName: `${endpoint}.json` });
    btn.disabled = false;
    btn.textContent = "Anfrage ausführen";
  });

  $("copyUrl").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(buildUrl().href);
      $("copyUrl").textContent = "Kopiert ✓";
    } catch {
      $("copyUrl").textContent = "Nicht möglich";
    }
    setTimeout(() => { $("copyUrl").textContent = "URL kopieren"; }, 1500);
  });

  update();
}

/** Zeigt nur die Felder, die zum gewählten Endpunkt gehören. */
function syncVisibility() {
  const endpoint = $("bEndpoint").value;
  const mode = new FormData($("builder")).get("mode");
  for (const el of document.querySelectorAll("[data-for]")) {
    el.hidden = !el.dataset.for.split(" ").includes(endpoint);
  }
  for (const el of document.querySelectorAll("[data-mode]")) {
    el.hidden = el.dataset.mode !== mode || endpoint === "methods";
  }
}

function readForm() {
  const endpoint = $("bEndpoint").value;
  const data = new FormData($("builder"));
  const query = {};
  const set = (key, value) => { if (value && String(value).trim()) query[key] = String(value).trim(); };

  if (endpoint !== "methods") {
    if (data.get("mode") === "city") {
      set("city", data.get("city"));
      set("country", data.get("country"));
    } else {
      set("lat", data.get("lat"));
      set("lon", data.get("lon"));
    }
  }
  if (endpoint === "times") set("date", data.get("date"));
  if (endpoint === "calendar") set("month", data.get("month"));
  if (endpoint === "times" || endpoint === "calendar") {
    set("method", data.get("method"));
    set("madhab", data.get("madhab"));
  }
  return { endpoint, query };
}

function buildUrl() {
  const { endpoint, query } = readForm();
  const url = new URL(`${endpoint}.html`, window.location.href);
  url.search = new URLSearchParams(query);
  return url;
}

/* ---------- Referenz ---------- */

function renderReference(index) {
  const list = $("reference");
  list.replaceChildren(...index.endpoints.map((ep) => {
    const card = document.createElement("article");
    card.className = "ref-card";

    const head = document.createElement("div");
    head.className = "ref-head";
    head.innerHTML = `<span class="method-tag">GET</span><code></code>`;
    head.querySelector("code").textContent = ep.path;

    const desc = document.createElement("p");
    desc.className = "muted";
    desc.textContent = ep.description;

    card.append(head, desc);

    const params = Object.entries(ep.params);
    if (params.length) {
      const table = document.createElement("table");
      table.className = "param-table";
      table.innerHTML = "<thead><tr><th>Parameter</th><th>Beschreibung</th></tr></thead>";
      const body = document.createElement("tbody");
      for (const [key, text] of params) {
        const row = body.insertRow();
        const k = document.createElement("code");
        k.textContent = key;
        row.insertCell().append(k);
        row.insertCell().textContent = text;
      }
      table.append(body);
      card.append(table);
    }

    const examples = document.createElement("div");
    examples.className = "examples";
    for (const example of ep.examples) {
      const a = document.createElement("a");
      a.href = example.replace(/^api\//, "");
      a.textContent = example;
      examples.append(a);
    }
    card.append(examples);
    return card;
  }));
}
