import { useState, useEffect } from "react";

export default function AdminDashboard({ session, logout }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState(null);
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, usersRes, ordersRes] = await Promise.all([
          fetch("http://localhost:3000/admin/stats?isAdmin=true"),
          fetch("http://localhost:3000/admin/users?isAdmin=true"),
          fetch("http://localhost:3000/admin/orders")
        ]);

        if (!statsRes.ok || !usersRes.ok || !ordersRes.ok) {
          setError("Failed to load admin data");
          return;
        }

        const [statsData, usersData, ordersData] = await Promise.all([
          statsRes.json(),
          usersRes.json(),
          ordersRes.json()
        ]);

        setStats(statsData);
        setUsers(usersData);
        setOrders(ordersData);
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
          <h2 className="panel_title">Recent Orders</h2>
          <div style={{ marginTop: 20 }}>
            {orders && orders.length === 0 ? (
              <div className="muted">No orders found.</div>
            ) : (
              orders?.map((order, index) => (
                <div key={index} style={{ marginBottom: 20, padding: 16, border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: 8, backgroundColor: "rgba(255, 255, 255, 0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: "bold", color: "#e9eaf2" }}>{order.name}</div>
                      <div style={{ color: "#a6a8bd", fontSize: "0.9em" }}>{order.email}</div>
                      <div style={{ color: "#a6a8bd", fontSize: "0.8em", marginTop: 4 }}>
                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.8em", color: "#a6a8bd", marginBottom: 4 }}>Steam Code</div>
                      <div style={{ fontFamily: "monospace", fontSize: "0.9em", color: "#7c5cff" }}>{order.steamCode}</div>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ margin: "10px 0 8px 0", fontSize: "0.9em", color: "#a6a8bd" }}>
                      {order.items.length} {order.items.length === 1 ? "item" : "items"}:
                    </h4>
                    <div style={{ display: "grid", gap: 6 }}>
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} style={{ display: "flex", alignItems: "center", gap: 10, padding: 6, backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: 4 }}>
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.title}
                              style={{ width: 40, height: 24, objectFit: "cover", borderRadius: 3 }}
                            />
                          ) : (
                            <div style={{ width: 40, height: 24, backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: 3 }} />
                          )}
                          <div style={{ flex: 1, fontSize: "0.9em", color: "#e9eaf2" }}>{item.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
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