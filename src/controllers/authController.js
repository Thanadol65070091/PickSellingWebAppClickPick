import { validateEmail, validatePassword } from '../schemas/validators.js';
import { login, me, register } from '../services/authService.js';

export async function postRegister(req, res) {
  const { name, email, password } = req.body || {};
  if (!name || !validateEmail(email) || !validatePassword(password)) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const { id } = await register(name, email, password);
    const { token, user } = await login(email, password);
    res.status(201).json({ token, user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function postLogin(req, res) {
  const { email, password } = req.body || {};
  if (!validateEmail(email) || !validatePassword(password)) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const data = await login(email, password);
    res.json(data);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
}

export async function getMe(req, res) {
  const user = await me(req.user.sub);
  res.json(user);
}
