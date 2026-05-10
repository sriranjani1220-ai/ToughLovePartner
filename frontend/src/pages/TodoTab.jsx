import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getGoals, createGoal, updateGoal, deleteGoal, createTask, updateTask, deleteTask } from "../services/api";
import { setupPushNotifications } from "../services/notifications";
import GoalCard from "../components/GoalCard";
import AddGoalModal from "../components/AddGoalModal";
import AddTaskModal from "../components/AddTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import "./TodoTab.css";

export default function TodoTab() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [addTaskGoalId, setAddTaskGoalId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [notifEnabled, setNotifEnabled] = useState(false);

  useEffect(() => {
    loadGoals();
    setNotifEnabled(Notification.permission === "granted");
  }, []);

  async function loadGoals() {
    try {
      const data = await getGoals();
      setGoals(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddGoal(payload) {
    const goal = await createGoal(payload);
    setGoals((prev) => [...prev, goal]);
    setShowAddGoal(false);
  }

  async function handleUpdateGoal(id, payload) {
    const updated = await updateGoal(id, payload);
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updated } : g)));
  }

  async function handleDeleteGoal(id) {
    await deleteGoal(id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  async function handleAddTask(payload) {
    const task = await createTask(payload);
    setGoals((prev) =>
      prev.map((g) =>
        g.id === payload.goal_id
          ? refreshGoalStats({ ...g, tasks: [...(g.tasks || []), task] })
          : g
      )
    );
    setAddTaskGoalId(null);
  }

  async function handleUpdateTask(taskId, goalId, payload) {
    const updated = await updateTask(taskId, payload);
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? refreshGoalStats({
              ...g,
              tasks: g.tasks.map((t) => (t.id === taskId ? { ...t, ...updated } : t)),
            })
          : g
      )
    );
    setEditingTask(null);
  }

  async function handleDeleteTask(taskId, goalId) {
    await deleteTask(taskId);
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? refreshGoalStats({ ...g, tasks: g.tasks.filter((t) => t.id !== taskId) })
          : g
      )
    );
  }

  // Recalculate goal stats locally so UI stays instant
  function refreshGoalStats(goal) {
    const tasks = goal.tasks || [];
    const percent = tasks.length
      ? Math.floor(tasks.reduce((s, t) => s + t.percent_complete, 0) / tasks.length)
      : 0;

    let totalSeconds = 0;
    for (const t of tasks) {
      if (t.started_at && t.completed_at) {
        totalSeconds += Math.max(
          0,
          (new Date(t.completed_at) - new Date(t.started_at)) / 1000
        );
      }
    }

    return { ...goal, percent_complete: percent, time_taken_hours: +(totalSeconds / 3600).toFixed(1) };
  }

  async function handleEnableNotifications() {
    const ok = await setupPushNotifications();
    setNotifEnabled(ok);
  }

  if (loading) return <div className="todo-loading">Loading your goals...</div>;

  return (
    <div className="todo-tab">
      <div className="todo-header">
        <div>
          <h1 className="todo-title">Today</h1>
          <p className="todo-date">{format(new Date(), "EEEE, MMMM d")}</p>
        </div>
        <div className="todo-header-actions">
          {!notifEnabled && (
            <button className="btn-notif" onClick={handleEnableNotifications} title="Enable reminders">
              🔔 Enable reminders
            </button>
          )}
          {goals.length < 3 && (
            <button className="btn-add-goal" onClick={() => setShowAddGoal(true)}>
              + Add Goal
            </button>
          )}
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">🎯</p>
          <p className="empty-text">No goals yet. Add your first goal to get started.</p>
          <button className="btn-add-goal" onClick={() => setShowAddGoal(true)}>
            + Add Goal
          </button>
        </div>
      ) : (
        <div className="goals-list">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
              onAddTask={(goalId) => setAddTaskGoalId(goalId)}
              onEditTask={(task) => setEditingTask(task)}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
            />
          ))}
        </div>
      )}

      {showAddGoal && (
        <AddGoalModal
          onSave={handleAddGoal}
          onClose={() => setShowAddGoal(false)}
        />
      )}

      {addTaskGoalId && (
        <AddTaskModal
          goalId={addTaskGoalId}
          onSave={handleAddTask}
          onClose={() => setAddTaskGoalId(null)}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={(payload) => handleUpdateTask(editingTask.id, editingTask.goal_id, payload)}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
