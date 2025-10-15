export function validateEmail(email) {
  return typeof email === 'string' && /.+@.+\..+/.test(email);
}

export function validatePassword(pwd) {
  return typeof pwd === 'string' && pwd.length >= 6;
}

export function validateRole(role) {
  return role === 'customer' || role === 'admin';
}

export function validateCustomization(c) {
  if (!c) return false;
  const shapes = ['standard','jazz','triangle'];
  const colors = ['#3B82F6','white'];
  return shapes.includes(c.shape) && colors.includes(c.color) && typeof c.text === 'string' && c.text.length > 0 && c.text.length <= 50;
}

export function normalizeBillingDetail(input) {
  const pick = (v, def = '-') => (typeof v === 'string' && v.trim() !== '' ? v.trim() : def);
  const bd = {
    email: pick(input.email, ''),
    firstname: pick(input.firstname, ''),
    lastname: pick(input.lastname, ''),
    company: pick(input.company, '-'),
    address: pick(input.address, ''),
    city: pick(input.city, ''),
    country: pick(input.country || 'Thailand'),
    postal_code: pick(input.postal_code, ''),
    phone: pick(input.phone, ''),
    order_notes: pick(input.order_notes, '-')
  };
  // required fields must not be empty
  for (const k of ['email','firstname','lastname','address','city','postal_code','phone']) {
    if (!bd[k]) return null;
  }
  return bd;
}
