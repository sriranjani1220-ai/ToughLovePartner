import { format, isPast, parseISO, isToday } from "date-fns";
import "./TaskItem.css";

const STATUS_LABELS = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "✓ Done",
};

const STATUS_CYCLE = {
  not_started: "in_progress",
  in_progress: "completed",
  completed: "not_started",
};

export default function TaskItem({ task, showCompletedDate = false, onEdit, onDelete, onStatusChange }) {
  const isOverdue =
    task.due_date &&
    task.status !== "completed" &&
    isPast(parseISO(task.due_date)) &&
    !isToday(parseISO(task.due_date));

  function handleStatusClick() {
    const nextStatus = STATUS_CYCLE[task.status];
    let nextPercent;
    if (nextStatus === "in_progress") {
      nextPercent = task.percent_complete > 0 && task.percent_complete < 100
        ? task.percent_complete : 10;
    } else if (nextStatus === "completed") {
      nextPercent = 100;
    } else {
      nextPercent = 0;
    }
    onStatusChange(nextStatus, nextPercent);
  }

  return (
    <div className={`task-item ${task.status} ${isOverdue ? "overdue" : ""}`}>
      {/* Col 1: Status */}
      <button
        className={`status-badge ${task.status}`}
        onClick={handleStatusClick}
        title="Click to cycle status"
      >
        {STATUS_LABELS[task.status]}
      </button>

      {/* Col 2: Title + optional progress */}
      <div className="task-main">
        <span className={`task-title ${task.status === "completed" ? "strikethrough" : ""}`}>
          {task.title}
        </span>
        {task.status === "in_progress" && (
          <div className="task-percent-row">
            <input
              type="range"
              min="1"
              max="99"
              value={task.percent_complete}
              onChange={(e) => onStatusChange("in_progress", parseInt(e.target.value, 10))}
              className="percent-slider"
            />
            <span className="percent-label">{task.percent_complete}%</span>
          </div>
        )}
      </div>

      {/* Col 3: Due date or Completed on */}
      <div className="task-meta">
        {showCompletedDate ? (
          <span className="task-due">
            {task.completed_at ? format(new Date(task.completed_at), "MMM d, yyyy") : "—"}
          </span>
        ) : task.due_date ? (
          <span className={`task-due ${isOverdue ? "overdue" : ""}`}>
            {format(parseISO(task.due_date), "MMM d")}
          </span>
        ) : (
          <span className="task-due">—</span>
        )}
      </div>

      {/* Col 4: Actions */}
      <div className="task-actions">
        <button className="btn-icon" onClick={onEdit} title="Edit">✎</button>
        <button className="btn-icon danger" onClick={onDelete} title="Delete">✕</button>
      </div>
    </div>
  );
}
