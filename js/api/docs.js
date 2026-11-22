// Doku-Seite (api/index.html): Sprachwahl, URL-Baukasten, Live-Vorschau, Endpunkt-Referenz.
// Mit ?raw=1 liefert die Seite stattdessen die Übersicht als reines JSON.
import { CALCULATION_METHODS, MADHABS } from "../config.js";
import { todayIn, browserTimeZone } from "../core/time.js";
import {
  detectLanguage, getLanguage, onLanguageChange, renderLanguageSwitch, setLanguage, t
} from "../core/i18n.js";
import { loadSettings, saveSettings } from "../core/settings.js";
import { endpoints } from "./endpoints.js";
import { readQuery } from "./params.js";
import { execute } from "./run.js";
import { renderRaw, renderViewer } from "./view.js";

const $ = (id) => document.getElementById(id);

/* ---------- Start ---------- */

const query = readQuery();
if ("raw" in query) {
  const result = await execute("index", { lang: query.lang });
  window.apiResult = result;
  document.body.classList.add("raw-mode");
  renderRaw($("app"), result);
} else {
  setLanguage(detectLanguage(loadSettings().lang));
  renderLanguageSwitch($("langGroup"), (id) => {
    saveSettings({ lang: id });
    setLanguage(id);
  });
  initBuilder();
  onLanguageChange(translatePage);
  translatePage();
}

/** Alles Sprachabhängige, das nicht über data-i18n läuft. */
async function translatePage() {
  const lang = getLanguage().id;
  fillOptions($("bMethod"), CALCULATION_METHODS.map(({ id }) => [id, `${t(`methods.${id}`)} (${id})`]));
  fillOptions($("bMadhab"), MADHABS.map(({ id }) => [id, `${t(`madhabs.${id}.label`)} (${id})`]));
  $("bLang").value = lang; // Antwortsprache folgt der Oberfläche (änderbar)
  renderReference(await endpoints.index({}, lang));
  updateUrl();
}

function fillOptions(select, entries) {
  const value = select.value;
  select.replaceChildren(...entries.map(([id, label]) => new Option(label, id)));
  if (value) select.value = value;
}

/* ---------- URL-Baukasten ---------- */

function initBuilder() {
  const form = $("builder");
  fillOptions($("bMethod"), CALCULATION_METHODS.map(({ id }) => [id, id]));
  fillOptions($("bMadhab"), MADHABS.map(({ id }) => [id, id]));
  $("bMethod").value = "TURKEY";
  $("bDate").value = todayIn(browserTimeZone());
  $("bMonth").value = $("bDate").value.slice(0, 7);

  form.addEventListener("input", updateUrl);
  form.addEventListener("change", updateUrl);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const btn = $("runBtn");
    btn.disabled = true;
    btn.textContent = t("docs.running");
    const { endpoint, query: params } = readForm();
    const result = await execute(endpoint, params);
    renderViewer($("preview"), result, { compact: true, fileName: `${endpoint}.json` });
    btn.disabled = false;
    btn.textContent = t("docs.run");
  });

  $("copyUrl").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(buildUrl().href);
      $("copyUrl").textContent = t("viewer.copied");
    } catch {
      $("copyUrl").textContent = t("viewer.copyFailed");
    }
    setTimeout(() => { $("copyUrl").textContent = t("docs.copyUrl"); }, 1500);
  });
}

function updateUrl() {
  syncVisibility();
  const url = buildUrl().href;
  $("builtUrl").textContent = url;
  $("openLink").href = url;
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
  const params = {};
  const set = (key, value) => { if (value && String(value).trim()) params[key] = String(value).trim(); };

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
  // Deutsch ist Standard – nur andere Sprachen in die URL schreiben
  if (data.get("lang") && data.get("lang") !== "de") set("lang", data.get("lang"));
  return { endpoint, query: params };
}

function buildUrl() {
  const { endpoint, query: params } = readForm();
  const url = new URL(`${endpoint}.html`, window.location.href);
  url.search = new URLSearchParams(params);
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
      const headRow = document.createElement("tr");
      for (const key of ["docs.thParam", "docs.thDesc"]) {
        const th = document.createElement("th");
        th.textContent = t(key);
        headRow.append(th);
      }
      table.createTHead().append(headRow);
      const body = table.createTBody();
      for (const [key, text] of params) {
        const row = body.insertRow();
        const k = document.createElement("code");
        k.textContent = key;
        row.insertCell().append(k);
        row.insertCell().textContent = text;
      }
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
