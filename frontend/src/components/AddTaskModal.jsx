import { useState } from "react";
import { format } from "date-fns";

export default function AddTaskModal({ goalId, onSave, onClose }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [completedOn, setCompletedOn] = useState(format(new Date(), "yyyy-MM-dd"));
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        goal_id: goalId,
        title: title.trim(),
        due_date: dueDate || null,
      };
      if (alreadyDone) {
        payload.status = "completed";
        payload.percent_complete = 100;
        payload.completed_at = completedOn ? new Date(completedOn).toISOString() : new Date().toISOString();
        payload.started_at = payload.completed_at;
      }
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task</label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Write product descriptions"
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
          <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              id="already-done"
              checked={alreadyDone}
              onChange={(e) => setAlreadyDone(e.target.checked)}
            />
            <label htmlFor="already-done" style={{ margin: 0, cursor: "pointer" }}>
              Already completed
            </label>
          </div>
          {alreadyDone && (
            <div className="form-group">
              <label>Completed on</label>
              <input
                type="date"
                value={completedOn}
                max={format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => setCompletedOn(e.target.value)}
              />
            </div>
          )}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={!title.trim() || saving}>
              {saving ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
