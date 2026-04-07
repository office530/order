-- ============================================================================
-- Migration 001 — Initial schema for רנובייט office fit-out platform
-- ============================================================================

-- ----------------------------------------------------------------------------
-- לקוחות
-- ----------------------------------------------------------------------------
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text,
  company text,
  email text,
  created_at timestamptz default now()
);

create index if not exists customers_phone_idx on customers (phone);

-- ----------------------------------------------------------------------------
-- חבילות (ESSENTIAL, CLASSIC, PREMIUM, SIGNATURE)
-- ----------------------------------------------------------------------------
create table if not exists packages (
  id text primary key,
  name text not null,
  name_he text not null,
  price_per_sqm integer not null,
  features jsonb not null,
  sort_order integer not null
);

-- ----------------------------------------------------------------------------
-- הזמנות
-- ----------------------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  package_id text references packages(id),
  area_sqm integer not null check (area_sqm > 0),
  location text not null,
  floor integer,
  estimated_price integer not null check (estimated_price >= 0),
  deposit_amount integer default 2000,
  deposit_paid boolean default false,
  payment_id text,
  contract_signed boolean default false,
  status text default 'pending' check (
    status in (
      'pending',
      'paid',
      'contract_sent',
      'contract_signed',
      'meeting_scheduled',
      'active',
      'cancelled',
      'refunded'
    )
  ),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists orders_customer_idx on orders (customer_id);
create index if not exists orders_status_idx on orders (status);

-- ----------------------------------------------------------------------------
-- OTP sessions
-- ----------------------------------------------------------------------------
create table if not exists otp_sessions (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  code text not null,
  expires_at timestamptz not null,
  verified boolean default false,
  attempts integer default 0,
  created_at timestamptz default now()
);

create index if not exists otp_phone_idx on otp_sessions (phone, created_at desc);

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table customers enable row level security;
alter table orders enable row level security;
alter table otp_sessions enable row level security;
-- packages נשאר ציבורי לקריאה

-- ----------------------------------------------------------------------------
-- updated_at trigger
-- ----------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_updated_at on orders;
create trigger orders_updated_at
  before update on orders
  for each row
  execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Seed: 4 חבילות
-- ----------------------------------------------------------------------------
insert into packages (id, name, name_he, price_per_sqm, features, sort_order) values
('signature', 'SIGNATURE', 'סיגנצ׳ר', 5000, '{
  "design": "עיצוב אדריכלי מלא",
  "materials": "חומרים ברמה גבוהה",
  "lighting": "תאורה מעצבת",
  "partition": "חלוקה פנימית מלאה",
  "systems": "מערכות מלאות",
  "warranty": "24 חודש",
  "management": "מנהל פרויקט צמוד"
}', 1),
('premium', 'PREMIUM', 'פרימיום', 4000, '{
  "design": "עיצוב אדריכלי בסיסי",
  "materials": "חומרים ברמה בינונית",
  "lighting": "תאורה מעצבת",
  "partition": "חלוקה פנימית",
  "systems": "מערכות מלאות",
  "warranty": "18 חודש",
  "management": "מנהל פרויקט צמוד"
}', 2),
('classic', 'CLASSIC', 'קלאסיק', 3500, '{
  "design": "תכנון פנימי",
  "materials": "חומרים איכותיים",
  "lighting": "תאורה סטנדרטית",
  "partition": "חלוקה פנימית",
  "systems": "מערכות חלקיות",
  "warranty": "12 חודש",
  "management": "ליווי פרויקט"
}', 3),
('essential', 'ESSENTIAL', 'אסנשיאל', 3000, '{
  "design": "תכנון סטנדרטי",
  "materials": "חומרים סטנדרטיים",
  "lighting": "תאורה בסיסית",
  "partition": "ללא חלוקה",
  "systems": "מערכות בסיסיות",
  "warranty": "12 חודש",
  "management": "ליווי פרויקט"
}', 4)
on conflict (id) do nothing;
