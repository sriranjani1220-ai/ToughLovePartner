import { supabase } from "../supabaseClient";
import { LogoB } from "../components/LogoShowcase";
import "./LoginPage.css";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">
          <LogoB size={160} />
        </div>
        <h1 className="login-title">ToughLovePartner</h1>
        <p className="login-subtitle">
          Your accountability partner that pushes you to finish what you start.
        </p>
        <button className="btn-google" onClick={handleGoogleLogin}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width="18"
            height="18"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
