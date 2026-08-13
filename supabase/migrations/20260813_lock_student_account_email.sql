create or replace function private.prevent_student_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is distinct from old.email
    or nullif(new.email_change, '') is not null then
    raise exception 'Email changes are disabled for student accounts';
  end if;

  return new;
end;
$$;

revoke all on function private.prevent_student_email_change() from public, anon, authenticated;

drop trigger if exists prevent_student_email_change on auth.users;
create trigger prevent_student_email_change
  before update of email, email_change on auth.users
  for each row execute function private.prevent_student_email_change();
