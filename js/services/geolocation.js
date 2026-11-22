/**
 * Aktuelle Position des Geräts als Promise<{ lat, lon }>.
 * Fehler haben error.code = "unsupported" | "denied" (Text übersetzt die UI).
 */
export function getCurrentPosition() {
  const fail = (code) => Object.assign(new Error(code), { code });
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(fail("unsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lon: coords.longitude }),
      () => reject(fail("denied")),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}
