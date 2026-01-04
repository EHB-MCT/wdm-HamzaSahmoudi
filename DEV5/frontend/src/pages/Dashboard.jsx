import { useEffect, useState } from "react";

export default function Dashboard({ session, logout, onLeaderboard, onAdmin, onCart }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editHours, setEditHours] = useState("");

  const [cartCount, setCartCount] = useState(0);
  const [recommendations, setRecommendations] = useState([]);

  async function loadDashboard() {
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

useEffect(() => {
    loadDashboard();
    loadCartCount();
    loadRecommendations();
  }, [session.uid]);

  // Recharger les recommandations quand on revient sur la page
  useEffect(() => {
    const handleFocus = () => {
      loadRecommendations();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [session.uid]);

  useEffect(() => {
    const q = query.trim();

    if (!isAdding) return;
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await fetch("http://localhost:3000/game-search?q=" + q);
        const json = await res.json();
        setResults(json || []);
      } catch (e) {
        setResults([]);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [query, isAdding]);

  async function addGame(game) {
    const hours = prompt("How many hours (approx)?", "0");
    if (hours === null) return;

    const res = await fetch("http://localhost:3000/dashboard/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: session.uid,
        gameId: String(game.id),
        title: game.name,
        image: game.image,
        hours: Number(hours || 0),
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      alert(json.message || "failed to add");
      return;
    }

    setQuery("");
    setResults([]);
    setShowSuggestions(false);
    setIsAdding(false);

    loadDashboard();
  }

  function startEdit(gameId, currentHours) {
    setEditingId(gameId);
    setEditHours(String(currentHours));
  }

  async function saveHours(gameId) {
    const res = await fetch("http://localhost:3000/dashboard/games/" + gameId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: session.uid,
        hours: Number(editHours || 0),
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      alert(json.message || "failed to update");
      return;
    }

    setEditingId(null);
    setEditHours("");
    loadDashboard();
  }

async function deleteGame(gameId) {
    const ok = confirm("Delete this game?");
    if (!ok) return;

    const res = await fetch("http://localhost:3000/dashboard/games/" + gameId, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: session.uid }),
    });

    const json = await res.json();
    if (!res.ok) {
      alert(json.message || "failed to delete");
      return;
    }

    loadDashboard();
  }

  async function loadCartCount() {
    try {
      const res = await fetch(`http://localhost:3000/cart?uid=${session.uid}`);
      const json = await res.json();
      if (res.ok) {
        setCartCount(json.count || 0);
      }
    } catch (e) {
      console.error("Failed to load cart count");
    }
  }

  async function loadRecommendations() {
    try {
      const res = await fetch(`http://localhost:3000/recommendations?uid=${session.uid}`);
      const json = await res.json();
      if (res.ok) {
        setRecommendations(json || []);
      }
    } catch (e) {
      console.error("Failed to load recommendations");
    }
  }

  async function addToCart(game) {
    const res = await fetch("http://localhost:3000/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: session.uid,
        gameId: game.gameId,
        title: game.title,
        image: game.image
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      alert(json.error || "failed to add to cart");
      return;
    }

    loadCartCount();
    loadRecommendations();
  }

  async function markNotInterested(gameId) {
    const res = await fetch("http://localhost:3000/recommendations/not-interested", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: session.uid,
        gameId
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      alert(json.error || "failed to mark as not interested");
      return;
    }

    // Retirer immédiatement du state
    setRecommendations(prev => {
      const filtered = prev.filter(game => game.gameId !== gameId);
      
      // Charger de nouvelles recommandations pour remplacer celle retirée
      setTimeout(() => {
        loadRefreshedRecommendations();
      }, 300);
      
      return filtered;
    });
  }

  async function loadRefreshedRecommendations() {
    try {
      const res = await fetch(`http://localhost:3000/recommendations/refresh?uid=${session.uid}`);
      const json = await res.json();
      if (res.ok && json.length > 0) {
        // Ajouter seulement 1 nouvelle recommandation aléatoire
        setRecommendations(prev => [...prev, ...json]);
      }
    } catch (e) {
      console.error("Failed to load refreshed recommendations");
    }
  }

  return (
    <div className="app">
      <header className="header header_dash">
        <div>
          <h1 className="title">My Games Dashboard</h1>

          <div className="session_info">
            <div className="session_line">
              Logged in as <span className="pill">{session.name}</span>
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

<div className="top_actions">
<button onClick={onCart} className="cart_btn" type="button" title="Cart">
    🛒 {cartCount > 0 && <span className="badge">{cartCount}</span>}
  </button>

          <div style={{ display: "flex", gap: 10 }}>
            {session.isAdmin && (
              <button
                onClick={onAdmin}
                className="btn_secondary"
                type="button"
              >
                Admin
              </button>
            )}

            <button
              onClick={onLeaderboard}
              className="btn_secondary"
              type="button"
            >
              Leaderboard
            </button>

            <button onClick={logout} className="btn_secondary" type="button">
              Logout
            </button>
          </div>
        </div>
      </header>

<main className="dash_cols">
          <section className="panel">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2 className="panel_title">Your games</h2>

            <button
              type="button"
              className="btn_primary"
              onClick={() => {
                setIsAdding(!isAdding);
                setQuery("");
                setResults([]);
              }}
            >
              {isAdding ? "Close" : "Add game"}
            </button>
          </div>

          {isAdding && (
            <div style={{ marginTop: 12 }}>
              <div className="auth_field" style={{ position: "relative" }}>
                <label>Search a game</label>
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Type a game name..."
                />

                {showSuggestions &&
                  query.trim().length >= 2 &&
                  results.length > 0 && (
                    <div className="suggestions">
                      {results.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          className="suggestion_item"
                          onClick={() => addGame(g)}
                        >
                          {g.image ? (
                            <img
                              className="suggestion_img"
                              src={g.image}
                              alt={g.name}
                            />
                          ) : (
                            <div className="suggestion_img_placeholder" />
                          )}
                          <span className="suggestion_title">{g.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          )}

          {error && <div className="auth_error">{error}</div>}
          {!data && <div className="muted">Loading...</div>}

          {data && data.playedGames.length === 0 && (
            <div className="muted">No games yet.</div>
          )}

          {data && data.playedGames.length > 0 && (
            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
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
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    {editingId === g.id ? (
                      <>
                        <input
                          type="number"
                          min="0"
                          value={editHours}
                          onChange={(e) => setEditHours(e.target.value)}
                          style={{ width: 90 }}
                        />
                        <button
                          type="button"
                          className="btn_primary"
                          onClick={() => saveHours(g.id)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn_secondary"
                          onClick={() => {
                            setEditingId(null);
                            setEditHours("");
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <div
                          className="pill"
                          style={{ background: "rgba(124, 92, 255, 0.18)" }}
                        >
                          {g.hours}h
                        </div>
                        <button
                          type="button"
                          className="btn_secondary"
                          onClick={() => startEdit(g.id, g.hours)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn_secondary"
                          onClick={() => deleteGame(g.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
</section>

          <section className="panel">
            <h2 className="panel_title">Recommendations</h2>
            
            {recommendations.length === 0 ? (
              <div className="muted">No recommendations available.</div>
            ) : (
              <div className="rec_grid">
                {recommendations.map((game) => (
                  <div key={game.gameId} className="rec_card">
                    <div className="rec_img_rect">
                      {game.image ? (
                        <img src={game.image} alt={game.title} />
                      ) : (
                        <div className="rec_img_placeholder" />
                      )}
                    </div>
                    <div className="rec_info">
                      <div className="rec_title">{game.title}</div>
                      <div className="rec_reason">{game.reason}</div>
                      <div className="rec_actions">
                        <button
                          type="button"
                          className="btn_primary"
                          onClick={() => addToCart(game)}
                        >
                          Add to cart
                        </button>
                        <button
                          type="button"
                          className="btn_secondary"
                          onClick={() => markNotInterested(game.gameId)}
                        >
                          Not interested
                        </button>
                      </div>
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
