import { useState, useEffect } from "react";

export default function AdminDashboard({ session, logout }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, usersRes] = await Promise.all([
          fetch("http://localhost:3000/admin/stats?isAdmin=true"),
          fetch("http://localhost:3000/admin/users?isAdmin=true")
        ]);

        if (!statsRes.ok || !usersRes.ok) {
          setError("Failed to load admin data");
          return;
        }

        const [statsData, usersData] = await Promise.all([
          statsRes.json(),
          usersRes.json()
        ]);

        setStats(statsData);
        setUsers(usersData);
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="app">
        <header className="header">
          <h1 className="title">Admin Dashboard</h1>
          <button onClick={logout} className="btn_secondary">
            Logout
          </button>
        </header>
        <main className="grid">
          <section className="panel">
            <p className="muted">Loading admin data...</p>
          </section>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="header">
          <h1 className="title">Admin Dashboard</h1>
          <button onClick={logout} className="btn_secondary">
            Logout
          </button>
        </header>
        <main className="grid">
          <section className="panel">
            <p className="auth_error">{error}</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Admin Dashboard</h1>
        <button onClick={logout} className="btn_secondary">
          Logout
        </button>
      </header>

      <main className="grid grid_single">
        <section className="panel">
          <h2 className="panel_title">System Overview</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginTop: 20 }}>
            <div className="profile_info">
              <div className="stat">
                <span className="stat_label">Total Users</span>
                <span className="stat_value">{stats.totalUsers}</span>
              </div>
            </div>

            <div className="profile_info">
              <div className="stat">
                <span className="stat_label">Total Games</span>
                <span className="stat_value">{stats.totalGames}</span>
              </div>
            </div>

            <div className="profile_info">
              <div className="stat">
                <span className="stat_label">Total Hours</span>
                <span className="stat_value">{stats?.totalHours ?? 0}h</span>
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2 className="panel_title">Top 5 Games</h2>
          <div style={{ marginTop: 20 }}>
            {stats.topGames.map((game, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: 15, padding: 10, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                {game.image && (
                  <img 
                    src={game.image} 
                    alt={game.title}
                    style={{ width: 75, height: 40, objectFit: "cover", borderRadius: 4 }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", color: "#e9eaf2" }}>{game.title}</div>
                </div>
                <div className="pill">{game.totalHours}h</div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2 className="panel_title">Top 5 Genres</h2>
          <div style={{ marginTop: 20 }}>
            {stats.topGenres.map((genre, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <span style={{ textTransform: "capitalize", color: "#e9eaf2" }}>{genre.genre}</span>
                <span className="pill">{genre.totalHours}h</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2 className="panel_title">All Users and Their Games</h2>
          <div style={{ marginTop: 20 }}>
            {users && users.length === 0 ? (
              <div className="muted">No users found.</div>
            ) : (
              users?.map((user, index) => (
                <div key={index} style={{ marginBottom: 30, padding: 20, border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: 8, backgroundColor: "rgba(255, 255, 255, 0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                    <div>
                      <h3 style={{ margin: 0, color: "#e9eaf2" }}>{user.name}</h3>
                      <p style={{ margin: "5px 0", color: "#a6a8bd", fontSize: "0.9em" }}>{user.email}</p>
                      <div style={{ display: "flex", gap: 15, marginTop: 8 }}>
                        <span className="pill">{user.totalGames} games</span>
                        <span className="pill" style={{ background: "rgba(124, 92, 255, 0.18)" }}>{user.totalHours}h total</span>
                      </div>
                    </div>
                  </div>

                  {user.games.length === 0 ? (
                    <div className="muted">No games played yet.</div>
                  ) : (
                    <div style={{ display: "grid", gap: 10 }}>
                      <h4 style={{ margin: "10px 0 5px 0", fontSize: "0.9em", color: "#a6a8bd" }}>Games:</h4>
                      {user.games.map((game, gameIndex) => (
                        <div key={gameIndex} style={{ display: "flex", alignItems: "center", gap: 12, padding: 8, backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: 6, border: "1px solid rgba(255, 255, 255, 0.08)", alignItems: "center" }}>
                          {game.image ? (
                            <img 
                              src={game.image} 
                              alt={game.title}
                              style={{ width: 60, height: 32, objectFit: "cover", borderRadius: 4 }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'block';
                              }}
                            />
                          ) : null}
                          <div style={{ 
                            width: 60, 
                            height: 32, 
                            backgroundColor: "rgba(255, 255, 255, 0.1)", 
                            borderRadius: 4, 
                            display: game.image ? "none" : "block" 
                          }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "500", color: "#e9eaf2" }}>{game.title}</div>
                            {game.genre && <div style={{ fontSize: "0.8em", color: "#a6a8bd" }}>{game.genre}</div>}
                          </div>
                          <div className="pill" style={{ background: "rgba(124, 92, 255, 0.18)" }}>{game.hours}h</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}