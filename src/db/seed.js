import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcrypt';

dotenv.config();
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Seeding users and products...');
    const adminPass = await bcrypt.hash('Admin123!', 12);
    const demoPass = await bcrypt.hash('Demo123!', 12);

    // Upsert users by email
    await client.query(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES ('Admin', 'admin@clickpick.dev', $1, 'admin')
      ON CONFLICT (email) DO UPDATE SET role='admin';
    `, [adminPass]);

    await client.query(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES ('Demo User', 'demo@clickpick.dev', $1, 'customer')
      ON CONFLICT (email) DO NOTHING;
    `, [demoPass]);

    const products = [
      // 3 preset
      ['Classic Thin', 'A classic thin pick', 20.00, 200, 'public/products/preset-classic-thin.jpg', 'preset'],
      ['Classic Medium', 'A classic medium pick', 25.00, 150, 'public/products/preset-classic-medium.jpg', 'preset'],
      ['Classic Heavy', 'A classic heavy pick', 30.00, 100, 'public/products/preset-classic-heavy.jpg', 'preset'],
      // 2 gadgets
      ['Pick Holder', 'Handy pick holder gadget', 120.00, 50, 'public/products/gadget-holder.jpg', 'gadget'],
      ['String Winder', 'Quickly wind strings', 180.00, 40, 'public/products/gadget-winder.jpg', 'gadget'],
      // 2 custompick base
      ['CustomPick Base A', 'Customize your own pick', 50.00, 500, 'public/products/custom-base-a.jpg', 'custompick'],
      ['CustomPick Base B', 'Customize your own pick', 60.00, 500, 'public/products/custom-base-b.jpg', 'custompick']
    ];

    for (const p of products) {
      await client.query(
        `INSERT INTO products (name, description, price, stock, image, category)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT DO NOTHING`, p
      );
    }

    console.log('Seeding complete');
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

