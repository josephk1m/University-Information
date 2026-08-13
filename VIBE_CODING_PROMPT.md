# Vibe Coding Prompt: University Class Command Center

Copy everything under **Prompt to give the coding agent** into your preferred AI coding tool. The prompt is deliberately specific so the agent can make sensible decisions without repeatedly asking for clarification.

---

## Prompt to give the coding agent

You are a senior product designer and front-end engineer. Build a polished, responsive web app called **ClassFlow** that helps a university student understand everything happening in one class from a single dashboard.

The finished product must feel calm, highly legible, trustworthy, and immediately useful. It must not look like a generic admin template. The main experience is a **single-screen class command center** where the student can simultaneously see:

1. Assignment details
2. Quiz details
3. Final exam details
4. Practical/lab details
5. Social event outlines
6. The full class curriculum

On a desktop viewport of **1440 × 900**, all six categories must be visible without navigating to another page. Some individual cards may contain an internal scroll area or an expand control, but the category headings, statuses, and next important item in every category must be visible at the same time. On tablets and phones, preserve the same information hierarchy in a responsive stacked layout; vertical page scrolling is acceptable on these smaller devices.

Do not stop after creating a wireframe. Implement a working, refined interface with realistic sample data, useful interactions, responsive behavior, accessibility, empty states, and lightweight persistence.

### 1. Product goal

Design the app so a student can answer these questions in under five seconds:

- What is due next?
- What should I work on today?
- How much of the class have I completed?
- When are the next quiz, practical, final exam, and social event?
- What topic is being taught now, and what comes next?
- Which items are urgent, completed, or at risk?

The dashboard should reduce anxiety by showing priority and progress clearly. Avoid visual noise, excessive gradients, decorative charts without purpose, tiny text, crowded tables, and hidden information.

### 2. Default technical stack

If the repository is empty, initialize the app with:

- Vite
- React
- TypeScript with strict mode enabled
- Tailwind CSS
- Lucide React icons
- date-fns for date formatting and relative dates
- Vitest and React Testing Library for focused component tests

If an existing compatible React project is present, preserve its structure and dependencies instead of replacing it. Do not add a backend, authentication, database, or paid service for the first version. Store editable demo-state changes in `localStorage` through a small typed storage utility. Keep the data model ready to replace with an API later.

Use semantic HTML and reusable components. Do not place the entire application in one component. Avoid unnecessary state-management packages; React state and context are enough for this scope.

### 3. Visual direction

Create a modern academic interface with a warm, focused personality.

Use this visual system:

- Overall background: soft cool gray, approximately `#F5F7FB`
- Primary text: deep navy, approximately `#172033`
- Secondary text: slate, approximately `#667085`
- Primary accent: university blue, approximately `#3157D5`
- Secondary accent: teal, approximately `#159A9C`
- Warning: amber, approximately `#D97706`
- Danger/overdue: red, approximately `#D64545`
- Success/completed: green, approximately `#2E8B57`
- Card background: white with a subtle cool border
- Border radius: 14–18px for main cards, 10–12px for compact items
- Shadows: very subtle; use borders and spacing before shadows
- Typography: use a clean system or bundled sans-serif stack; do not depend on a remote font

The visual hierarchy should be driven by typography, spacing, status color, and alignment. Color must never be the only way status is communicated; pair it with text and/or an icon.

Use an 8px spacing system. Keep the desktop layout compact enough to meet the single-screen requirement without sacrificing readability. Minimum normal body text size is 14px on desktop and 15–16px on mobile. Avoid text smaller than 12px.

### 4. Desktop information architecture

Build one application route and one primary dashboard. At 1440 × 900, use the following composition:

#### A. Slim top header: approximately 64–72px tall

The header contains:

- ClassFlow wordmark on the left
- A compact course selector showing course code and name, for example `CS 301 · Human–Computer Interaction`
- Current semester label: `Fall 2026`
- A small overall progress summary: `62% complete`
- Search button with keyboard shortcut hint `/`
- Notification button with unread count
- Student avatar/menu on the right

Keep the header on one line on desktop. It may become a two-row compact header or simplified toolbar on mobile.

#### B. Dashboard summary strip: approximately 90–110px tall

Directly below the header, show four compact summary cards:

1. **Next deadline** — item name, due date, and relative time
2. **This week** — number of classes/tasks/events
3. **Current topic** — current curriculum week and topic
4. **At risk** — overdue or low-confidence item count

