// Führt einen Endpunkt aus und verpackt Ergebnis oder Fehler einheitlich.
import { endpoints } from "./endpoints.js";
import { ApiError } from "./params.js";

/** Liefert immer { status, endpoint, data } oder { status, endpoint, error }. */
export async function execute(name, query) {
  try {
    const handler = endpoints[name];
    if (!handler) throw new ApiError(404, "unknown_endpoint", `Unbekannter Endpunkt: ${name}`);
    return { status: 200, endpoint: name, data: await handler(query) };
  } catch (error) {
    if (!(error instanceof ApiError)) console.error(error);
    const apiError = error instanceof ApiError
      ? error
      : new ApiError(500, "internal_error", "Unerwarteter Fehler bei der Berechnung.");
    return {
      status: apiError.status,
      endpoint: name,
      error: { code: apiError.code, message: apiError.message }
    };
  }
}
