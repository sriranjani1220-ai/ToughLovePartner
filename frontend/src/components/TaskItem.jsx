import { format, isPast, parseISO, isToday } from "date-fns";
import "./TaskItem.css";

const STATUS_LABELS = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
};

const STATUS_CYCLE = {
  not_started: "in_progress",
  in_progress: "completed",
  completed: "not_started",
};

export default function TaskItem({ task, onEdit, onDelete, onStatusChange }) {
  const isOverdue =
    task.due_date &&
    task.status !== "completed" &&
    isPast(parseISO(task.due_date)) &&
    !isToday(parseISO(task.due_date));

  function handleStatusClick() {
    const nextStatus = STATUS_CYCLE[task.status];
    let nextPercent;

    if (nextStatus === "in_progress") {
      // Keep existing % if already partially done, otherwise start at 10
      nextPercent = task.percent_complete > 0 && task.percent_complete < 100
        ? task.percent_complete
        : 10;
    } else if (nextStatus === "completed") {
      nextPercent = 100;
    } else {
      // back to not_started
      nextPercent = 0;
    }

    onStatusChange(nextStatus, nextPercent);
  }

  function handlePercentChange(e) {
    const val = parseInt(e.target.value, 10);
    onStatusChange("in_progress", val);
  }

  return (
    <div className={`task-item ${task.status} ${isOverdue ? "overdue" : ""}`}>
      <div className="task-main">
        <button
          className={`status-badge ${task.status}`}
          onClick={handleStatusClick}
          title="Click to change status"
        >
          {task.status === "completed" && <span className="status-check">✓</span>}
          {STATUS_LABELS[task.status]}
        </button>

        <span className={`task-title ${task.status === "completed" ? "strikethrough" : ""}`}>
          {task.title}
        </span>

        <div className="task-meta">
          {task.due_date && (
            <span className={`task-due ${isOverdue ? "overdue" : ""}`}>
              {isOverdue ? "Overdue · " : ""}
              {format(parseISO(task.due_date), "MMM d")}
            </span>
          )}
        </div>
      </div>

      {task.status === "in_progress" && (
        <div className="task-percent-row">
          <input
            type="range"
            min="1"
            max="99"
            value={task.percent_complete}
            onChange={handlePercentChange}
            className="percent-slider"
          />
          <span className="percent-label">{task.percent_complete}%</span>
        </div>
      )}

      <div className="task-actions">
        <button className="btn-icon" onClick={onEdit} title="Edit">✎</button>
        <button className="btn-icon danger" onClick={onDelete} title="Delete">✕</button>
      </div>
    </div>
  );
}
