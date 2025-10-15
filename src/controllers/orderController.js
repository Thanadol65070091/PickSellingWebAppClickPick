import { getOrder, listOrdersForUser, markDelivered, markShipped, payment } from '../services/orderService.js';

export async function list(req, res) {
  const data = await listOrdersForUser(req.user);
  res.json(data);
}

export async function getOne(req, res) {
  const order = await getOrder(req.user, req.params.id);
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
}

export async function postPayment(req, res) {
  const { order_id } = req.body || {};
  if (!order_id) return res.status(400).json({ error: 'order_id required' });
  try {
    const paid = await payment(order_id);
    res.json(paid);
  } catch (e) {
    const status = e.status || 400;
    res.status(status).json({ error: e.message });
  }
}

export async function ship(req, res) {
  const updated = await markShipped(req.params.id);
  res.json(updated);
}

export async function deliver(req, res) {
  const updated = await markDelivered(req.params.id);
  res.json(updated);
}
