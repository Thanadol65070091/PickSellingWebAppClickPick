import * as products from '../services/productService.js';

export async function list(req, res) {
  const { q, category, limit, offset } = req.query;
  const data = await products.listProducts({ q, category, limit: Number(limit)||20, offset: Number(offset)||0 });
  res.json(data);
}

export async function get(req, res) {
  const prod = await products.getProduct(req.params.id);
  if (!prod) return res.status(404).json({ error: 'Not found' });
  res.json(prod);
}

export async function create(req, res) {
  const p = req.body || {};
  const required = ['name','description','price','stock','image','category'];
  for (const k of required) if (p[k] === undefined) return res.status(400).json({ error: `Missing ${k}` });
  const created = await products.createProduct(p);
  res.status(201).json(created);
}

export async function update(req, res) {
  const updated = await products.updateProduct(req.params.id, req.body || {});
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
}

export async function remove(req, res) {
  await products.deleteProduct(req.params.id);
  res.status(204).end();
}
