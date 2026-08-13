create table public.student_courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_key text,
  code text not null check (char_length(code) between 1 and 24),
  name text not null check (char_length(name) between 1 and 120),
  short_name text not null check (char_length(short_name) between 1 and 60),
  description text not null default '' check (char_length(description) <= 600),
  instructor text not null default '' check (char_length(instructor) <= 100),
  tone text not null default 'blue' check (tone in ('blue', 'purple', 'orange', 'teal', 'red', 'yellow')),
  icon_key text not null default 'book' check (icon_key in ('wrench', 'box', 'target', 'atom', 'flask', 'layers', 'book', 'calculator')),
  progress smallint not null default 0 check (progress between 0 and 100),
  schedule text not null default '' check (char_length(schedule) <= 120),
  room text not null default '' check (char_length(room) <= 120),
  next_milestone text not null default '' check (char_length(next_milestone) <= 160),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, code),
  unique (user_id, template_key)
);

alter table public.student_courses enable row level security;

revoke all on table public.student_courses from anon, authenticated;
grant select, insert, update, delete on table public.student_courses to authenticated;

create policy "Students can read their own courses"
  on public.student_courses
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Students can add their own courses"
  on public.student_courses
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Students can update their own courses"
  on public.student_courses
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Students can delete their own courses"
  on public.student_courses
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create index student_courses_user_sort_idx
  on public.student_courses (user_id, sort_order, created_at);
