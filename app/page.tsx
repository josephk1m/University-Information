"use client";

import {
  AlertTriangle,
  Atom,
  Bell,
  BookOpen,
  Box,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Download,
  FileText,
  FlaskConical,
  FolderOpen,
  GraduationCap,
  HardHat,
  Home,
  Layers3,
  MapPin,
  Plus,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Target,
  Wrench,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type Tab = "today" | "courses" | "calendar" | "materials";
type ItemKind = "assignment" | "test" | "exam" | "lab";
type Urgency = "critical" | "urgent" | "soon" | "upcoming";

type Course = {
  code: string;
  name: string;
  shortName: string;
  tone: string;
  icon: LucideIcon;
  progress: number;
  schedule: string;
  room: string;
  next: string;
};

type PlannerItem = {
  id: string;
  kind: ItemKind;
  courseCode: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  relative: string;
  urgency: Urgency;
  note: string;
  description: string;
  location?: string;
  weight?: string;
  progress?: number;
  completed?: boolean;
  checklist?: string[];
};

type Material = {
  id: string;
  title: string;
  courseCode: string;
  meta: string;
  type: "PDF" | "SLIDES" | "LINK" | "SHEET";
  detail: string;
};

const courses: Course[] = [
  {
    code: "MECH 101",
    name: "Introduction to Mechanical Design",
    shortName: "Mechanical Design",
    tone: "blue",
    icon: Wrench,
    progress: 38,
    schedule: "Tue & Thu · 10:00 AM",
    room: "Engineering 210",
    next: "Design brief · Sep 22",
  },
  {
    code: "ENGR 105",
    name: "Engineering Graphics & CAD",
    shortName: "Graphics & CAD",
    tone: "purple",
    icon: Box,
    progress: 46,
    schedule: "Mon & Wed · 1:00 PM",
    room: "CAD Studio 04",
    next: "Assembly drawing · Tomorrow",
  },
  {
    code: "MATH 101",
    name: "Engineering Calculus I",
    shortName: "Calculus I",
    tone: "orange",
    icon: Target,
    progress: 42,
    schedule: "Mon, Wed & Fri · 11:00 AM",
    room: "Science Hall 118",
    next: "Problem set 4 · Sep 20",
  },
  {
    code: "PHYS 101",
    name: "Physics I: Mechanics",
    shortName: "Physics: Mechanics",
    tone: "teal",
    icon: Atom,
    progress: 34,
    schedule: "Tue & Thu · 9:00 AM",
    room: "Newton Hall 106",
    next: "Dynamics quiz · Sep 21",
  },
  {
    code: "PHYS 103L",
    name: "Physics Laboratory I",
    shortName: "Physics Lab",
    tone: "red",
    icon: FlaskConical,
    progress: 30,
    schedule: "Thu · 2:00 PM",
    room: "Lab Wing B12",
    next: "Pre-lab check · Today",
  },
  {
    code: "CS 110",
    name: "Computational Methods",
    shortName: "Computational Methods",
    tone: "yellow",
    icon: Layers3,
    progress: 41,
    schedule: "Fri · 2:00 PM",
    room: "Technology 302",
    next: "Python worksheet · Sep 23",
  },
];

const baseItems: PlannerItem[] = [
  {
    id: "cad-assembly",
    kind: "assignment",
    courseCode: "ENGR 105",
    title: "Gearbox assembly drawing",
    dateLabel: "Fri, Sep 18",
    timeLabel: "11:59 PM",
    relative: "Due in 19 hours",
    urgency: "critical",
    note: "Export both the drawing PDF and native CAD file.",
    description:
      "Complete the dimensioned gearbox assembly drawing using the supplied part files. Include the section view, parts list, and drawing title block.",
    weight: "12% of course grade",
    progress: 60,
    checklist: ["Assembly constraints", "Section view", "Parts list", "Dimensions", "PDF export"],
  },
  {
    id: "dynamics-quiz",
    kind: "test",
    courseCode: "PHYS 101",
    title: "Dynamics quiz",
    dateLabel: "Mon, Sep 21",
    timeLabel: "9:00 AM",
    relative: "In 4 days",
    urgency: "soon",
    note: "One handwritten A4 formula sheet is allowed.",
    description:
      "A 25-minute in-class quiz covering free-body diagrams, Newton’s second law, friction, and connected particles.",
    location: "Newton Hall 106",
    weight: "8% of course grade",
    checklist: ["Review lecture 5", "Redo tutorial 3", "Prepare formula sheet"],
  },
  {
    id: "calculus-set",
    kind: "assignment",
    courseCode: "MATH 101",
    title: "Problem set 4 · Derivatives",
    dateLabel: "Sun, Sep 20",
    timeLabel: "6:00 PM",
    relative: "Due in 3 days",
    urgency: "urgent",
    note: "Show complete working for Questions 6–10.",
    description:
      "Solve the assigned derivative and rate-of-change problems. Submit one legible PDF through the course portal.",
    weight: "25 points",
    progress: 20,
    checklist: ["Questions 1–5", "Questions 6–10", "Check notation", "Upload PDF"],
  },
  {
    id: "lab-collision",
    kind: "lab",
    courseCode: "PHYS 103L",
    title: "Lab 3 · Collisions & momentum",
    dateLabel: "Thu, Sep 17",
    timeLabel: "2:00–4:00 PM",
    relative: "Today",
    urgency: "critical",
    note: "Bring safety glasses and closed-toe shoes.",
    description:
      "Measure one-dimensional collisions using the dynamics track. Your pre-lab calculation must be checked before equipment setup.",
    location: "Lab Wing B12",
    weight: "Lab report due Sep 24",
    progress: 50,
    checklist: ["Read lab manual", "Pre-lab calculation", "Safety briefing", "Data sheet", "Lab report"],
  },
  {
    id: "midterm-mech",
    kind: "exam",
    courseCode: "MECH 101",
    title: "Midterm exam",
    dateLabel: "Wed, Oct 7",
    timeLabel: "1:30–3:00 PM",
    relative: "In 20 days",
    urgency: "upcoming",
    note: "Arrive 15 minutes early with a non-programmable calculator.",
    description:
      "Covers design process, engineering drawings, materials selection, tolerances, and basic manufacturing methods from Weeks 1–6.",
    location: "Engineering Auditorium",
    weight: "25% of course grade",
    progress: 10,
    checklist: ["Weeks 1–3 review", "Weeks 4–6 review", "Practice paper", "Formula card"],
  },
  {
    id: "python-sheet",
    kind: "assignment",
    courseCode: "CS 110",
    title: "Python worksheet · Arrays",
    dateLabel: "Wed, Sep 23",
    timeLabel: "5:00 PM",
    relative: "Due in 6 days",
    urgency: "soon",
    note: "Submit the notebook with all cells executed.",
    description:
      "Complete the array operations and plotting exercises in the provided notebook, then export an HTML copy for submission.",
    weight: "10 points",
    progress: 0,
    checklist: ["Array exercises", "Plotting task", "Run all cells", "Export HTML"],
  },
];

const materials: Material[] = [
  {
    id: "lab-manual",
    title: "Lab 3 · Collisions manual",
    courseCode: "PHYS 103L",
    meta: "PDF · 2.4 MB · Week 4",
    type: "PDF",
    detail: "Required before today’s lab",
  },
  {
    id: "cad-checklist",
    title: "Assembly drawing checklist",
    courseCode: "ENGR 105",
    meta: "PDF · 380 KB · Assignment 2",
    type: "PDF",
    detail: "Submission requirements & rubric",
  },
  {
    id: "physics-formulas",
    title: "Mechanics formula sheet",
    courseCode: "PHYS 101",
    meta: "SHEET · 1 page · Weeks 1–5",
    type: "SHEET",
    detail: "Your editable study copy",
  },
  {
    id: "calculus-slides",
    title: "Lecture 9 · Chain rule",
    courseCode: "MATH 101",
    meta: "SLIDES · 34 pages · Week 4",
    type: "SLIDES",
    detail: "Posted by Dr. Elena Ruiz",
  },
  {
    id: "python-reference",
    title: "NumPy quick reference",
    courseCode: "CS 110",
    meta: "LINK · External resource",
    type: "LINK",
    detail: "Recommended reference",
  },
];

const kindMeta: Record<ItemKind, { label: string; icon: LucideIcon }> = {
  assignment: { label: "Assignment", icon: ClipboardCheck },
  test: { label: "Test", icon: FileText },
  exam: { label: "Exam", icon: GraduationCap },
  lab: { label: "Lab", icon: FlaskConical },
};

const navItems: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "today", label: "Today", icon: Home },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "calendar", label: "Plan", icon: CalendarDays },
  { id: "materials", label: "Materials", icon: FolderOpen },
];

