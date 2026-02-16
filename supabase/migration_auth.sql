-- Migration: Add auth fields to customers table
-- Run this in Supabase SQL Editor

ALTER TABLE customers ADD COLUMN IF NOT EXISTS auth_user_id uuid UNIQUE REFERENCES auth.users(id);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_name text DEFAULT '';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_address text DEFAULT '';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS shipping_address text DEFAULT '';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS shipping_same_as_billing boolean DEFAULT true;
CREATE INDEX IF NOT EXISTS idx_customers_auth_user_id ON customers(auth_user_id);
