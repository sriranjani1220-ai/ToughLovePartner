import { useState } from "react";

export default function AddGoalModal({ onSave, onClose, initialTitle = "", initialDeadline = "", isEdit = false }) {
  const [title, setTitle] = useState(initialTitle);
  const [deadline, setDeadline] = useState(initialDeadline);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave({ title: title.trim(), deadline: deadline || null });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? "Edit Goal" : "New Goal"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Goal title</label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Launch my Etsy shop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Deadline (optional)</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={!title.trim() || saving}>
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Save Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
