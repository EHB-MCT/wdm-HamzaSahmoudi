import GameList from "../components/GameList.jsx";

export default function Dashboard({ session, profile, logout }) {
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
          <GameList games={[]} />
        </section>
      </main>
    </div>
  );
}
