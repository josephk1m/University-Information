# MechMate

MechMate is a mobile-first course organizer designed for first-year mechanical engineering students. It brings assignments, tests, exams, labs, safety notes, schedules, and important course materials into one focused experience.

## What is included

- A priority-led **Today** dashboard with the next deadline, daily schedule, weekly workload, and pinned lab safety note
- Expandable **Courses** with schedules, rooms, progress, and upcoming work
- An agenda-first **Plan** view for lectures, deadlines, tests, and labs
- Searchable **Materials** with course context and a saved-on-device filter
- Detail sheets containing dates, locations, grade weight, side notes, and preparation checklists
- A quick-add form for assignments, tests, exams, and labs
- Completion, custom-item, and material-saving state stored in the browser
- Responsive layouts for mobile, tablet, and desktop, plus reduced-motion support

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open the local address printed by the development server.

## Verify

```bash
npm run build
npm run lint
npm test
```

## Product notes

The current release is a polished front-end MVP with realistic first-year sample data. Personal changes are saved only in the current browser. Cloud sync, university LMS integration, file uploads, authentication, and real notifications are intentionally left for a later connected-data release.

The primary interface is in `app/page.tsx`; design tokens and responsive styles are in `app/globals.css`.
