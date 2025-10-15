import { query } from "../db/pool.js";

export async function listProducts({ q, category, limit = 20, offset = 0 }) {
  const clauses = [];
  const params = [];
  if (q) {
    params.push(`%${q}%`);
    clauses.push(
      `(name ILIKE $${params.length} OR description ILIKE $${params.length})`
    );
  }
  if (category) {
    params.push(category);
    clauses.push(`category = $${params.length}`);
  }
  params.push(limit);
  params.push(offset);
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const { rows } = await query(
    `SELECT * FROM products ${where} ORDER BY name LIMIT $${
      params.length - 1
    } OFFSET $${params.length}`,
    params
  );
  return rows;
}

export async function getProduct(id) {
  const { rows } = await query("SELECT * FROM products WHERE id=$1", [id]);
  return rows[0] || null;
}

export async function createProduct(p) {
  const { rows } = await query(
    `INSERT INTO products (name, description, price, stock, image, category)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [p.name, p.description, p.price, p.stock, p.image, p.category]
  );
  return rows[0];
}

export async function updateProduct(id, p) {
  const { rows } = await query(
    `UPDATE products SET name=$1, description=$2, price=$3, stock=$4, image=$5, category=$6 WHERE id=$7 RETURNING *`,
    [p.name, p.description, p.price, p.stock, p.image, p.category, id]
  );
  return rows[0] || null;
}

export async function deleteProduct(id) {
  await query("DELETE FROM products WHERE id=$1", [id]);
}