const materialIcon: Record<Material["type"], LucideIcon> = {
  PDF: FileText,
  SLIDES: Layers3,
  LINK: ChevronRight,
  SHEET: ClipboardCheck,
};

function courseFor(code: string) {
  return courses.find((course) => course.code === code) ?? courses[0];
}

function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  );
}

function CourseBadge({ code }: { code: string }) {
  const course = courseFor(code);
  return <span className={`course-badge ${course.tone}`}>{code}</span>;
}

function DetailSheet({
  item,
  completed,
  onClose,
  onToggleComplete,
}: {
  item: PlannerItem;
  completed: boolean;
  onClose: () => void;
  onToggleComplete: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const meta = kindMeta[item.kind];
  const Icon = meta.icon;

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="sheet-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section
        className="detail-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-topline">
          <span className={`kind-icon ${item.kind}`}><Icon size={19} /></span>
          <button ref={closeRef} className="icon-button" type="button" onClick={onClose} aria-label="Close details">
            <X size={20} />
          </button>
        </div>
        <CourseBadge code={item.courseCode} />
        <h2 id="detail-title">{item.title}</h2>
        <p className="sheet-description">{item.description}</p>

        <div className="detail-grid">
          <div>
            <CalendarDays size={18} />
            <span><small>Date</small>{item.dateLabel}</span>
          </div>
          <div>
            <Clock3 size={18} />
            <span><small>Time</small>{item.timeLabel}</span>
          </div>
          {item.location && (
            <div>
              <MapPin size={18} />
              <span><small>Location</small>{item.location}</span>
            </div>
          )}
          {item.weight && (
            <div>
              <Target size={18} />
              <span><small>Worth</small>{item.weight}</span>
            </div>
          )}
        </div>

        <div className={`important-note ${item.kind === "lab" ? "safety" : ""}`}>
          {item.kind === "lab" ? <ShieldAlert size={19} /> : <AlertTriangle size={19} />}
          <div><strong>{item.kind === "lab" ? "Safety & preparation" : "Important note"}</strong><p>{item.note}</p></div>
        </div>

        {item.checklist && (
          <div className="detail-checklist">
            <div className="section-label-row"><h3>Checklist</h3><span>{item.progress ?? 0}%</span></div>
            {item.checklist.map((entry, index) => {
              const checked = completed || index < Math.round(((item.progress ?? 0) / 100) * item.checklist!.length);
              return (
                <div className="check-row" key={entry}>
                  <span className={checked ? "check checked" : "check"}>{checked && <Check size={14} />}</span>
                  <span>{entry}</span>
                </div>
              );
            })}
          </div>
        )}

        <button className={completed ? "primary-action completed" : "primary-action"} type="button" onClick={onToggleComplete}>
          {completed ? <><CheckCircle2 size={19} /> Mark as active</> : <><Check size={19} /> Mark complete</>}
        </button>
      </section>
    </div>
  );
}

