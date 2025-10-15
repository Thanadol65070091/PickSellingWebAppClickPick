const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function setToken(tok) {
  if (tok) localStorage.setItem('token', tok);
}

async function api(path, opts = {}) {
  const headers = opts.headers || {};
  headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch('http://localhost:3000/api' + path, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API error');
  }
  return res.json();
}

export const auth = {
  async register(name, email, password) {
    const data = await api('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
    setToken(data.token); return data;
  },
  async login(email, password) {
    const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    setToken(data.token); return data;
  },
  async me() { return api('/auth/me'); }
};

export const products = {
  list(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return api('/products' + (qs ? ('?' + qs) : ''));
  },
  get(id) { return api('/products/' + id); }
};

export const cart = {
  get() { return api('/cart'); },
  add(item) { return api('/cart/items', { method:'POST', body: JSON.stringify(item) }); },
  update(itemId, payload) { return api('/cart/items/' + itemId, { method:'PUT', body: JSON.stringify(payload) }); },
  remove(itemId) { return api('/cart/items/' + itemId, { method:'DELETE' }); },
  recalc() { return api('/cart/recalculate', { method:'POST' }); },
  checkout(billing) { return api('/checkout', { method:'POST', body: JSON.stringify(billing) }); }
};

export const orders = {
  list() { return api('/orders'); },
  get(id) { return api('/orders/' + id); },
  pay(order_id, card) { return api('/payment', { method:'POST', body: JSON.stringify({ order_id, ...card }) }); }
};

