-- Supabase / Postgres seed for development (packages + events + users)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  user_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  status TEXT,
  service TEXT,
  weight TEXT,
  dimensions TEXT,
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  actual_delivery TIMESTAMP WITH TIME ZONE,
  cost NUMERIC,
  sender JSONB,
  recipient JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS package_events (
  id SERIAL PRIMARY KEY,
  package_id TEXT REFERENCES packages(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE,
  status TEXT,
  location TEXT,
  description TEXT
);

-- Users
INSERT INTO users (id, email, password, name, user_type, created_at, last_login)
VALUES
  ('1', 'demo@swiftcourier.com', 'demo123', 'Demo User', 'demo', '2024-01-01T00:00:00Z', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, password, name, user_type, created_at, last_login)
VALUES
  ('2', 'admin@swiftcourier.com', 'admin123', 'Admin User', 'existing', '2023-01-01T00:00:00Z', now())
ON CONFLICT (id) DO NOTHING;

-- Packages
INSERT INTO packages (id, tracking_number, status, service, weight, dimensions, estimated_delivery, actual_delivery, cost, sender, recipient, created_at, updated_at)
VALUES
  ('pkg_001', 'SC1234567890', 'in_transit', 'Express Delivery', '2.5 lbs', '12x8x4 inches', '2024-12-25T15:00:00Z', NULL, 24.99,
   '{"name":"John Smith","address":"123 Main St","city":"New York","state":"NY","zip":"10001"}',
   '{"name":"Jane Doe","address":"456 Oak Ave","city":"Los Angeles","state":"CA","zip":"90210"}',
   '2024-12-20T10:00:00Z', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO packages (id, tracking_number, status, service, weight, dimensions, estimated_delivery, actual_delivery, cost, sender, recipient, created_at, updated_at)
VALUES
  ('pkg_002', 'SC0987654321', 'delivered', 'Standard Delivery', '1.2 lbs', '8x6x2 inches', '2024-12-22T12:00:00Z', '2024-12-22T11:45:00Z', 12.99,
   '{"name":"Alice Johnson","address":"789 Pine St","city":"Seattle","state":"WA","zip":"98101"}',
   '{"name":"Bob Wilson","address":"321 Elm St","city":"Portland","state":"OR","zip":"97201"}',
   '2024-12-19T09:00:00Z', '2024-12-22T11:45:00Z')
ON CONFLICT (id) DO NOTHING;

-- Package events for pkg_001
INSERT INTO package_events (package_id, timestamp, status, location, description)
VALUES
  ('pkg_001', '2024-12-20T10:00:00Z', 'Package Created', 'New York, NY', 'Package information received'),
  ('pkg_001', '2024-12-20T14:30:00Z', 'Picked Up', 'New York, NY', 'Package picked up by courier'),
  ('pkg_001', '2024-12-21T08:15:00Z', 'In Transit', 'Chicago, IL', 'Package in transit to destination'),
  ('pkg_001', now(), 'Out for Delivery', 'Los Angeles, CA', 'Package out for delivery');

-- Package events for pkg_002
INSERT INTO package_events (package_id, timestamp, status, location, description)
VALUES
  ('pkg_002', '2024-12-19T09:00:00Z', 'Package Created', 'Seattle, WA', 'Package information received'),
  ('pkg_002', '2024-12-19T15:20:00Z', 'Picked Up', 'Seattle, WA', 'Package picked up by courier'),
  ('pkg_002', '2024-12-20T10:30:00Z', 'In Transit', 'Seattle, WA', 'Package in transit to destination'),
  ('pkg_002', '2024-12-22T08:00:00Z', 'Out for Delivery', 'Portland, OR', 'Package out for delivery'),
  ('pkg_002', '2024-12-22T11:45:00Z', 'Delivered', 'Portland, OR', 'Package delivered successfully');

-- Done
