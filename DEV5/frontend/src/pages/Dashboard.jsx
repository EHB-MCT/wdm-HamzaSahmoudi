import { useEffect, useState } from "react";

export default function Dashboard({ session, onLogout }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setError("");
      try {
        const res = await fetch(
          "http://localhost:3000/dashboard?uid=" + session.uid
        );
        const json = await res.json();

        if (!res.ok) {
          setError(json.message || "failed to load dashboard");
          return;
        }

        setData(json);
      } catch (e) {
        setError("backend not running?");
      }
    }

    load();
  }, [session.uid]);

  return (
    <div className="app">
      <header className="header header_dash">
        <div>
          <h1 className="title">My Games Dashboard</h1>

          <div className="session_info">
            <div className="session_line">
              Logged in as <span className="pill">{session.name}</span>{" "}
              <span className="muted">({session.email})</span>
            </div>
            <div className="session_line">
              UID: <span className="mono">{session.uid}</span>
            </div>
          </div>

          {data && (
            <div className="profile_info">
              <div className="stat">
                <span className="stat_label">Total hours</span>
                <span className="stat_value">{data.totalHours}</span>
              </div>
              <div className="stat">
                <span className="stat_label">Favorite genre</span>
                <span className="stat_value">{data.favoriteGenre || "-"}</span>
              </div>
            </div>
          )}
        </div>

        <button onClick={onLogout} className="btn_secondary" type="button">
          Logout
        </button>
      </header>

      <main className="grid grid_single">
        <section className="panel">
          <h2 className="panel_title">Your games</h2>

          {error && <div className="auth_error">{error}</div>}

          {!data && <div className="muted">Loading...</div>}

          {data && data.playedGames.length === 0 && (
            <div className="muted">No games yet.</div>
          )}

          {data && data.playedGames.length > 0 && (
            <div style={{ display: "grid", gap: 10 }}>
              {data.playedGames.map((g) => (
                <div className="selected_row" key={g.id}>
                  <div className="selected_left">
                    {g.image ? (
                      <img
                        className="selected_img"
                        src={g.image}
                        alt={g.title}
                      />
                    ) : (
                      <div className="selected_img_placeholder" />
                    )}
                    <div className="selected_title">{g.title}</div>
                  </div>

                  <div
                    className="pill"
                    style={{ background: "rgba(124, 92, 255, 0.18)" }}
                  >
                    {g.hours}h
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