Each card must have a meaningful icon, one strong value, one short supporting line, and an optional compact trend/status label. Clicking a summary card should focus or scroll to the related dashboard panel.

#### C. Main dashboard grid: fills the remaining desktop height

Use a responsive 12-column grid. The recommended desktop arrangement is:

- Left column, 4 grid columns wide:
  - **Assignments** panel, taking about 58% of the available column height
  - **Quizzes** panel, taking about 42%
- Center column, 5 grid columns wide:
  - **Curriculum timeline** panel, full available height
- Right column, 3 grid columns wide:
  - **Final exam** panel
  - **Practical/lab** panel
  - **Social events** panel

Every panel heading must remain visible. The first actionable or upcoming item in every panel must remain visible at 1440 × 900. Use compact internal scrolling only for long item lists. Use a faint edge fade or other affordance to make internal scrolling discoverable. Do not create nested scrolling on mobile.

### 5. Shared panel anatomy

Every category panel should have:

- An icon and clear title
- A compact count or completion indicator
- An optional `View all` or expand button
- A concise status summary
- One or more item rows/cards
- A useful empty state when no data exists

An item row should communicate, where relevant:

- Title
- Type/category
- Date and time
- Relative date, such as `Due in 2 days`
- Status: `Not started`, `In progress`, `Submitted`, `Graded`, `Upcoming`, `Completed`, or `Overdue`
- Weight or points
- Progress
- Location or submission method
- One clear next action

Use tooltips for icon-only buttons. Do not hide critical details exclusively inside tooltips.

### 6. Assignments panel

Show a prioritized list sorted by urgency, not alphabetically. Each assignment item includes:

- Assignment title
- Due date and time
- Weight or points
- Status badge
- Progress bar or checklist completion when in progress
- Submission type, such as `LMS upload`, `Git repository`, or `In class`
- `Open details` action

The most urgent assignment should have a subtle tinted background and a visible `Next` label. Overdue items must show an overdue label and remain distinct from simply upcoming items.

Use sample assignments:

- `Usability Heuristic Evaluation` — due Sep 18 at 11:59 PM — 15% — in progress — 60%
- `Team Prototype` — due Oct 2 at 5:00 PM — 20% — not started
- `Research Reflection` — due Oct 11 at 11:59 PM — 10% — not started
- `Contextual Inquiry Notes` — submitted — graded 18/20

### 7. Quizzes panel

Show the next quiz prominently and recent quiz performance in a compact form. Include:

- Quiz title/number
- Topics covered
- Date, start time, and duration
- Attempt count
- Format, such as `Online · open notes`
- Points or percentage weight
- Availability status
- `Review topics` or `Start quiz` action depending on status

Use sample quizzes:

- `Quiz 3 · Interaction Design Principles` — Sep 22 at 9:00 AM — 20 minutes — 10 points — upcoming
- `Quiz 2 · User Research` — completed — 8/10

Do not show a `Start quiz` button before the quiz availability window. In that case, show a disabled button with a short explanation.

### 8. Curriculum timeline panel

This is the visual anchor of the page. Show a vertically scrollable 12-week curriculum timeline with:

- Week number
- Date range
- Topic title
- One-line learning objective
- Status: completed, current, or upcoming
- Optional linked items such as an assignment, quiz, practical, or reading

The current week must be visually obvious with a blue accent, `Current week` label, and a slightly expanded row. Completed weeks use check icons. Upcoming weeks use neutral markers. A thin vertical line connects weeks.

Use the following sample curriculum:

1. Foundations of HCI
2. Human capabilities and cognition
3. User research methods
4. Personas and journey mapping
5. Interaction design principles
6. Information architecture
7. Prototyping fundamentals
8. Usability evaluation
9. Accessibility and inclusive design
10. Design systems
11. Emerging interfaces
12. Final project presentations

Set Week 5 as the current week in the default demo. Provide compact filter chips above the timeline: `All`, `Current`, `Assessments`, and `Completed`. Filtering must not make the dashboard height jump significantly.

### 9. Final exam panel

Treat the final exam as a high-importance information card, but do not make it alarming. Show:

- Date and time
- Countdown in days
- Location
- Duration
- Format
- Weight
- Topics covered or coverage range
- Permitted materials
- Preparation progress
- `View study plan` action

Use sample data:

- Dec 15, 2026, 1:30–3:30 PM
- Engineering Hall, Room 204
- 2 hours
- Written + short design critique
- 30% of final grade
- Covers Weeks 1–11
- One double-sided notes sheet permitted
- Study preparation: 35%

