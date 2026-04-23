const trimTrailingSlash = (value = "") => value.replace(/\/$/, "");

const API_BASE_URL = trimTrailingSlash(import.meta.env.VITE_API_URL || "");
const SOCKET_BASE_URL = trimTrailingSlash(import.meta.env.VITE_SOCKET_URL || API_BASE_URL || window.location.origin);

export const getApiUrl = (path) => (API_BASE_URL ? `${API_BASE_URL}${path}` : path);
export const getSocketUrl = () => SOCKET_BASE_URL;

export const apiFetch = (path, options = {}) => {
	const headers = new Headers(options.headers || {});
	const isJsonBody = options.body && !(options.body instanceof FormData) && !headers.has("Content-Type");

	if (isJsonBody) {
		headers.set("Content-Type", "application/json");
	}

	return fetch(getApiUrl(path), {
		credentials: "include",
		...options,
		headers,
	});
};
