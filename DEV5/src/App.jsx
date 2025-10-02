import { useEffect, useState } from "react";
import "./App.css";
import gamesData from "./games.json";
import GameList from "./components/GameList.jsx";
import GenreChart from "./components/GenreChart.jsx";

export default function App() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    setGames(gamesData);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">My Games Dashboard</h1>
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
