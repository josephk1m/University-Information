"use client";

import {
  Atom,
  BookOpen,
  Box,
  Calculator,
  FlaskConical,
  Layers3,
  Save,
  Target,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import {
  courseIconKeys,
  courseTones,
  type Course,
  type CourseDraft,
  type CourseIconKey,
  type CourseTone,
} from "@/lib/courses";

const icons = {
  wrench: Wrench,
  box: Box,
  target: Target,
  atom: Atom,
  flask: FlaskConical,
  layers: Layers3,
  book: BookOpen,
  calculator: Calculator,
};

const iconLabels: Record<CourseIconKey, string> = {
  wrench: "Design",
  box: "CAD",
  target: "Math",
  atom: "Physics",
  flask: "Lab",
  layers: "Computing",
  book: "General",
  calculator: "Calculations",
};

const blankCourse: CourseDraft = {
  code: "",
  name: "",
  shortName: "",
  description: "",
  instructor: "",
  tone: "blue",
  iconKey: "book",
  progress: 0,
  schedule: "",
  room: "",
  next: "",
};

export const courseIconMap = icons;

export function CourseEditorSheet({
  course,
  onClose,
  onSave,
  onDelete,
}: {
  course: Course | null;
  onClose: () => void;
  onSave: (draft: CourseDraft) => Promise<string | null>;
  onDelete?: () => Promise<string | null>;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [tone, setTone] = useState<CourseTone>(course?.tone ?? blankCourse.tone);
  const [iconKey, setIconKey] = useState<CourseIconKey>(course?.iconKey ?? blankCourse.iconKey);
  const [progress, setProgress] = useState(course?.progress ?? 0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [busy, onClose]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const saveError = await onSave({
      code: String(form.get("code")),
      name: String(form.get("name")),
      shortName: String(form.get("shortName")),
      description: String(form.get("description")),
      instructor: String(form.get("instructor")),
      tone,
      iconKey,
      progress,
      schedule: String(form.get("schedule")),
      room: String(form.get("room")),
      next: String(form.get("next")),
    });
    if (saveError) {
      setError(saveError);
      setBusy(false);
    }
  }

  async function removeCourse() {
    if (!onDelete) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setBusy(true);
    setError("");
    const deleteError = await onDelete();
    if (deleteError) {
      setError(deleteError);
      setBusy(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="sheet-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <section className="detail-sheet add-sheet course-editor" role="dialog" aria-modal="true" aria-labelledby="course-editor-title">
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-topline">
          <div><span className="eyebrow">Course settings</span><h2 id="course-editor-title">{course ? "Edit course" : "Add a course"}</h2></div>
          <button ref={closeRef} className="icon-button" type="button" onClick={onClose} aria-label="Close course editor" disabled={busy}><X size={20} /></button>
        </div>

        <form onSubmit={submit}>
          <div className="form-pair">
            <label>Course code<input name="code" required maxLength={24} defaultValue={course?.code ?? ""} placeholder="e.g. THERMO 201" autoCapitalize="characters" /></label>
            <label>Short name<input name="shortName" required maxLength={60} defaultValue={course?.shortName ?? ""} placeholder="Thermodynamics" /></label>
          </div>
          <label>Full course name<input name="name" required maxLength={120} defaultValue={course?.name ?? ""} placeholder="Engineering Thermodynamics I" /></label>
          <label>Course information<textarea name="description" maxLength={600} rows={3} defaultValue={course?.description ?? ""} placeholder="Topics, goals, grading, or anything worth remembering…" /></label>
          <div className="form-pair">
            <label>Instructor<input name="instructor" maxLength={100} defaultValue={course?.instructor ?? ""} placeholder="Prof. name" /></label>
            <label>Room or location<input name="room" maxLength={120} defaultValue={course?.room ?? ""} placeholder="Engineering 210" /></label>
          </div>
          <label>Class schedule<input name="schedule" maxLength={120} defaultValue={course?.schedule ?? ""} placeholder="Mon & Wed · 10:00 AM" /></label>
          <label>Next milestone<input name="next" maxLength={160} defaultValue={course?.next ?? ""} placeholder="Quiz 1 · Sep 28" /></label>

          <label className="progress-input">Semester progress <span>{progress}%</span><input type="range" min="0" max="100" step="1" value={progress} onChange={(event) => setProgress(Number(event.target.value))} /></label>

          <fieldset className="course-style-picker">
            <legend>Course color</legend>
            <div>{courseTones.map((value) => <button className={`${value} ${tone === value ? "selected" : ""}`} key={value} type="button" onClick={() => setTone(value)} aria-label={`${value} course color`} aria-pressed={tone === value}><span /></button>)}</div>
          </fieldset>

          <fieldset className="course-icon-picker">
            <legend>Course icon</legend>
            <div>{courseIconKeys.map((value) => {
              const Icon = icons[value];
              return <button className={iconKey === value ? "selected" : ""} key={value} type="button" onClick={() => setIconKey(value)} aria-pressed={iconKey === value}><Icon size={18} /><span>{iconLabels[value]}</span></button>;
            })}</div>
          </fieldset>

          {error && <p className="course-form-error" role="alert">{error}</p>}
          <button className="primary-action" type="submit" disabled={busy}><Save size={19} /> {busy ? "Saving…" : course ? "Save course changes" : "Add course"}</button>
          {course && onDelete && (
            <button className={confirmDelete ? "danger-action confirm" : "danger-action"} type="button" onClick={() => void removeCourse()} disabled={busy}>
              <Trash2 size={18} /> {confirmDelete ? `Tap again to remove ${course.code}` : "Remove course"}
            </button>
          )}
        </form>
      </section>
    </div>
  );
}