### 10. Practical/lab panel

Show the next hands-on session and what the student needs to prepare:

- Practical title
- Date and time
- Lab/studio location
- Team or individual format
- Required preparation
- Required materials/software
- Completion status
- `View checklist` action

Use sample data:

- `Practical 4 · Interactive Prototype Testing`
- Sep 25, 2:00–4:00 PM
- Design Studio B
- Teams of three
- Bring a clickable prototype and consent script
- Figma, laptop, and two test participants
- Preparation checklist: 3 of 5 complete

### 11. Social events panel

Give social events a friendlier visual treatment while keeping them integrated with the academic dashboard. Show:

- Event name
- Date and time
- Location
- Host/organizer
- One-sentence outline
- RSVP state and attendee count
- `RSVP` or `Update RSVP` action

Use sample events:

- `HCI Student Mixer` — Sep 27, 6:00 PM — Student Union Terrace — hosted by HCI Society — 42 attending — not yet RSVP'd
- `Portfolio Peer Review` — Oct 8, 4:30 PM — Design Library — 18 attending — going

Use teal as the supporting accent for this panel. Do not use playful styling that conflicts with the rest of the academic product.

### 12. Detail interaction pattern

The single-screen dashboard must remain the home context. When the user selects `Open details`, `Review topics`, `View study plan`, `View checklist`, or an event:

- Open a right-side drawer on desktop, approximately 420–480px wide
- Open a full-height bottom sheet or full-screen dialog on mobile
- Preserve the dashboard behind it
- Put focus inside the drawer/dialog when it opens
- Allow closing with a visible close button and the Escape key
- Return keyboard focus to the button that opened it
- Prevent background interaction while the modal surface is open

The detail surface should include the full description, dates, grading or preparation details, linked resources, a small checklist if relevant, and the primary action. Use realistic sample content instead of lorem ipsum.

### 13. Global search

The search button or `/` shortcut opens a command-style search dialog. Search across assignments, quizzes, curriculum topics, practicals, final exam information, and social events.

Requirements:

- Group results by category
- Highlight the matching text
- Support keyboard navigation with Up/Down, Enter, and Escape
- Selecting a result closes search, focuses the relevant panel, and opens its detail drawer when applicable
- Provide a clear no-results state
- Do not activate the `/` shortcut while the user is typing in an input, textarea, or editable element

### 14. Useful interactions

Implement these interactions fully:

1. Mark an assignment checklist item complete and update its progress.
2. Toggle practical preparation checklist items and update `3 of 5 complete` live.
3. Change event RSVP between `Going`, `Maybe`, and `Not going`.
4. Filter the curriculum timeline.
5. Open and close all detail drawers/dialogs accessibly.
6. Search all dashboard content.
7. Toggle a compact notification popover with three realistic sample notifications.
8. Persist checklist, progress, and RSVP changes in `localStorage`.
9. Include a `Reset demo data` control inside the avatar/settings menu.

Show non-disruptive toast feedback for saved changes. Toasts must not steal focus and must be announced to screen readers.

### 15. Data model

Create typed domain models instead of embedding unrelated literals throughout JSX. A suggested structure is:

```ts
type ItemStatus =
  | 'not-started'
  | 'in-progress'
  | 'submitted'
  | 'graded'
  | 'upcoming'
  | 'completed'
  | 'overdue';

type ChecklistItem = {
  id: string;
  label: string;
  completed: boolean;
};

type BaseClassItem = {
  id: string;
  title: string;
  description: string;
  date?: string;
  status: ItemStatus;
  relatedWeek?: number;
};

type Assignment = BaseClassItem & {
  dueAt: string;
  weightPercent: number;
  pointsPossible?: number;
  progressPercent: number;
  submissionType: string;
  checklist: ChecklistItem[];
  grade?: { earned: number; possible: number };
};

type Quiz = BaseClassItem & {
  startsAt: string;
  durationMinutes: number;
  topics: string[];
  attemptsAllowed: number;
  format: string;
  pointsPossible: number;
  score?: number;
};

type CurriculumWeek = {
  week: number;
  dateRange: string;
  topic: string;
  objective: string;
  status: 'completed' | 'current' | 'upcoming';
  linkedItemIds: string[];
};

type Practical = BaseClassItem & {
  startsAt: string;
  endsAt: string;
  location: string;
  format: string;
  preparation: string[];
  materials: string[];
  checklist: ChecklistItem[];
};

type SocialEvent = BaseClassItem & {
  startsAt: string;
  location: string;
  host: string;
  attendeeCount: number;
  rsvp: 'going' | 'maybe' | 'not-going' | 'not-set';
};
```

