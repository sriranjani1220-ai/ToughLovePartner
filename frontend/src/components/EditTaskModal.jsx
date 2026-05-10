import { useState } from "react";

const STATUS_OPTIONS = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

export default function EditTaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(task.due_date || "");
  const [status, setStatus] = useState(task.status);
  const [percent, setPercent] = useState(task.percent_complete);
  const [saving, setSaving] = useState(false);

  function handleStatusChange(e) {
    const s = e.target.value;
    setStatus(s);
    if (s === "completed") setPercent(100);
    if (s === "not_started") setPercent(0);
    if (s === "in_progress" && percent === 100) setPercent(50);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        due_date: dueDate || null,
        status,
        percent_complete: percent,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={handleStatusChange}>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          {status === "in_progress" && (
            <div className="form-group">
              <label>Progress — {percent}%</label>
              <input
                type="range"
                min="1"
                max="99"
                value={percent}
                onChange={(e) => setPercent(parseInt(e.target.value, 10))}
                style={{ width: "100%", accentColor: "var(--in-progress)" }}
              />
            </div>
          )}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={!title.trim() || saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
