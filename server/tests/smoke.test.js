// Minimal integration tests (run with: node server/tests/smoke.test.js)
// Requires server running locally and seeded DB.
import assert from 'assert';

async function main() {
  const base = 'http://localhost:' + (process.env.PORT || 3000) + '/api';
  const j = (r) => r.json();

  // Register or login demo user
  let token;
  try {
    const reg = await fetch(base + '/auth/register', { 
      method:'POST', 
      headers:{'Content-Type':'application/json'}, 
      body: JSON.stringify({ 
        name:'Demo', 
        email:'demo@clickpick.dev', 
        password:'Demo123!' 
      }) });
    const rj = await j(reg);
    token = rj.token;
  } catch {}
  if (!token) {
    const login = await fetch(base + '/auth/login', { 
      method:'POST', 
      headers:{'Content-Type':'application/json'}, 
      body: JSON.stringify({ 
        email:'demo@clickpick.dev', 
        password:'Demo123!' 
      }) });
    const lj = await j(login); token = lj.token;
  }
  assert(token, 'Token must exist');

  // List products
  const products = await (await fetch(base + '/products')).json();
  assert(Array.isArray(products) && products.length > 0, 'Products should list');

  const nonCustom = products.find(p => p.category !== 'custompick');
  const custom = products.find(p => p.category === 'custompick');

  // Add non-custom with customization -> 400
  let bad = await fetch(base + '/cart/items', { 
    method:'POST', 
    headers: { 'Content-Type':'application/json','Authorization':'Bearer ' + token }, 
    body: JSON.stringify({ 
      product_id: nonCustom.id, 
      quantity: 1, 
      customization: { 
        shape:'standard', 
        color:'#3B82F6', 
        text:'X' 
      } 
    })});
  console.log('Non-custom add with customization ->', bad.status);

  // Add custom without customization -> 400
  bad = await fetch(base + '/cart/items', { 
    method:'POST', 
    headers: { 'Content-Type':'application/json','Authorization':'Bearer ' + token }, 
    body: JSON.stringify({ product_id: custom.id, quantity: 1 })});
  console.log('Custom add without customization ->', bad.status);

  // Proper add custom
  let ok = await fetch(base + '/cart/items', { 
    method:'POST', 
    headers: { 'Content-Type':'application/json','Authorization':'Bearer ' + token }, 
    body: JSON.stringify({ product_id: custom.id, quantity: 2, customization: { shape:'standard', color:'#3B82F6', text:'ROCK' } })});
  console.log('Custom add OK ->', ok.status);

  // Checkout
  ok = await fetch(base + '/checkout', { 
    method:'POST', 
    headers: { 'Content-Type':'application/json','Authorization':'Bearer ' + token }, 
    body: JSON.stringify({ email:'demo@clickpick.dev', firstname:'Demo', lastname:'User', company:'-', address:'123', city:'Bangkok', country:'Thailand', postal_code:'10110', phone:'0800000000', order_notes:'-' })});
  const order = await j(ok);
  assert(order.status === 'pending');

  // Payment
  const pay = await fetch(base + '/payment', { 
    method:'POST', 
    headers: { 'Content-Type':'application/json','Authorization':'Bearer ' + token }, 
    body: JSON.stringify({ 
      order_id: order.id, 
      card_number:'4242', 
      name_on_card:'DEMO', 
      exp:'12/29', 
      cvc:'123' 
    })});
  const paid = await j(pay);
  assert(paid.status === 'paid');

  console.log('Integration flow OK');
}

main().catch(e => { console.error(e); process.exit(1); });

