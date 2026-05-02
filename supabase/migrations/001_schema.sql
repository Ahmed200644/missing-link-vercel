-- ============================================================
-- Missing Link — Full Schema Migration
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CUSTOM ENUM TYPES
-- ============================================================

CREATE TYPE user_role         AS ENUM ('user', 'admin');
CREATE TYPE opportunity_type  AS ENUM ('job', 'internship', 'training', 'competition', 'youth_event');
CREATE TYPE organization_type AS ENUM ('company', 'ngo', 'university', 'government', 'startup');
CREATE TYPE mode_type         AS ENUM ('online', 'onsite', 'hybrid');
CREATE TYPE job_time_type     AS ENUM ('part-time', 'full-time');

-- ============================================================
-- TABLES
-- ============================================================

-- profiles: extends auth.users
CREATE TABLE profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name   TEXT         NOT NULL,
  role        user_role    NOT NULL DEFAULT 'user',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- opportunities: core entity
CREATE TABLE opportunities (
  id                UUID             PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             TEXT             NOT NULL,
  description       TEXT             NOT NULL,
  opportunity_type  opportunity_type NOT NULL,
  organization_type organization_type NOT NULL,
  field             TEXT,
  country           TEXT,
  mode              mode_type        NOT NULL,
  job_time          job_time_type,
  is_paid           BOOLEAN          NOT NULL DEFAULT FALSE,
  organization      TEXT             NOT NULL,
  deadline          DATE,
  external_link     TEXT,
  is_featured       BOOLEAN          NOT NULL DEFAULT FALSE,
  is_active         BOOLEAN          NOT NULL DEFAULT TRUE,
  created_by        UUID             REFERENCES profiles(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- saved_opportunities: user bookmarks
CREATE TABLE saved_opportunities (
  id              UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID         NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  opportunity_id  UUID         NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at on opportunities
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile row after auth.users insert
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities        ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_opportunities  ENABLE ROW LEVEL SECURITY;

-- ---------- profiles ----------

-- Users can read their own profile
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "profiles_select_admin"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "profiles_update_admin"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ---------- opportunities ----------

-- Public: anyone can read active opportunities
CREATE POLICY "opportunities_select_active"
  ON opportunities FOR SELECT
  USING (is_active = TRUE);

-- Admins can read ALL opportunities (including inactive)
CREATE POLICY "opportunities_select_admin"
  ON opportunities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Admins can insert
CREATE POLICY "opportunities_insert_admin"
  ON opportunities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Admins can update
CREATE POLICY "opportunities_update_admin"
  ON opportunities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Admins can delete
CREATE POLICY "opportunities_delete_admin"
  ON opportunities FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ---------- saved_opportunities ----------

-- Users can view their own saved items
CREATE POLICY "saved_select_own"
  ON saved_opportunities FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can save
CREATE POLICY "saved_insert_own"
  ON saved_opportunities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their own saves
CREATE POLICY "saved_delete_own"
  ON saved_opportunities FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- USEFUL INDEXES
-- ============================================================

CREATE INDEX idx_opportunities_type     ON opportunities(opportunity_type);
CREATE INDEX idx_opportunities_active   ON opportunities(is_active);
CREATE INDEX idx_opportunities_featured ON opportunities(is_featured);
CREATE INDEX idx_opportunities_country  ON opportunities(country);
CREATE INDEX idx_opportunities_mode     ON opportunities(mode);
CREATE INDEX idx_saved_user             ON saved_opportunities(user_id);
CREATE INDEX idx_saved_opportunity      ON saved_opportunities(opportunity_id);
