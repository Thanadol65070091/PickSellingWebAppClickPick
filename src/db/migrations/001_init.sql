-- PostgreSQL schema for ClickPick
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('customer','admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  stock integer NOT NULL CHECK (stock >= 0),
  image text NOT NULL,
  category text NOT NULL CHECK (category IN ('preset','gadget','custompick'))
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  status text NOT NULL CHECK (status IN ('draft','pending','paid','shipped','delivered')),
  total numeric(10,2) NOT NULL CHECK (total >= 0),
  delivery_fee numeric(10,2) NOT NULL DEFAULT 14,
  discount numeric(10,2) NOT NULL DEFAULT 0,
  billing_detail jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity >= 1),
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  customization_id uuid NULL
);

CREATE TABLE IF NOT EXISTS customization (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid UNIQUE NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  shape text NOT NULL CHECK (shape IN ('standard','jazz','triangle')),
  color text NOT NULL,
  text text NOT NULL
);

-- Optional: enforce color allowed values via CHECK
ALTER TABLE customization
  ADD CONSTRAINT customization_color_check CHECK (color IN ('#3B82F6','white'));

-- Optional trigger to ensure customization exists only if product category = 'custompick'
CREATE OR REPLACE FUNCTION ensure_customization_rule() RETURNS trigger AS $$
DECLARE prod_cat text;
BEGIN
  IF NEW.customization_id IS NULL THEN
    RETURN NEW;
  END IF;
  SELECT category INTO prod_cat FROM products WHERE id = NEW.product_id;
  IF prod_cat <> 'custompick' THEN
    RAISE EXCEPTION 'Customization only allowed for custompick products';
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_customization_rule ON order_items;
CREATE CONSTRAINT TRIGGER trg_customization_rule
AFTER INSERT OR UPDATE ON order_items
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION ensure_customization_rule();

