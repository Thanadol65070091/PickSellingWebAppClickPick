import { normalizeBillingDetail } from "../schemas/validators.js";
import {
  addItem,
  deleteItem,
  getCart,
  getOrCreateDraftOrder,
  getPendingOrder,
  recomputeTotals,
  updateItem,
} from "../services/orderService.js";

export async function getCartDraft(req, res) {
  const order = await getOrCreateDraftOrder(req.user.sub);
  const items = await getCart(order.id);
  res.json({ order, items });
}

export async function getCartPending(req, res) {
  const order = await getPendingOrder(req.user.sub);
  const items = await getCart(order.it);
  res.json({ order, items });
}

export async function addCartItem(req, res) {
  try {
    const item = await addItem(req.user.sub, req.body || {});
    const order = await getOrCreateDraftOrder(req.user.sub);
    const items = await getCart(order.id);
    res.status(201).json({ order, items, item });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function updateCartItem(req, res) {
  try {
    await updateItem(req.user.sub, req.params.itemId, req.body || {});
    const order = await getOrCreateDraftOrder(req.user.sub);
    const items = await getCart(order.id);
    res.json({ order, items });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function deleteCartItem(req, res) {
  try {
    await deleteItem(req.user.sub, req.params.itemId);
    const order = await getOrCreateDraftOrder(req.user.sub);
    const items = await getCart(order.id);
    res.json({ order, items });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function recalc(req, res) {
  const order = await getOrCreateDraftOrder(req.user.sub);
  await recomputeTotals(order.id);
  const items = await getCart(order.id);
  res.json({ order, items });
}

export async function postCheckout(req, res) {
  const bd = normalizeBillingDetail(req.body || {});
  if (!bd) {
    return res.status(400).json({ error: "Invalid billing detail" });
  }

  const { checkout } = await import("../services/orderService.js");
  const updated = await checkout(req.user.sub, bd);
  console.log(updated);
  res.json(updated);
}
