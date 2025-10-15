import { query } from "../db/pool.js";
import { validateCustomization } from "../schemas/validators.js";

const DELIVERY_FEE = 14;
const DISCOUNT = 0;

export async function getPendingOrder(userId) {
  const found = await query(
    "SELECT * FROM orders WHERE user_id=$1 AND status=$2",
    [userId, "pending"]
  );
  if (found.rows[0]) {
    return found.rows[0];
  }
}

export async function getOrCreateDraftOrder(userId) {
  const found = await query(
    "SELECT * FROM orders WHERE user_id=$1 AND status=$2",
    [userId, "draft"]
  );
  if (found.rows[0]) {
    return found.rows[0];
  }
  const { rows } = await query(
    `INSERT INTO orders (user_id, status, total, delivery_fee, discount, billing_detail)
     VALUES ($1,'draft',0,$2,$3,'{}'::jsonb)
     RETURNING *`,
    [userId, DELIVERY_FEE, DISCOUNT]
  );
  return rows[0];
}

export async function getCart(orderId) {
  const { rows } = await query(
    `SELECT oi.*, p.name as product_name, p.image, p.category
     FROM order_items oi JOIN products p ON p.id=oi.product_id
     WHERE oi.order_id=$1`,
    [orderId]
  );
  return rows;
}

