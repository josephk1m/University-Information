export const courseTones = ["blue", "purple", "orange", "teal", "red", "yellow"] as const;
export const courseIconKeys = ["wrench", "box", "target", "atom", "flask", "layers", "book", "calculator"] as const;

export type CourseTone = (typeof courseTones)[number];
export type CourseIconKey = (typeof courseIconKeys)[number];

export type Course = {
  id: string;
  ref: string;
  templateKey: string | null;
  code: string;
  name: string;
  shortName: string;
  description: string;
  instructor: string;
  tone: CourseTone;
  iconKey: CourseIconKey;
  progress: number;
  schedule: string;
  room: string;
  next: string;
  sortOrder: number;
};

export type CourseDraft = Pick<
  Course,
  "code" | "name" | "shortName" | "description" | "instructor" | "tone" | "iconKey" | "progress" | "schedule" | "room" | "next"
>;

export type StudentCourseRow = {
  id: string;
  template_key: string | null;
  code: string;
  name: string;
  short_name: string;
  description: string;
  instructor: string;
  tone: CourseTone;
  icon_key: CourseIconKey;
  progress: number;
  schedule: string;
  room: string;
  next_milestone: string;
  sort_order: number;
};

export type DefaultCourseSeed = CourseDraft & {
  templateKey: string;
  sortOrder: number;
};

export const defaultCourseSeeds: DefaultCourseSeed[] = [
  {
    templateKey: "mech-101",
    code: "MECH 101",
    name: "Introduction to Mechanical Design",
    shortName: "Mechanical Design",
    description: "Design process, materials, manufacturing, and communication fundamentals.",
    instructor: "Prof. Daniel Cho",
    tone: "blue",
    iconKey: "wrench",
    progress: 38,
    schedule: "Tue & Thu · 10:00 AM",
    room: "Engineering 210",
    next: "Design brief · Sep 22",
    sortOrder: 0,
  },
  {
    templateKey: "engr-105",
    code: "ENGR 105",
    name: "Engineering Graphics & CAD",
    shortName: "Graphics & CAD",
    description: "Technical drawing, solid modelling, assemblies, and design documentation.",
    instructor: "Dr. Maya Patel",
    tone: "purple",
    iconKey: "box",
    progress: 46,
    schedule: "Mon & Wed · 1:00 PM",
    room: "CAD Studio 04",
    next: "Assembly drawing · Tomorrow",
    sortOrder: 1,
  },
  {
    templateKey: "math-101",
    code: "MATH 101",
    name: "Engineering Calculus I",
    shortName: "Calculus I",
    description: "Limits, derivatives, applications, and the mathematical tools used in engineering.",
    instructor: "Dr. Elena Ruiz",
    tone: "orange",
    iconKey: "target",
    progress: 42,
    schedule: "Mon, Wed & Fri · 11:00 AM",
    room: "Science Hall 118",
    next: "Problem set 4 · Sep 20",
    sortOrder: 2,
  },
  {
    templateKey: "phys-101",
    code: "PHYS 101",
    name: "Physics I: Mechanics",
    shortName: "Physics: Mechanics",
    description: "Kinematics, forces, energy, momentum, and rotational motion.",
    instructor: "Prof. Isaac Bennett",
    tone: "teal",
    iconKey: "atom",
    progress: 34,
    schedule: "Tue & Thu · 9:00 AM",
    room: "Newton Hall 106",
    next: "Dynamics quiz · Sep 21",
    sortOrder: 3,
  },
  {
    templateKey: "phys-103l",
    code: "PHYS 103L",
    name: "Physics Laboratory I",
    shortName: "Physics Lab",
    description: "Hands-on mechanics experiments, data analysis, uncertainty, and technical reports.",
    instructor: "Dr. Amina Okafor",
    tone: "red",
    iconKey: "flask",
    progress: 30,
    schedule: "Thu · 2:00 PM",
    room: "Lab Wing B12",
    next: "Pre-lab check · Today",
    sortOrder: 4,
  },
  {
    templateKey: "cs-110",
    code: "CS 110",
    name: "Computational Methods",
    shortName: "Computational Methods",
    description: "Programming and numerical methods for first-year engineering problems.",
    instructor: "Prof. Leah Morgan",
    tone: "yellow",
    iconKey: "layers",
    progress: 41,
    schedule: "Fri · 2:00 PM",
    room: "Technology 302",
    next: "Python worksheet · Sep 23",
    sortOrder: 5,
  },
];

export function courseFromRow(row: StudentCourseRow): Course {
  return {
    id: row.id,
    ref: row.template_key ?? row.id,
    templateKey: row.template_key,
    code: row.code,
    name: row.name,
    shortName: row.short_name,
    description: row.description,
    instructor: row.instructor,
    tone: row.tone,
    iconKey: row.icon_key,
    progress: row.progress,
    schedule: row.schedule,
    room: row.room,
    next: row.next_milestone,
    sortOrder: row.sort_order,
  };
}

export function courseDraftToRow(draft: CourseDraft) {
  return {
    code: draft.code.trim().toUpperCase().replace(/\s+/g, " "),
    name: draft.name.trim(),
    short_name: draft.shortName.trim(),
    description: draft.description.trim(),
    instructor: draft.instructor.trim(),
    tone: draft.tone,
    icon_key: draft.iconKey,
    progress: Math.max(0, Math.min(100, Math.round(draft.progress))),
    schedule: draft.schedule.trim(),
    room: draft.room.trim(),
    next_milestone: draft.next.trim(),
    updated_at: new Date().toISOString(),
  };
}
