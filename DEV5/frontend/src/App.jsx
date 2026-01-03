import { useEffect, useState } from "react";
import "./App.css";
import AuthPage from "./pages/AuthPage.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";

export default function App() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  const [view, setView] = useState("dashboard");

  const [step, setStep] = useState(1);
  const [selectedGames, setSelectedGames] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("session");
    if (saved) setSession(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (session) localStorage.setItem("session", JSON.stringify(session));
    else localStorage.removeItem("session");
  }, [session]);

  useEffect(() => {
    async function loadProfile() {
      if (!session?.uid) return;

      const res = await fetch(
        "http://localhost:3000/profile?uid=" + session.uid
      );
      const data = await res.json();
      setProfile(data);

      if (!data.playedGames || data.playedGames.length === 0) {
        setStep(1);
      } else {
        setStep(3);
      }
    }

    loadProfile();
  }, [session]);

  async function onSubmit(e) {
    e.preventDefault();
    setAuthError("");

    try {
      const url =
        mode === "register"
          ? "http://localhost:3000/auth/register"
          : "http://localhost:3000/auth/login";

      const body =
        mode === "register" ? { email, password, name } : { email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.message || "auth failed");
        return;
      }

      setSession(data);
      setProfile(null);

      if (mode === "register") {
        setStep(1);
        setSelectedGames([]);
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
    setStep(1);
    setSelectedGames([]);
    setView("dashboard");
  }

  if (!session) {
    return (
      <AuthPage
        mode={mode}
        setMode={setMode}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        name={name}
        setName={setName}
        authError={authError}
        onSubmit={onSubmit}
      />
    );
  }

  if (step <= 2) {
    return (
      <Onboarding
        session={session}
        onFinish={() => {
          setStep(3);
          setProfile(null);
        }}
        step={step}
        setStep={setStep}
        selectedGames={selectedGames}
        setSelectedGames={setSelectedGames}
      />
    );
  }

  if (view === "leaderboard") {
    return <Leaderboard onBack={() => setView("dashboard")} />;
  }

  return (
    <Dashboard
      session={session}
      profile={profile}
      logout={logout}
      onLeaderboard={() => setView("leaderboard")}
    />
  );
}
