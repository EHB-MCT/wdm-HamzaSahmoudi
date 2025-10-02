import "./GameList.css";

function GameList({ games = [] }) {
  const items = [];

  for (let i = 0; i < games.length; i++) {
    const g = games[i];
    items.push(
      <li key={i} className="item">
        <h3 className="title">{g.title}</h3>
        <p className="info">
          <span className="tag">{g.genre}</span>
          <span>Rating: {g.rating}</span>
          <span>Playtime: {g.playtime}h</span>
        </p>
      </li>
    );
  }

  return <ul className="list">{items}</ul>;
}

export default GameList;
