-- ==========================================
-- Baby Growth Record - Supabase Migration
-- ==========================================

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
  birthday DATE NOT NULL,
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
-- Row Level Security
-- ==========================================
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE babies ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE poop_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE height_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccine_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- 通用策略：用户只能访问自己家庭的数据
CREATE POLICY "users_can_access_own_family" ON families
  FOR ALL USING (
    id IN (SELECT family_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "members_see_own" ON members
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "family_members_access" ON babies
  FOR ALL USING (
    family_id IN (SELECT family_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "family_data_access" ON feed_records
  FOR ALL USING (
    baby_id IN (
      SELECT b.id FROM babies b
      JOIN members m ON m.family_id = b.family_id
      WHERE m.user_id = auth.uid()
    )
  );

-- 其余表复用同一策略
CREATE POLICY "family_data_access" ON sleep_records
  FOR ALL USING (baby_id IN (
    SELECT b.id FROM babies b JOIN members m ON m.family_id = b.family_id WHERE m.user_id = auth.uid()
  ));

CREATE POLICY "family_data_access" ON poop_records
  FOR ALL USING (baby_id IN (
    SELECT b.id FROM babies b JOIN members m ON m.family_id = b.family_id WHERE m.user_id = auth.uid()
  ));

CREATE POLICY "family_data_access" ON height_records
  FOR ALL USING (baby_id IN (
    SELECT b.id FROM babies b JOIN members m ON m.family_id = b.family_id WHERE m.user_id = auth.uid()
  ));

CREATE POLICY "family_data_access" ON vaccine_records
  FOR ALL USING (baby_id IN (
    SELECT b.id FROM babies b JOIN members m ON m.family_id = b.family_id WHERE m.user_id = auth.uid()
  ));

CREATE POLICY "family_data_access" ON milestones
  FOR ALL USING (baby_id IN (
    SELECT b.id FROM babies b JOIN members m ON m.family_id = b.family_id WHERE m.user_id = auth.uid()
  ));