export async function addItem(userId, { product_id, quantity, customization }) {
  if (!product_id || !quantity)
    throw new Error("product_id and quantity required");
  const order = await getOrCreateDraftOrder(userId);
  const { rows: prodRows } = await query("SELECT * FROM products WHERE id=$1", [
    product_id,
  ]);
  const product = prodRows[0];
  if (!product) throw new Error("Product not found");
  if (quantity < 1) throw new Error("Invalid quantity");
  if (quantity > product.stock) throw new Error("Quantity exceeds stock");
  if (product.category === "custompick") {
    if (!validateCustomization(customization))
      throw new Error("Invalid customization");
  } else {
    if (customization)
      throw new Error("Customization not allowed for this product");
  }
  const price = product.price;
  const { rows: itemRows } = await query(
    `INSERT INTO order_items (order_id, product_id, quantity, price)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [order.id, product_id, quantity, price]
  );
  const item = itemRows[0];
  if (product.category === "custompick" && customization) {
    const { rows: custRows } = await query(
      `INSERT INTO customization (order_item_id, shape, color, text)
       VALUES ($1,$2,$3,$4) RETURNING id`,
      [item.id, customization.shape, customization.color, customization.text]
    );
    await query("UPDATE order_items SET customization_id=$1 WHERE id=$2", [
      custRows[0].id,
      item.id,
    ]);
  }
  await recomputeTotals(order.id);
  return item;
}

export async function updateItem(userId, itemId, { quantity, customization }) {
  const { rows: itemRows } = await query(
    `SELECT oi.*, p.category, p.stock FROM order_items oi JOIN products p ON p.id=oi.product_id WHERE oi.id=$1`,
    [itemId]
  );
  const item = itemRows[0];
  if (!item) throw new Error("Item not found");
  // Ensure item belongs to user's draft order
  const { rows: orderRows } = await query("SELECT * FROM orders WHERE id=$1", [
    item.order_id,
  ]);
  const order = orderRows[0];
  if (!order || order.status !== "draft") throw new Error("Cannot edit item");

  if (quantity !== undefined) {
    if (quantity < 1) throw new Error("Invalid quantity");
    if (quantity > item.stock) throw new Error("Quantity exceeds stock");
    await query("UPDATE order_items SET quantity=$1 WHERE id=$2", [
      quantity,
      itemId,
    ]);
  }
  if (item.category === "custompick") {
    if (!validateCustomization(customization))
      throw new Error("Invalid customization");
    const { rows: custRows } = await query(
      "SELECT * FROM customization WHERE order_item_id=$1",
      [itemId]
    );
    if (custRows[0]) {
      await query(
        "UPDATE customization SET shape=$1,color=$2,text=$3 WHERE order_item_id=$4",
        [customization.shape, customization.color, customization.text, itemId]
      );
    } else {
      const { rows } = await query(
        "INSERT INTO customization (order_item_id, shape, color, text) VALUES ($1,$2,$3,$4) RETURNING id",
        [itemId, customization.shape, customization.color, customization.text]
      );
      await query("UPDATE order_items SET customization_id=$1 WHERE id=$2", [
        rows[0].id,
        itemId,
      ]);
    }
  } else if (customization) {
    throw new Error("Customization not allowed for this product");
  }
  await recomputeTotals(order.id);
}

export async function deleteItem(userId, itemId) {
  // Ensure belongs to user's draft order
  const { rows: itemRows } = await query(
    "SELECT * FROM order_items WHERE id=$1",
    [itemId]
  );
  const item = itemRows[0];
  if (!item) return;
  const { rows: orderRows } = await query("SELECT * FROM orders WHERE id=$1", [
    item.order_id,
  ]);
  const order = orderRows[0];
  if (!order || order.status !== "draft") throw new Error("Cannot delete item");
  await query("DELETE FROM order_items WHERE id=$1", [itemId]);
  await recomputeTotals(order.id);
}

export async function recomputeTotals(orderId) {
  const { rows } = await query(
    "SELECT quantity, price FROM order_items WHERE order_id=$1",
    [orderId]
  );
  const subtotal = rows.reduce(
    (s, r) => s + Number(r.quantity) * Number(r.price),
    0
  );
  const total = subtotal + DELIVERY_FEE - DISCOUNT;
  await query(
    "UPDATE orders SET total=$1, delivery_fee=$2, discount=$3 WHERE id=$4",
    [total, DELIVERY_FEE, DISCOUNT, orderId]
  );
}

export async function checkout(userId, billing_detail) {
  const order = await getOrCreateDraftOrder(userId);
  console.log(order);
  await recomputeTotals(order.id);
  const { rows } = await query(
    "SELECT COUNT(*)::int as cnt FROM order_items WHERE order_id=$1",
    [order.id]
  );
  if (rows[0].cnt === 0) throw new Error("Cart is empty");
  await query("UPDATE orders SET billing_detail=$1, status=$2 WHERE id=$3", [
    billing_detail,
    "pending",
    order.id,
  ]);
  const { rows: updated } = await query("SELECT * FROM orders WHERE id=$1", [
    order.id,
  ]);
  return updated[0];
}

export async function payment(orderId) {
  // Always success but check stock
  const { rows: orderRows } = await query("SELECT * FROM orders WHERE id=$1", [
    orderId,
  ]);
  const order = orderRows[0];
  if (!order || order.status !== "pending")
    throw new Error("Order not pending");
  const { rows: items } = await query(
    `SELECT oi.*, p.stock FROM order_items oi JOIN products p ON p.id=oi.product_id WHERE oi.order_id=$1`,
    [orderId]
  );
  for (const it of items) {
    if (it.quantity > it.stock) {
      const err = new Error("Insufficient stock");
      err.status = 409;
      throw err;
    }
  }
  // decrement stock
  for (const it of items) {
    await query("UPDATE products SET stock=stock-$1 WHERE id=$2", [
      it.quantity,
      it.product_id,
    ]);
  }
  await query("UPDATE orders SET status=$1 WHERE id=$2", ["paid", orderId]);
  const { rows: updated } = await query("SELECT * FROM orders WHERE id=$1", [
    orderId,
  ]);
  return updated[0];
}

export async function listOrdersForUser(user) {//ไม่ได้ใช้
  if (user.role === "admin") {
    const { rows } = await query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );
    return rows;
  }
  const { rows } = await query(
    "SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC",
    [user.sub]
  );
  return rows;
}

export async function getOrder(user, id) {
  const { rows } = await query("SELECT * FROM orders WHERE id=$1", [id]);
  const order = rows[0];
  if (!order) return null;
  if (user.role !== "admin" && order.user_id !== user.sub) return null;
  return order;
}

export async function markShipped(id) {
  const { rows } = await query(
    "UPDATE orders SET status=$1 WHERE id=$2 RETURNING *",
    ["shipped", id]
  );
  return rows[0];
}

export async function markDelivered(id) {
  const { rows } = await query(
    "UPDATE orders SET status=$1 WHERE id=$2 RETURNING *",
    ["delivered", id]
  );
  return rows[0];
}
