import { apiBaseUrl } from './config.js';

const getToken = () => localStorage.getItem('token');

export async function apiFetch(path, options = {}) {
  const url = `${apiBaseUrl}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // not JSON (e.g. PDF)
    }
  }

  if (!res.ok) {
    const err = new Error(data?.message || data?.title || res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/** GET with optional query params object */
export function apiGet(path, params) {
  const search = params && Object.keys(params).length
    ? '?' + new URLSearchParams(params).toString()
    : '';
  return apiFetch(path + search);
}

/** POST/PUT/PATCH with JSON body; for PDF use apiFetch directly */
export function apiPost(path, body) {
  return apiFetch(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
}

export function apiPut(path, body) {
  return apiFetch(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined });
}

export function apiDelete(path) {
  return apiFetch(path, { method: 'DELETE' });
}

/** Returns PDF blob for download endpoint */
export async function apiGetBlob(path, params) {
  const search = params && Object.keys(params).length
    ? '?' + new URLSearchParams(params).toString()
    : '';
  const url = `${apiBaseUrl}${path}${search}`;
  const token = getToken();
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text();
    let data = null;
    try { data = JSON.parse(text); } catch {}
    const err = new Error(data?.message || data?.title || res.statusText || 'Download failed');
    err.status = res.status;
    throw err;
  }
  return res.blob();
}
