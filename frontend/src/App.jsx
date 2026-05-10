import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import LoginPage from "./pages/LoginPage";
import TodoTab from "./pages/TodoTab";
import InsightsTab from "./pages/InsightsTab";
import { LogoB } from "./components/LogoShowcase";
import "./App.css";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("todo");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="app-loading">Loading...</div>;
  if (!session) return <LoginPage />;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <LogoB size={44} />
            <span className="brand-name">ToughLovePartner</span>
          </div>
          <div className="header-right">
            <span className="user-email">{session.user.email}</span>
            <button
              className="btn-signout"
              onClick={() => supabase.auth.signOut()}
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="tab-nav">
          <button
            className={`tab-btn ${activeTab === "todo" ? "active" : ""}`}
            onClick={() => setActiveTab("todo")}
          >
            To-Do List
          </button>
          <button
            className={`tab-btn ${activeTab === "insights" ? "active" : ""}`}
            onClick={() => setActiveTab("insights")}
          >
            Insights
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === "todo" ? <TodoTab session={session} /> : <InsightsTab />}
      </main>
    </div>
  );
}
