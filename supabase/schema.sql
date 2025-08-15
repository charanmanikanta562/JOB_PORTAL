-- Supabase schema for Job Portal
-- A 'profiles' table to store user-specific information.
create table if not exists profiles (
  id text primary key,
  email text,
  role text check (role in ('employer','candidate')),
  full_name text,
  company_name text,
  created_at timestamp with time zone default now()
);

-- A 'jobs' table to store job listings.
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text not null,
  type text not null,
  salary_min numeric,
  salary_max numeric,
  description text,
  status text not null default 'active' check (status in ('active', 'draft', 'closed', 'archived')),
  posted_by text references profiles(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- An 'applications' table to store job applications.
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete cascade,
  user_id text references profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'interview', 'rejected', 'hired')),
  cover_letter text,
  created_at timestamp with time zone default now()
);

-- A new 'bookmarks' table to store saved jobs for candidates.
create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id text references profiles(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique (user_id, job_id)
);


-- Convenience view for joining (optional)
create or replace view applications_with_job as
  select a.*, j.title as job_title, j.company as job_company, j.location as job_location
  from applications a
  left join jobs j on j.id = a.job_id;

-- Sample jobs (generic)
insert into jobs (title, company, location, type, salary_min, salary_max, description)
values
('Software Engineer', 'Acme Corp', 'Remote', 'Full-time', 8, 16, 'Work on a modern web stack. Collaborate with a cross-functional team.'),
('Product Manager', 'Globex', 'Hybrid - London', 'Full-time', 12, 24, 'Own product roadmap, collaborate with engineering and design.'),
('Data Analyst', 'Initech', 'Onsite - Berlin', 'Contract', 6, 12, 'Analyze datasets, create dashboards, and support business decisions.'),
('Frontend Intern', 'Umbrella Labs', 'Remote', 'Internship', 2, 4, 'Assist in building UI components and fixing bugs.');


---------------------------------------------------

-- Indexes for performance
-- These improve the speed of common queries used in your application.
create index if not exists jobs_posted_by_idx on jobs (posted_by);
create index if not exists jobs_title_idx on jobs (title);
create index if not exists jobs_company_idx on jobs (company);
create index if not exists jobs_location_idx on jobs (location);
create index if not exists jobs_type_idx on jobs (type);
create index if not exists jobs_created_at_idx on jobs (created_at desc);

create index if not exists applications_job_id_idx on applications (job_id);
create index if not exists applications_user_id_idx on applications (user_id);
create index if not exists applications_created_at_idx on applications (created_at desc);