Add an appropriate typed model for `FinalExam`, `Course`, and `Notification`. Keep sample data in a dedicated data module. Store dates as ISO 8601 strings and format them for display at the component boundary.

For a deterministic demo, define a single `DEMO_TODAY` value in the sample-data layer and calculate relative dates from it. Add a clearly named configuration switch that can use the real current date later. Do not scatter calls to `new Date()` across components.

### 16. Component architecture

Use a maintainable structure similar to:

```text
src/
  app/
    App.tsx
  components/
    layout/
      AppHeader.tsx
      DashboardGrid.tsx
      SummaryStrip.tsx
    panels/
      AssignmentsPanel.tsx
      QuizzesPanel.tsx
      CurriculumPanel.tsx
      FinalExamPanel.tsx
      PracticalPanel.tsx
      SocialEventsPanel.tsx
    shared/
      Badge.tsx
      EmptyState.tsx
      IconButton.tsx
      ProgressBar.tsx
      SearchDialog.tsx
      StatusBadge.tsx
      ToastRegion.tsx
      DetailDrawer.tsx
  data/
    sampleData.ts
  hooks/
    useLocalStorage.ts
    useDashboardSearch.ts
  lib/
    dates.ts
    storage.ts
    search.ts
  types/
    course.ts
  styles/
    globals.css
```

This structure is guidance, not a requirement to create pointless files. Keep components focused, readable, and typed. Extract repeated panel and item patterns only when it improves clarity.

### 17. Responsive behavior

Implement and test these breakpoints intentionally:

#### Large desktop: 1280px and above

- Show the full three-column dashboard grid.
- Keep all six category headings and next items visible in the initial viewport at 1440 × 900.
- Use internal scrolling for long assignment and curriculum lists.

#### Tablet: 768px–1279px

- Use a two-column layout.
- Curriculum spans both columns near the top.
- Assignments and quizzes share one column; final exam, practical, and events use the other.
- Permit page scrolling.
- Remove fixed internal panel heights where they create nested-scroll friction.

#### Mobile: below 768px

- Use one column.
- Order content by urgency: summary, assignments, quizzes, practical, final exam, curriculum, events.
- Convert the summary strip into a horizontally scrollable snap row or a compact 2×2 grid.
- Make tap targets at least 44 × 44px.
- Use full-width buttons when appropriate.
- Do not truncate essential dates or status labels.
- Do not use horizontal page scrolling.
- Use a mobile dialog/bottom sheet for details.

Verify the layout at 1440 × 900, 1024 × 768, 768 × 1024, 390 × 844, and 360 × 800.

### 18. Accessibility requirements

Meet WCAG 2.2 AA practices for this interface:

- Use a logical heading hierarchy with one `h1`.
- Add a skip link to the main dashboard.
- Ensure all controls are keyboard reachable.
- Provide visible focus indicators with sufficient contrast.
- Use semantic buttons, lists, progress elements, time elements, and dialogs.
- Give icon-only controls accessible names.
- Associate every visible label with its control.
- Announce saved-state changes and toast messages appropriately.
- Trap focus in modal dialogs/drawers and restore it on close.
- Respect `prefers-reduced-motion`.
- Avoid conveying status by color alone.
- Maintain at least 4.5:1 contrast for normal text and 3:1 for large text and meaningful UI boundaries.
- Ensure screen readers can identify progress values and due dates.

Do not add ARIA roles when native HTML already provides the correct semantics.

### 19. Motion and feedback

Use motion sparingly:

- 150–220ms transitions for hover, focus, drawer, and popover states
- A subtle progress update animation
- No continuous animation
- No parallax
- No large entrance sequence
- Disable or simplify transitions when reduced motion is requested

Every interactive control needs a clear hover, active, focus, disabled, and loading state where applicable.

### 20. Empty, error, and edge states

Create reusable states and make them easy to preview during development:

- No upcoming assignments
- No quiz currently available
- No social events scheduled
- Curriculum filter with no matches
- Search with no results
- Corrupt or unavailable `localStorage` data
- An item whose date has passed and must become overdue
- Very long titles and locations
- Scores of zero and full marks

