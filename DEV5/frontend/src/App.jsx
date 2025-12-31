import { useEffect, useState } from "react";
import "./App.css";
import gamesData from "./games.json";
import GameList from "./components/GameList.jsx";
import GenreChart from "./components/GenreChart.jsx";

export default function App() {
  const [games, setGames] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setGames(gamesData);
  }, []);

  useEffect(() => {
    async function loadProfile() {
      const uid = "user-test-001";
      const res = await fetch("http://localhost:3000/profile?uid=" + uid);
      const data = await res.json();
      setProfile(data);
    }

    loadProfile();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">My Games Dashboard</h1>

        {profile && (
          <div style={{ marginTop: 10, opacity: 0.9 }}>
            <div>UID: {profile.uid}</div>
            <div>Total hours: {profile.totalHours}</div>
            <div>Favorite genre: {profile.favoriteGenre}</div>
          </div>
        )}
      </header>

      <main className="grid">
        <section className="panel">
          <h2 className="panel_title">Games</h2>
          <GameList games={games} />
        </section>

        <section className="panel">
          <h2 className="panel_title">Games per Genre</h2>
          <GenreChart games={games} />
        </section>
      </main>
    </div>
  );
}
