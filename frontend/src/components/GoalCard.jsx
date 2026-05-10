import { useState } from "react";
import { format, isPast, parseISO } from "date-fns";
import TaskItem from "./TaskItem";
import "./GoalCard.css";

export default function GoalCard({ goal, onUpdateGoal, onDeleteGoal, onAddTask, onEditTask, onDeleteTask, onUpdateTask }) {
  const [expanded, setExpanded] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const tasks = goal.tasks || [];
  const isDeadlinePast = goal.deadline && isPast(parseISO(goal.deadline));

  return (
    <div className="goal-card">
      <div className="goal-header" onClick={() => setExpanded((e) => !e)}>
        <div className="goal-header-left">
          <span className={`goal-chevron ${expanded ? "open" : ""}`}>›</span>
          <div>
            <div className="goal-title">{goal.title}</div>
            {goal.deadline && (
              <div className={`goal-deadline ${isDeadlinePast ? "overdue" : ""}`}>
                {isDeadlinePast ? "Overdue · " : "Due "}
                {format(parseISO(goal.deadline), "MMM d, yyyy")}
              </div>
            )}
          </div>
        </div>

        <div className="goal-header-right" onClick={(e) => e.stopPropagation()}>
          <div className="goal-stats">
            <div className="stat">
              <span className="stat-value">{goal.percent_complete}%</span>
              <span className="stat-label">complete</span>
            </div>
            {goal.time_taken_hours > 0 && (
              <div className="stat">
                <span className="stat-value">{goal.time_taken_hours}h</span>
                <span className="stat-label">tracked</span>
              </div>
            )}
            <div className="stat">
              <span className="stat-value">{tasks.filter((t) => t.status === "completed").length}/{tasks.length}</span>
              <span className="stat-label">tasks</span>
            </div>
          </div>

          <div className="goal-actions">
            {!confirmDelete ? (
              <button
                className="btn-icon danger"
                onClick={() => setConfirmDelete(true)}
                title="Delete goal"
              >
                ✕
              </button>
            ) : (
              <div className="confirm-delete">
                <span>Delete?</span>
                <button className="btn-confirm-yes" onClick={() => onDeleteGoal(goal.id)}>Yes</button>
                <button className="btn-confirm-no" onClick={() => setConfirmDelete(false)}>No</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="goal-progress-bar">
        <div
          className="goal-progress-fill"
          style={{ width: `${goal.percent_complete}%` }}
        />
      </div>

      {/* Tasks */}
      {expanded && (
        <div className="goal-tasks">
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet. Add one below.</p>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id, goal.id)}
                onStatusChange={(status, percent) =>
                  onUpdateTask(task.id, goal.id, { status, percent_complete: percent })
                }
              />
            ))
          )}
          <button
            className="btn-add-task"
            onClick={() => onAddTask(goal.id)}
          >
            + Add task
          </button>
        </div>
      )}
    </div>
  );
}