If stored data is malformed, safely fall back to sample data without crashing. Log a concise development warning, not personal or sensitive data.

### 21. Implementation sequence

Follow this order and keep the app runnable after each major phase:

#### Phase 1 — Inspect and initialize

1. Inspect the repository and preserve useful existing configuration.
2. If empty, create the Vite + React + TypeScript project.
3. Install only the dependencies needed for the requested features.
4. Configure strict TypeScript, Tailwind, linting, and test scripts.
5. Establish global design tokens and the page shell.

#### Phase 2 — Model the information

1. Create typed course, assessment, curriculum, event, and notification models.
2. Add complete, realistic sample data matching this specification.
3. Create centralized date formatting and relative-date helpers.
4. Create safe local persistence utilities with validation and fallback behavior.

#### Phase 3 — Build the static dashboard

1. Build the accessible header and summary strip.
2. Create the responsive 12-column desktop grid.
3. Implement each of the six category panels.
4. Tune panel density so all categories are visible at 1440 × 900.
5. Add tablet and mobile layouts.

#### Phase 4 — Add interactions

1. Add the shared accessible detail drawer/dialog.
2. Add curriculum filters.
3. Add assignment and practical checklists.
4. Add RSVP controls.
5. Add search and keyboard shortcuts.
6. Add notification and avatar/settings popovers.
7. Add toast feedback and persistence.

#### Phase 5 — Harden the experience

1. Add loading, empty, no-result, malformed-storage, and overdue states.
2. Test keyboard-only use from the skip link through every control.
3. Test focus trapping and focus restoration.
4. Check color contrast and reduced motion.
5. Check long content and narrow screens.
6. Remove console errors, React warnings, broken controls, and layout overflow.

#### Phase 6 — Verify and document

1. Run type checking, linting, tests, and the production build.
2. Add focused tests for date/urgency logic, search, local persistence, curriculum filters, checklist updates, and RSVP changes.
3. Visually verify every required viewport.
4. Add a concise README with setup commands, architecture notes, keyboard controls, and known limitations.
5. Summarize the files created, decisions made, commands run, and verification results.

### 22. Testing requirements

At minimum, implement tests that prove:

- Assignments are sorted with overdue and nearest due items first.
- Completed assignments are not incorrectly marked overdue.
- Relative dates use the centralized demo date.
- Curriculum filter chips show the correct weeks.
- Search returns results from every content category.
- Search ignores case and handles partial terms.
- Checklist updates recalculate progress.
- RSVP changes are persisted and restored.
- Malformed stored state falls back safely.
- The detail drawer receives an accessible name and closes with Escape.

Prefer user-visible behavior tests over tests of implementation details.

### 23. Definition of done

The task is complete only when all of the following are true:

- The application runs locally from documented commands.
- The initial 1440 × 900 dashboard shows all six required categories at once.
- Each category displays useful realistic information, not placeholders.
- The layout is polished and usable at all specified viewport sizes.
- Search, filters, drawers, checklists, RSVP, notifications, reset, and persistence work.
- Keyboard and screen-reader behavior is considered and tested.
- There are no obvious horizontal overflows, clipped controls, or unreadable labels.
- Type checking, linting, automated tests, and production build pass.
- The README explains setup, features, shortcuts, and key implementation decisions.

### 24. Working style and output expectations

Make reasonable product decisions from this brief without repeatedly asking for approval. If a required detail is genuinely ambiguous, choose the simplest accessible behavior and document the choice.

While implementing:

- Do not leave core features as TODO comments.
- Do not use lorem ipsum.
- Do not make buttons that look interactive but do nothing.
- Do not use fabricated network requests or pretend backend behavior.
- Do not expose secrets or require API keys.
- Do not rewrite unrelated existing files.
- Keep dependency count modest.
- Use comments only where the reasoning is not obvious from the code.

At the end, report:

1. What was built
2. The main file structure
3. How to run it
4. Which tests and checks passed
5. Any non-blocking limitations or recommended next steps

Begin by inspecting the repository, then implement the product end to end.

---

## Optional personalization before use

Replace these defaults if you already know your real course information:

- App name: `ClassFlow`
- Course: `CS 301 · Human–Computer Interaction`
- Semester: `Fall 2026`
- University colors
- Number of curriculum weeks
- Assessment weights and grading system
- Time zone and locale
- Real assignment, quiz, practical, exam, and event information

If you leave them unchanged, the coding agent should build the complete sample experience first so you can evaluate the design before connecting real data.
