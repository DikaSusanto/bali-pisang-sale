const IDLE_TIMEOUT_MINUTES = 30;
const LAST_ACTIVITY_KEY = "lastActivity";

export function updateLastActivity() {
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
}

export function getLastActivity() {
  const ts = localStorage.getItem(LAST_ACTIVITY_KEY);
  return ts ? parseInt(ts, 10) : null;
}

export function isIdleTimeoutExceeded() {
  const last = getLastActivity();
  if (!last) return false;
  const now = Date.now();
  return now - last > IDLE_TIMEOUT_MINUTES * 60 * 1000;
}

export function clearLastActivity() {
  localStorage.removeItem(LAST_ACTIVITY_KEY);
}