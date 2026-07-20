-- ==========================================
-- Baby Growth Record - Supabase Migration
-- ==========================================

DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS vaccine_records CASCADE;
DROP TABLE IF EXISTS height_records CASCADE;
DROP TABLE IF EXISTS poop_records CASCADE;
DROP TABLE IF EXISTS sleep_records CASCADE;
DROP TABLE IF EXISTS feed_records CASCADE;
DROP TABLE IF EXISTS babies CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS families CASCADE;

-- 1. 家庭表
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 家庭成员表
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(family_id, user_id)
);

-- 3. 宝宝表
CREATE TABLE babies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female')),
  birthday DATE,
  due_date DATE,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 喝奶记录
CREATE TABLE feed_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id UUID NOT NULL REFERENCES babies(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('bottle', 'breast', 'formula')),
  amount_ml NUMERIC(6,1),
  duration_min NUMERIC(5,1),
  side TEXT CHECK (side IN ('left', 'right', 'both', null)),
  burp_min NUMERIC(4,1),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. 睡眠记录
CREATE TABLE sleep_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id UUID NOT NULL REFERENCES babies(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('nap', 'night', 'morning')),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_min NUMERIC(6,1) GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (end_time - start_time)) / 60
  ) STORED,
  wake_count SMALLINT DEFAULT 0,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. 便便记录
CREATE TABLE poop_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id UUID NOT NULL REFERENCES babies(id) ON DELETE CASCADE,
  amount TEXT CHECK (amount IN ('little', 'middle', 'large')),
  color TEXT,
  texture TEXT,
  diaper_changed BOOLEAN DEFAULT true,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. 身高体重记录
CREATE TABLE height_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id UUID NOT NULL REFERENCES babies(id) ON DELETE CASCADE,
  height_cm NUMERIC(5,1),
  weight_kg NUMERIC(5,2),
  head_cm NUMERIC(5,1),
  note TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 8. 疫苗记录
CREATE TABLE vaccine_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id UUID NOT NULL REFERENCES babies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dose TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'booked', 'done', 'skipped', 'overdue')),
  appointment_at TIMESTAMPTZ,
  location TEXT,
  batch_no TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. 接种里程碑 (自动生成模板)
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id UUID NOT NULL REFERENCES babies(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  dose TEXT,
  age_month SMALLINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'booked', 'done', 'skipped')),
  scheduled_date DATE,
  completed_date DATE,
  note TEXT
);

-- ==========================================
-- 索引
-- ==========================================
CREATE INDEX idx_feed_baby_time ON feed_records(baby_id, created_at DESC);
CREATE INDEX idx_sleep_baby_time ON sleep_records(baby_id, start_time DESC);
CREATE INDEX idx_poop_baby_time ON poop_records(baby_id, created_at DESC);
CREATE INDEX idx_height_baby_date ON height_records(baby_id, date DESC);
CREATE INDEX idx_vaccine_baby ON vaccine_records(baby_id, due_date);
CREATE INDEX idx_milestone_baby ON milestones(baby_id, age_month);

-- ==========================================
-- Row Level Security (关闭，个人App不需要)
-- ==========================================
ALTER TABLE families DISABLE ROW LEVEL SECURITY;
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE babies DISABLE ROW LEVEL SECURITY;
ALTER TABLE feed_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE poop_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE height_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE vaccine_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE milestones DISABLE ROW LEVEL SECURITY;