function QuickAddSheet({ onClose, onAdd }: { onClose: () => void; onAdd: (item: PlannerItem) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [kind, setKind] = useState<ItemKind>("assignment");

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const dateValue = String(form.get("date"));
    const timeValue = String(form.get("time") || "23:59");
    const parsed = new Date(`${dateValue}T${timeValue}`);
    const validDate = !Number.isNaN(parsed.getTime());
    const dateLabel = validDate
      ? new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(parsed)
      : "Date to confirm";
    const timeLabel = validDate
      ? new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(parsed)
      : "Time to confirm";

    onAdd({
      id: `custom-${Date.now()}`,
      kind,
      courseCode: String(form.get("course")),
      title: String(form.get("title")),
      dateLabel,
      timeLabel,
      relative: "Newly added",
      urgency: "upcoming",
      note: String(form.get("note") || "No side note added."),
      description: `Personal ${kind} added to your first-year planner. Open it anytime to review the details or mark it complete.`,
      progress: 0,
      checklist: ["Review requirements", "Prepare work", "Submit or attend"],
    });
  }

  return (
    <div className="sheet-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="detail-sheet add-sheet" role="dialog" aria-modal="true" aria-labelledby="add-title">
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-topline">
          <div><span className="eyebrow">Quick add</span><h2 id="add-title">Add course work</h2></div>
          <button ref={closeRef} className="icon-button" type="button" onClick={onClose} aria-label="Close add form"><X size={20} /></button>
        </div>
        <form onSubmit={submit}>
          <fieldset className="type-picker">
            <legend>What are you adding?</legend>
            <div>
              {(Object.keys(kindMeta) as ItemKind[]).map((key) => {
                const Icon = kindMeta[key].icon;
                return <button key={key} type="button" className={kind === key ? "selected" : ""} onClick={() => setKind(key)}><Icon size={17} />{kindMeta[key].label}</button>;
              })}
            </div>
          </fieldset>
          <label>Title<input name="title" required placeholder="e.g. Materials problem set" /></label>
          <label>Course<select name="course" defaultValue="MECH 101">{courses.map((course) => <option key={course.code} value={course.code}>{course.code} · {course.shortName}</option>)}</select></label>
          <div className="form-pair">
            <label>Date<input name="date" type="date" required defaultValue="2026-09-25" /></label>
            <label>Time<input name="time" type="time" defaultValue="17:00" /></label>
          </div>
          <label>Important side note<textarea name="note" rows={3} placeholder="Equipment, submission format, allowed materials…" /></label>
          <button className="primary-action" type="submit"><Plus size={19} /> Add to my plan</button>
        </form>
      </section>
    </div>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("today");
  const [selectedItem, setSelectedItem] = useState<PlannerItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [customItems, setCustomItems] = useState<PlannerItem[]>([]);
  const [savedMaterials, setSavedMaterials] = useState<string[]>(["lab-manual", "physics-formulas"]);
  const [materialQuery, setMaterialQuery] = useState("");
  const [materialFilter, setMaterialFilter] = useState<"all" | "saved">("all");
  const [expandedCourse, setExpandedCourse] = useState<string | null>("MECH 101");
  const [toast, setToast] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let parsed: { completedIds?: string[]; customItems?: PlannerItem[]; savedMaterials?: string[] } = {};
    try {
      const stored = window.localStorage.getItem("mechmate-state-v1");
      if (stored) {
        parsed = JSON.parse(stored) as { completedIds?: string[]; customItems?: PlannerItem[]; savedMaterials?: string[] };
      }
    } catch {
      // The sample state remains available if local browser data is malformed.
    }
    const timer = window.setTimeout(() => {
      if (Array.isArray(parsed.completedIds)) setCompletedIds(parsed.completedIds);
      if (Array.isArray(parsed.customItems)) setCustomItems(parsed.customItems);
      if (Array.isArray(parsed.savedMaterials)) setSavedMaterials(parsed.savedMaterials);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("mechmate-state-v1", JSON.stringify({ completedIds, customItems, savedMaterials }));
  }, [completedIds, customItems, savedMaterials, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const allItems = useMemo(() => [...customItems, ...baseItems], [customItems]);
  const filteredMaterials = useMemo(() => {
    const query = materialQuery.trim().toLowerCase();
    return materials.filter((material) => {
      const matchesQuery = !query || `${material.title} ${material.courseCode} ${material.meta}`.toLowerCase().includes(query);
      const matchesFilter = materialFilter === "all" || savedMaterials.includes(material.id);
      return matchesQuery && matchesFilter;
    });
  }, [materialQuery, materialFilter, savedMaterials]);

  function toggleComplete(id: string) {
    setCompletedIds((current) => current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]);
    setToast(completedIds.includes(id) ? "Item moved back to active" : "Nice work — item completed");
  }

  function addItem(item: PlannerItem) {
    setCustomItems((current) => [item, ...current]);
    setAddOpen(false);
    setActiveTab("today");
    setToast("Added to your plan");
  }

  function toggleSaved(id: string) {
    setSavedMaterials((current) => current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]);
    setToast(savedMaterials.includes(id) ? "Removed from saved materials" : "Saved on this device");
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="topbar">
        <button className="brand" type="button" onClick={() => setActiveTab("today")} aria-label="MechMate home">
          <span className="brand-mark"><Wrench size={18} /></span>
          <span>MECH<span>MATE</span></span>
        </button>
        <div className="top-actions">
          <span className="sync-state"><span /> Saved on device</span>
          <button className="icon-button notification-button" type="button" aria-label="Open notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)}>
            <Bell size={20} /><span className="notification-dot">2</span>
          </button>
          <button className="avatar" type="button" aria-label="Open profile">JL</button>
          {notificationsOpen && (
            <div className="notification-popover">
              <div><strong>Updates</strong><button type="button" onClick={() => setNotificationsOpen(false)} aria-label="Close notifications"><X size={17} /></button></div>
              <button type="button" onClick={() => { setSelectedItem(baseItems[3]); setNotificationsOpen(false); }}><span className="notice-icon safety"><ShieldAlert size={17} /></span><span><strong>Lab preparation</strong><small>Safety glasses are required today.</small></span></button>
              <button type="button" onClick={() => { setSelectedItem(baseItems[0]); setNotificationsOpen(false); }}><span className="notice-icon"><Clock3 size={17} /></span><span><strong>Due tomorrow</strong><small>Gearbox drawing · 60% complete</small></span></button>
            </div>
          )}
        </div>
      </header>

      <div className="workspace">
        <nav className="app-nav" aria-label="Primary navigation">
          {navItems.slice(0, 2).map((nav) => {
            const Icon = nav.icon;
            return <button key={nav.id} type="button" className={activeTab === nav.id ? "active" : ""} onClick={() => setActiveTab(nav.id)} aria-current={activeTab === nav.id ? "page" : undefined}><Icon size={21} /><span>{nav.label}</span></button>;
          })}
          <button className="add-button" type="button" onClick={() => setAddOpen(true)} aria-label="Quick add course work"><Plus size={24} /><span>Add</span></button>
          {navItems.slice(2).map((nav) => {
            const Icon = nav.icon;
            return <button key={nav.id} type="button" className={activeTab === nav.id ? "active" : ""} onClick={() => setActiveTab(nav.id)} aria-current={activeTab === nav.id ? "page" : undefined}><Icon size={21} /><span>{nav.label}</span></button>;
          })}
        </nav>

        <main id="main-content">
          {activeTab === "today" && (
            <div className="page-view today-view">
              <section className="page-intro">
                <div>
                  <p className="eyebrow">1st year · Fall semester</p>
                  <h1>Good morning, Joseph.</h1>
                  <p>Thursday, September 17 <span>·</span> You’re on track.</p>
                </div>
                <button className="week-button" type="button" onClick={() => setActiveTab("calendar")}><span>Week</span><strong>04</strong><ChevronRight size={18} /></button>
              </section>

              <section className="urgent-card" aria-labelledby="due-next-heading">
                <div className="urgent-topline"><span><Clock3 size={15} /> Due next</span><span className="countdown">19h left</span></div>
                <div className="urgent-content">
                  <div>
                    <CourseBadge code="ENGR 105" />
                    <h2 id="due-next-heading">Gearbox assembly drawing</h2>
                    <p><CalendarDays size={16} /> Tomorrow · 11:59 PM</p>
                  </div>
                  <div className="hero-progress"><div><span>Progress</span><strong>3 of 5 steps</strong></div><ProgressBar value={60} label="Gearbox assignment progress" /></div>
                  <button className="light-action" type="button" onClick={() => setSelectedItem(baseItems[0])}>Continue assignment <ChevronRight size={18} /></button>
                </div>
                <div className="gear-lines" aria-hidden="true"><span /><span /><span /></div>
              </section>

              <section className="stat-row" aria-label="Week summary">
                <button type="button" onClick={() => setActiveTab("calendar")}><span className="stat-icon amber"><ClipboardCheck size={18} /></span><span><strong>4</strong><small>Due this week</small></span></button>
                <button type="button" onClick={() => setSelectedItem(baseItems[3])}><span className="stat-icon teal"><FlaskConical size={18} /></span><span><strong>2</strong><small>Labs to prep</small></span></button>
                <button type="button" onClick={() => setSelectedItem(baseItems[4])}><span className="stat-icon purple"><GraduationCap size={18} /></span><span><strong>20d</strong><small>Until midterm</small></span></button>
              </section>

              <div className="content-grid">
                <div className="content-main">
                  <section className="panel today-panel">
                    <div className="section-heading"><div><p className="eyebrow">Your day</p><h2>Today’s schedule</h2></div><button type="button" onClick={() => setActiveTab("calendar")}>Full plan <ChevronRight size={16} /></button></div>
                    <div className="timeline">
                      <div className="timeline-row done"><time>9:00</time><span className="timeline-dot"><Check size={12} /></span><button type="button"><strong>Physics lecture</strong><small>PHYS 101 · Newton Hall 106</small></button></div>
                      <div className="timeline-row current"><time>11:00</time><span className="timeline-dot" /><button type="button"><strong>Calculus tutorial</strong><small>MATH 101 · Science Hall 118</small></button><span className="now-tag">Now</span></div>
                      <div className="timeline-row"><time>2:00</time><span className="timeline-dot" /><button type="button" onClick={() => setSelectedItem(baseItems[3])}><strong>Collisions & momentum lab</strong><small>PHYS 103L · Lab Wing B12</small></button><ChevronRight size={18} /></div>
                      <div className="timeline-row"><time>5:00</time><span className="timeline-dot" /><button type="button" onClick={() => setSelectedItem(baseItems[0])}><strong>CAD focus block</strong><small>Personal study · 90 min</small></button><ChevronRight size={18} /></div>
                    </div>
                  </section>

                  <section className="panel coming-panel">
                    <div className="section-heading"><div><p className="eyebrow">Stay ahead</p><h2>Coming up</h2></div><button type="button" aria-label="Filter upcoming items"><SlidersHorizontal size={18} /></button></div>
                    <div className="task-list">
                      {allItems.filter((item) => item.id !== "cad-assembly").slice(0, 5).map((item) => {
                        const Icon = kindMeta[item.kind].icon;
                        const completed = completedIds.includes(item.id);
                        return (
                          <button className={completed ? "task-card is-complete" : "task-card"} type="button" key={item.id} onClick={() => setSelectedItem(item)}>
                            <span className={`kind-icon ${item.kind}`}><Icon size={18} /></span>
                            <span className="task-copy"><span><CourseBadge code={item.courseCode} /><em className={`urgency ${item.urgency}`}>{completed ? "Completed" : item.relative}</em></span><strong>{item.title}</strong><small>{item.dateLabel} · {item.timeLabel}</small>{item.note && <span className="micro-note"><AlertTriangle size={13} />{item.note}</span>}</span>
                            <ChevronRight size={19} />
                          </button>
                        );
                      })}
                    </div>
                  </section>
                </div>

                <aside className="content-aside">
                  <section className="safety-card">
                    <div className="safety-icon"><HardHat size={22} /></div>
                    <div><span className="eyebrow">Pinned lab note</span><h2>Safety gear today</h2><p>Bring safety glasses and wear closed-toe shoes for the momentum lab.</p><button type="button" onClick={() => setSelectedItem(baseItems[3])}>Open lab details <ChevronRight size={16} /></button></div>
                  </section>

                  <section className="panel material-preview">
                    <div className="section-heading"><div><p className="eyebrow">Ready when needed</p><h2>Important materials</h2></div><button type="button" onClick={() => setActiveTab("materials")}>All files <ChevronRight size={16} /></button></div>
                    {materials.slice(0, 3).map((material) => {
                      const Icon = materialIcon[material.type];
                      return <button type="button" className="mini-resource" key={material.id} onClick={() => { setActiveTab("materials"); setMaterialQuery(material.title); }}><span><Icon size={18} /></span><span><strong>{material.title}</strong><small>{material.courseCode} · {material.type}</small></span><ChevronRight size={17} /></button>;
                    })}
                  </section>
                </aside>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="page-view">
              <section className="page-intro compact"><div><p className="eyebrow">Fall semester · 6 courses</p><h1>Your courses</h1><p>Schedules, progress, and what comes next.</p></div></section>
              <div className="course-grid">
                {courses.map((course) => {
                  const Icon = course.icon;
                  const isOpen = expandedCourse === course.code;
                  const courseItems = allItems.filter((item) => item.courseCode === course.code);
                  return (
                    <article className={`course-card ${course.tone}`} key={course.code}>
                      <button className="course-card-main" type="button" onClick={() => setExpandedCourse(isOpen ? null : course.code)} aria-expanded={isOpen}>
                        <span className="course-icon"><Icon size={21} /></span>
                        <span className="course-title"><small>{course.code}</small><strong>{course.shortName}</strong><span>{course.schedule}</span></span>
                        <span className="course-progress"><strong>{course.progress}%</strong><ChevronDown size={18} /></span>
                      </button>
                      <ProgressBar value={course.progress} label={`${course.shortName} semester progress`} />
                      {isOpen && (
                        <div className="course-expanded">
                          <div className="course-meta"><span><MapPin size={15} />{course.room}</span><span><Clock3 size={15} />{course.schedule}</span></div>
                          <div className="course-next"><small>Next up</small><strong>{course.next}</strong></div>
                          {courseItems.length > 0 ? courseItems.slice(0, 2).map((item) => <button type="button" key={item.id} onClick={() => setSelectedItem(item)}><span>{kindMeta[item.kind].label}</span><strong>{item.title}</strong><ChevronRight size={17} /></button>) : <p className="empty-inline">Nothing due yet. Enjoy the breathing room.</p>}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="page-view">
              <section className="page-intro compact"><div><p className="eyebrow">September 2026</p><h1>Your plan</h1><p>An agenda built around what needs action next.</p></div><button className="outline-button" type="button"><CalendarDays size={17} /> Month</button></section>
              <div className="date-strip" aria-label="Select date">
                {[{ d: "MON", n: "14" }, { d: "TUE", n: "15" }, { d: "WED", n: "16" }, { d: "THU", n: "17" }, { d: "FRI", n: "18" }, { d: "SAT", n: "19" }, { d: "SUN", n: "20" }].map((day) => <button type="button" className={day.n === "17" ? "selected" : ""} key={day.n}><small>{day.d}</small><strong>{day.n}</strong>{["17", "18", "20"].includes(day.n) && <span />}</button>)}
              </div>
              <section className="agenda-panel">
                <div className="agenda-day"><div className="agenda-date"><strong>17</strong><span>THU<small>Today</small></span></div><div className="agenda-items"><button type="button"><time>11:00 AM</time><span className="agenda-line teal" /><span><strong>Calculus tutorial</strong><small>MATH 101 · Science Hall</small></span></button><button type="button" onClick={() => setSelectedItem(baseItems[3])}><time>2:00 PM</time><span className="agenda-line red" /><span><strong>Collisions & momentum lab</strong><small>PHYS 103L · Safety gear required</small></span></button></div></div>
                <div className="agenda-day"><div className="agenda-date"><strong>18</strong><span>FRI<small>Tomorrow</small></span></div><div className="agenda-items"><button type="button" onClick={() => setSelectedItem(baseItems[0])}><time>11:59 PM</time><span className="agenda-line purple" /><span><strong>Gearbox assembly drawing</strong><small>ENGR 105 · Assignment due</small></span><em>Critical</em></button></div></div>
                <div className="agenda-day"><div className="agenda-date"><strong>20</strong><span>SUN</span></div><div className="agenda-items"><button type="button" onClick={() => setSelectedItem(baseItems[2])}><time>6:00 PM</time><span className="agenda-line orange" /><span><strong>Problem set 4 · Derivatives</strong><small>MATH 101 · Assignment due</small></span></button></div></div>
                <div className="agenda-day"><div className="agenda-date"><strong>21</strong><span>MON</span></div><div className="agenda-items"><button type="button" onClick={() => setSelectedItem(baseItems[1])}><time>9:00 AM</time><span className="agenda-line teal" /><span><strong>Dynamics quiz</strong><small>PHYS 101 · 25 minutes</small></span></button></div></div>
                {customItems.map((item) => <div className="agenda-day" key={item.id}><div className="agenda-date"><strong>+</strong><span>NEW</span></div><div className="agenda-items"><button type="button" onClick={() => setSelectedItem(item)}><time>{item.timeLabel}</time><span className="agenda-line blue" /><span><strong>{item.title}</strong><small>{item.courseCode} · {item.dateLabel}</small></span></button></div></div>)}
              </section>
            </div>
          )}

          {activeTab === "materials" && (
            <div className="page-view">
              <section className="page-intro compact"><div><p className="eyebrow">Course library</p><h1>Materials</h1><p>Find the file you need without digging through six portals.</p></div></section>
              <label className="search-box"><Search size={19} /><span className="sr-only">Search materials</span><input value={materialQuery} onChange={(event) => setMaterialQuery(event.target.value)} placeholder="Search files, topics, or courses" />{materialQuery && <button type="button" onClick={() => setMaterialQuery("")} aria-label="Clear search"><X size={17} /></button>}</label>
              <div className="filter-row"><button type="button" className={materialFilter === "all" ? "active" : ""} onClick={() => setMaterialFilter("all")}>All materials</button><button type="button" className={materialFilter === "saved" ? "active" : ""} onClick={() => setMaterialFilter("saved")}><Download size={15} /> Saved on device</button></div>
              <section className="materials-panel">
                <div className="section-heading"><div><p className="eyebrow">{filteredMaterials.length} resources</p><h2>{materialFilter === "saved" ? "Saved materials" : "Recently added"}</h2></div></div>
                {filteredMaterials.length > 0 ? <div className="resource-list">{filteredMaterials.map((material) => {
                  const Icon = materialIcon[material.type];
                  const saved = savedMaterials.includes(material.id);
                  const course = courseFor(material.courseCode);
                  return <article className="resource-card" key={material.id}><span className={`resource-icon ${course.tone}`}><Icon size={21} /></span><div><CourseBadge code={material.courseCode} /><h3>{material.title}</h3><p>{material.detail}</p><small>{material.meta}</small></div><button className={saved ? "save-control saved" : "save-control"} type="button" onClick={() => toggleSaved(material.id)} aria-label={saved ? `Remove ${material.title} from saved materials` : `Save ${material.title} on this device`}>{saved ? <CheckCircle2 size={19} /> : <Download size={19} />}<span>{saved ? "Saved" : "Save"}</span></button></article>;
                })}</div> : <div className="empty-state"><FolderOpen size={28} /><h2>No materials found</h2><p>Try another term or show all materials.</p><button type="button" onClick={() => { setMaterialQuery(""); setMaterialFilter("all"); }}>Clear filters</button></div>}
              </section>
            </div>
          )}
        </main>
      </div>

      {selectedItem && <DetailSheet item={selectedItem} completed={completedIds.includes(selectedItem.id)} onClose={() => setSelectedItem(null)} onToggleComplete={() => toggleComplete(selectedItem.id)} />}
      {addOpen && <QuickAddSheet onClose={() => setAddOpen(false)} onAdd={addItem} />}
      <div className={toast ? "toast show" : "toast"} role="status" aria-live="polite"><CheckCircle2 size={17} />{toast}</div>
    </div>
  );
}
