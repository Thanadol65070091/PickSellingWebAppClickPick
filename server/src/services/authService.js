import { query } from '../db/pool.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function register(name, email, password, role = 'customer') {
  const hash = await bcrypt.hash(password, 12);
  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4)
     ON CONFLICT (email) DO NOTHING
     RETURNING id`, [name, email, hash, role]
  );
  if (rows.length === 0) throw new Error('Email already exists');
  return rows[0];
}

export async function login(email, password) {
  const { rows } = await query('SELECT * FROM users WHERE email=$1', [email]);
  const user = rows[0];
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new Error('Invalid credentials');
  const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '7d' });
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

export async function me(userId) {
  const { rows } = await query('SELECT id,name,email,role,created_at FROM users WHERE id=$1', [userId]);
  return rows[0] || null;
}
