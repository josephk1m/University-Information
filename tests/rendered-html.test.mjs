import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the MechMate organizer", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>MechMate/);
  assert.match(html, /Checking your session/);
  assert.match(html, /MECH/);
  assert.match(html, /MATE/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/);
});

test("ships secure account access and user-owned courses without starter preview assets", async () => {
  const [page, layout, packageJson, authScreen, migration, emailLockMigration, coursesMigration, courseEditor, courseModel] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../components/auth-screen.tsx", import.meta.url), "utf8"),
    readFile(new URL("../supabase/migrations/20260813_create_immutable_student_profiles.sql", import.meta.url), "utf8"),
    readFile(new URL("../supabase/migrations/20260813_lock_student_account_email.sql", import.meta.url), "utf8"),
    readFile(new URL("../supabase/migrations/20260813031142_add_student_courses.sql", import.meta.url), "utf8"),
    readFile(new URL("../components/course-editor-sheet.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/courses.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /mechmate-state-v1/);
  assert.match(page, /student_profiles/);
  assert.match(page, /signOut/);
  assert.match(page, /from\("student_courses"\)/);
  assert.match(page, /saveCourse/);
  assert.match(page, /deleteCourse/);
  assert.match(page, /aria-label="Primary navigation"/);
  assert.match(courseModel, /Physics Laboratory I/);
  assert.match(layout, /First-year engineering organizer/);
  assert.match(packageJson, /"lucide-react"/);
  assert.match(packageJson, /"@supabase\/ssr"/);
  assert.match(authScreen, /signInWithPassword/);
  assert.match(authScreen, /signUp/);
  assert.doesNotMatch(authScreen, /updateUser/);
  assert.match(migration, /enable row level security/i);
  assert.match(migration, /grant select on table public\.student_profiles to authenticated/i);
  assert.doesNotMatch(migration, /grant (insert|update|delete)/i);
  assert.match(emailLockMigration, /before update of email, email_change on auth\.users/i);
  assert.match(coursesMigration, /create table public\.student_courses/i);
  assert.match(coursesMigration, /enable row level security/i);
  assert.match(coursesMigration, /grant select, insert, update, delete on table public\.student_courses to authenticated/i);
  assert.match(coursesMigration, /for delete[\s\S]*auth\.uid\(\)/i);
  assert.match(courseEditor, /Add a course/);
  assert.match(courseEditor, /Save course changes/);
  assert.match(courseEditor, /Remove course/);
  assert.match(courseEditor, /Course information/);
  assert.match(courseModel, /templateKey/);
  assert.match(courseModel, /courseDraftToRow/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
  await assert.rejects(access(new URL("../app/_sites-preview/preview.css", import.meta.url)));
});
