import { useEffect, useState } from "react";

export default function Leaderboard({ onBack }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setError("");
      try {
        const res = await fetch("http://localhost:3000/leaderboard?limit=10");
        const json = await res.json();

        if (!res.ok) {
          setError(json.message || "failed to load leaderboard");
          return;
        }

        setData(json);
      } catch (e) {
        setError("backend not running?");
      }
    }

    load();
  }, []);

  return (
    <div className="app">
      <header className="header header_dash">
        <div>
          <h1 className="title">Leaderboard</h1>
          <p className="subtitle">
            Most played games by total hours played by all users
          </p>
        </div>

        <button onClick={onBack} className="btn_secondary" type="button">
          Back
        </button>
      </header>

      <main className="grid grid_single">
        <section className="panel">
          <h2 className="panel_title">Top games</h2>

          {error && <div className="auth_error">{error}</div>}
          {!data && !error && <div className="muted">Loading...</div>}

          {data && data.topGamesByHours.length === 0 && (
            <div className="muted">No data yet.</div>
          )}

          {data && data.topGamesByHours.length > 0 && (
            <div style={{ display: "grid", gap: 10 }}>
              {data.topGamesByHours.map((g, index) => (
                <div className="selected_row" key={g.gameId}>
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

                    <div>
                      <div className="selected_title">
                        #{index + 1} {g.title}
                      </div>
                      <div
                        className="muted"
                        style={{ fontSize: 13, marginTop: 2 }}
                      >
                        Players: {g.players}
                      </div>
                    </div>
                  </div>

                  <div
                    className="pill"
                    style={{ background: "rgba(124, 92, 255, 0.18)" }}
                  >
                    {g.totalHours}h
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <h2 className="panel_title">Top genres</h2>

          {data && data.topGenresByHours && data.topGenresByHours.length > 0 ? (
            <div style={{ display: "grid", gap: 10 }}>
              {data.topGenresByHours.map((g, index) => (
                <div className="selected_row" key={g.genre}>
                  <div className="selected_title">
                    #{index + 1} {g.genre}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="muted">No genres yet.</div>
          )}
        </section>
      </main>
    </div>
  );
}
