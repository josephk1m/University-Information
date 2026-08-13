create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.student_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text not null unique,
  display_name text not null,
  created_at timestamptz not null default now(),
  constraint student_profiles_username_format
    check (username ~ '^[a-z0-9_]{3,24}$'),
  constraint student_profiles_display_name_length
    check (char_length(display_name) between 2 and 50)
);

alter table public.student_profiles enable row level security;

revoke all on table public.student_profiles from anon;
revoke all on table public.student_profiles from authenticated;
grant select on table public.student_profiles to authenticated;

drop policy if exists "Students can view their own fixed profile" on public.student_profiles;
create policy "Students can view their own fixed profile"
  on public.student_profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create or replace function private.create_student_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_username text;
  new_display_name text;
begin
  new_username := lower(trim(new.raw_user_meta_data ->> 'username'));
  new_display_name := trim(new.raw_user_meta_data ->> 'display_name');

  if new_username is null or new_username !~ '^[a-z0-9_]{3,24}$' then
    raise exception 'A valid username is required';
  end if;

  if new_display_name is null or char_length(new_display_name) not between 2 and 50 then
    raise exception 'A valid display name is required';
  end if;

  insert into public.student_profiles (id, email, username, display_name)
  values (new.id, lower(new.email), new_username, new_display_name);

  return new;
end;
$$;

revoke all on function private.create_student_profile() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_create_student_profile on auth.users;
create trigger on_auth_user_created_create_student_profile
  after insert on auth.users
  for each row execute function private.create_student_profile();
