import { useState } from "react";
import { format, isPast, parseISO } from "date-fns";
import TaskItem from "./TaskItem";
import AddGoalModal from "./AddGoalModal";
import "./GoalCard.css";

export default function GoalCard({ goal, taskFilter = "active", onUpdateGoal, onDeleteGoal, onAddTask, onEditTask, onDeleteTask, onUpdateTask }) {
  const [expanded, setExpanded] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);

  const tasks = goal.tasks || [];
  const visibleTasks = taskFilter === "completed"
    ? tasks.filter((t) => t.status === "completed")
    : tasks.filter((t) => t.status !== "completed");
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
            <button
              className="btn-icon"
              onClick={() => setEditingGoal(true)}
              title="Edit goal"
            >
              ✎
            </button>
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
          {visibleTasks.length === 0 ? (
            <p className="no-tasks">
              {taskFilter === "completed"
                ? "No completed tasks yet for this goal."
                : "No active tasks. Add one below."}
            </p>
          ) : (
            <>
              <div className="task-table-header">
                <span>Status</span>
                <span style={{ paddingLeft: "8px" }}>Task</span>
                <span style={{ textAlign: "center" }}>
                  {taskFilter === "completed" ? "Completed On" : "Due Date"}
                </span>
                <span style={{ textAlign: "right" }}>Actions</span>
              </div>
              <div className="task-table-body">
                {visibleTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    showCompletedDate={taskFilter === "completed"}
                    onEdit={() => onEditTask(task)}
                    onDelete={() => onDeleteTask(task.id, goal.id)}
                    onStatusChange={(status, percent) =>
                      onUpdateTask(task.id, goal.id, { status, percent_complete: percent })
                    }
                  />
                ))}
              </div>
            </>
          )}
          {taskFilter !== "completed" && (
            <button className="btn-add-task" onClick={() => onAddTask(goal.id)}>
              + Add task
            </button>
          )}
        </div>
      )}
      {editingGoal && (
        <AddGoalModal
          isEdit
          initialTitle={goal.title}
          initialDeadline={goal.deadline ? goal.deadline.split("T")[0] : ""}
          onSave={async (payload) => {
            await onUpdateGoal(goal.id, payload);
            setEditingGoal(false);
          }}
          onClose={() => setEditingGoal(false)}
        />
      )}
    </div>
  );
}
