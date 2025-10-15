import { auth } from "./api.js";

async function getUser() {
  try {
    return await auth.me();
  } catch {
    return null;
  }
}

function brand() {
  return `
    <div>
      <a href="./" style="display:flex;align-items:center;gap:.5rem;">
        <img src="./images/logo.svg" style="width:2rem;height:2rem;"/>
        <strong style="font-size:2rem;">ClickPick</strong>
      </a>
    </div>`;
}

function whenAuthed(name) {
  return `
    <div style="display:flex;align-items:center;gap:1rem;">
      <a href="./search">Search</a>
      <a href="./contact">Contact</a>
      <a href="./orders">Orders</a>
      <a href="./cart">
        <img src="./images/cart.svg" style="width:1.5rem;height:1.5rem;"/>
      </a>
      <img src="./images/pfp.png" alt="${
        name || "Profile"
      }" style="width:2rem;height:2rem;border-radius:999rem;"/>
      <button id="logoutBtn" class="btn" style="background:#e5e7eb;color:#111;">Logout</button>
    </div>`;
}

function whenGuest() {
  return `
    <div style="display:flex;align-items:center;gap:1rem;">
      <a href="./search">Search</a>
      <a href="./contact">Contact</a>
      <a class="btn" href="./login">Sign In</a>
      <a href="./cart">
        <img src="./images/cart.svg" style="width:1.5rem;height:1.5rem;"/>
      </a>
    </div>`;
}

async function renderHeader() {
  const header = document.querySelector("header");
  if (!header) return;
  const me = await getUser();
  header.innerHTML = brand() + (me ? whenAuthed(me.name) : whenGuest());
  const btn = document.getElementById("logoutBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      localStorage.removeItem("token");
      location.reload();
    });
  }
}

renderHeader();
