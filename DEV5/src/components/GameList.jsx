import "./GameList.css";

function GameList({ games = [] }) {
  return (
    <ul className="list">
      {games.map((g, i) => (
        <li key={i} className="item">
          <h3 className="title">{g.title}</h3>
          <p className="info">
            <span className="tag">{g.genre}</span>
            <span>Rating: {g.rating}</span>
            <span>Playtime: {g.playtime}h</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

export default GameList;
