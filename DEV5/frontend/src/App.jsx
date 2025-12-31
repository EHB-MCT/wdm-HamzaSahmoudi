import { useEffect, useState } from "react";
import "./App.css";
import gamesData from "./games.json";
import GameList from "./components/GameList.jsx";

export default function App() {
  const [games, setGames] = useState([]);
  const [profile, setProfile] = useState(null);

  // auth
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");

  const [session, setSession] = useState(null);

  // onboarding step: "genre" | "done"
  const [onboardingStep, setOnboardingStep] = useState("done");
  const [preferredGenre, setPreferredGenre] = useState("");
  const [onboardingError, setOnboardingError] = useState("");

  // load session (refresh)
  useEffect(() => {
    const saved = localStorage.getItem("session");
    if (saved) setSession(JSON.parse(saved));
  }, []);

  // load local games file
  useEffect(() => {
    setGames(gamesData);
  }, []);

  // load profile when logged in
  useEffect(() => {
    async function loadProfile() {
      if (!session?.uid) return;

      const res = await fetch(
        "http://localhost:3000/profile?uid=" + session.uid
      );
      const data = await res.json();
      setProfile(data);

      // ✅ si pas encore de genre -> onboarding
      if (!data.favoriteGenre) {
        setOnboardingStep("genre");
      } else {
        setOnboardingStep("done");
        setPreferredGenre("");
        setProfile(null);
      }
    }

    loadProfile();
  }, [session]);

  async function handleSubmit(e) {
    e.preventDefault();
    setAuthError("");

    const isRegister = mode === "register";

    const url = isRegister
      ? "http://localhost:3000/auth/register"
      : "http://localhost:3000/auth/login";

    const payload = isRegister
      ? { email, password, name }
      : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.message || "auth failed");
        return;
      }

      setSession(data);
      localStorage.setItem("session", JSON.stringify(data));
      setProfile(null);

      // ✅ IMPORTANT: si c'est register => on va au onboarding genre
      if (isRegister) {
        setOnboardingStep("genre");
      } else {
        setOnboardingStep("done");
      }

      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      setAuthError("network error (backend running?)");
    }
  }

  function logout() {
    setSession(null);
    setProfile(null);
    setAuthError("");
    localStorage.removeItem("session");

    setOnboardingStep("done");
    setPreferredGenre("");
    setOnboardingError("");
  }

  // influence games list based on favorite genre (profile)
  let influencedGames = games;
  if (profile) {
    influencedGames = [
      ...games.filter((g) => g.genre === profile.favoriteGenre),
      ...games.filter((g) => g.genre !== profile.favoriteGenre),
    ];
  }

  // ---------- AUTH SCREEN ----------
  if (!session) {
    return (
      <div className="app app_auth">
        <header className="header header_auth">
          <div>
            <h1 className="title">Games Tracker</h1>
            <p className="subtitle">
              Track what you played. The app learns your preferences.
            </p>
          </div>

          <div className="mode_tabs">
            <button
              className={mode === "login" ? "tab tab_active" : "tab"}
              onClick={() => setMode("login")}
              type="button"
            >
              Login
            </button>
            <button
              className={mode === "register" ? "tab tab_active" : "tab"}
              onClick={() => setMode("register")}
              type="button"
            >
              Register
            </button>
          </div>
        </header>

        <main className="auth_wrap">
          <section className="panel panel_auth">
            <h2 className="panel_title">
              {mode === "register" ? "Create your account" : "Welcome back"}
            </h2>

            <form onSubmit={handleSubmit} className="auth_form">
              {mode === "register" && (
                <div className="auth_field">
                  <label>Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
              )}

              <div className="auth_field">
                <label>Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                />
              </div>

              <div className="auth_field">
                <label>Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  type="password"
                />
              </div>

              {authError && <div className="auth_error">{authError}</div>}

              <button className="btn_primary" type="submit">
                {mode === "register" ? "Create account" : "Login"}
              </button>
            </form>
          </section>
        </main>
      </div>
    );
  }

  // ---------- ONBOARDING STEP 1 ----------
  async function saveGenre() {
    setOnboardingError("");

    if (!preferredGenre) {
      setOnboardingError("Please select a genre.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/onboarding/genre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: session.uid,
          preferredGenre: preferredGenre,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOnboardingError(data.message || "failed to save genre");
        return;
      }

      // ✅ step 1 done → on va au dashboard
      setOnboardingStep("done");
    } catch (err) {
      setOnboardingError("network error (backend running?)");
    }
  }

  if (onboardingStep === "genre") {
    return (
      <div className="app app_auth">
        <main className="auth_wrap">
          <section className="panel panel_auth">
            <h2 className="panel_title">Question 1 / 3</h2>
            <p className="subtitle" style={{ marginTop: 8 }}>
              What genre do you prefer the most?
            </p>

            <div className="auth_form">
              <div className="auth_field">
                <label>Favorite genre</label>
                <select
                  value={preferredGenre}
                  onChange={(e) => setPreferredGenre(e.target.value)}
                >
                  <option value="">Select a genre...</option>
                  <option value="Action">Action</option>
                  <option value="RPG">RPG</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Shooter">Shooter</option>
                  <option value="Sandbox">Sandbox</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Sports">Sports</option>
                  <option value="Simulation">Simulation</option>
                  <option value="Horror">Horror</option>
                  <option value="Puzzle">Puzzle</option>
                </select>
              </div>

              {onboardingError && (
                <div className="auth_error">{onboardingError}</div>
              )}

              <button className="btn_primary" type="button" onClick={saveGenre}>
                Next
              </button>

              {onboardingStep === "done" && (
                <button
                  onClick={logout}
                  className="btn_secondary"
                  type="button"
                >
                  Logout
                </button>
              )}
            </div>
          </section>
        </main>
      </div>
    );
  }

  // ---------- DASHBOARD ----------
  return (
    <div className="app">
      <header className="header header_dash">
        <div>
          <h1 className="title">My Games Dashboard</h1>

          <div className="session_info">
            <div className="session_line">
              Logged in as{" "}
              <span className="pill">{session.name || "User"}</span>{" "}
              <span className="muted">({session.email})</span>
            </div>
            <div className="session_line">
              UID: <span className="mono">{session.uid}</span>
            </div>
          </div>

          {profile && (
            <div className="profile_info">
              <div className="stat">
                <span className="stat_label">Total hours</span>
                <span className="stat_value">{profile.totalHours}</span>
              </div>
              <div className="stat">
                <span className="stat_label">Favorite genre</span>
                <span className="stat_value">{profile.favoriteGenre}</span>
              </div>
            </div>
          )}
        </div>

        <button onClick={logout} className="btn_secondary" type="button">
          Logout
        </button>
      </header>

      <main className="grid grid_single">
        <section className="panel">
          <h2 className="panel_title">Games</h2>
          <GameList games={influencedGames} />
        </section>
      </main>
    </div>
  );
}
