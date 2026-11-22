// Führt einen Endpunkt aus und verpackt Ergebnis oder Fehler einheitlich.
import { endpoints } from "./endpoints.js";
import { errorMessage, DEFAULT_API_LANGUAGE, API_LANGUAGES } from "./messages.js";
import { ApiError, parseLang } from "./params.js";

/** Liefert immer { status, endpoint, data } oder { status, endpoint, error }. */
export async function execute(name, query) {
  // Für Fehlermeldungen schon vor der Prüfung eine gültige Sprache bestimmen
  const requested = String(query.lang ?? "").toLowerCase();
  let language = API_LANGUAGES.includes(requested) ? requested : DEFAULT_API_LANGUAGE;

  try {
    language = parseLang(query.lang);
    const handler = endpoints[name];
    if (!handler) throw new ApiError(404, "unknown_endpoint", { name });
    return { status: 200, endpoint: name, data: await handler(query, language) };
  } catch (error) {
    if (!(error instanceof ApiError)) console.error(error);
    const apiError = error instanceof ApiError ? error : new ApiError(500, "internal_error");
    return {
      status: apiError.status,
      endpoint: name,
      error: { code: apiError.code, message: errorMessage(language, apiError.code, apiError.vars) }
    };
  }
}
