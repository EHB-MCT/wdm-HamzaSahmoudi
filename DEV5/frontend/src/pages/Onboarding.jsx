import { useEffect, useState } from "react";

export default function Onboarding({
  session,
  onFinish,
  step,
  setStep,
  preferredGenre,
  setPreferredGenre,
  selectedGames,
  setSelectedGames,
}) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [hoursById, setHoursById] = useState({});

  useEffect(() => {
    if (step !== 3) return;

    const init = {};
    selectedGames.forEach((g) => {
      init[g.id] = hoursById[g.id] ?? 1;
    });
    setHoursById(init);
  }, [step]);

  useEffect(() => {
    const q = query.trim();
    setSearchError("");

    if (q.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("http://localhost:3000/game-search?q=" + q);
        const data = await res.json();

        const mapped = (data || []).map((g) => ({
          id: String(g.id),
          title: g.name,
          image: g.image,
        }));

        setSearchResults(mapped);
      } catch (e) {
        setSearchError("backend not running?");
        setSearchResults([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  function addGame(game) {
    const exists = selectedGames.some((g) => g.id === game.id);
    if (exists) return;

    setSelectedGames([...selectedGames, game]);
    setQuery("");
    setSearchResults([]);
    setShowSuggestions(false);
  }

  function removeGame(id) {
    setSelectedGames(selectedGames.filter((g) => g.id !== id));
  }

  async function finishOnboarding() {
    const playedGames = selectedGames.map((g) => ({
      gameId: g.id,
      title: g.title,
      image: g.image,
      hours: Number(hoursById[g.id] || 0),
    }));

    const res = await fetch("http://localhost:3000/onboarding/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: session.uid,
        favoriteGenre: preferredGenre,
        playedGames,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "save failed");
      return;
    }

    onFinish();
  }

  if (step === 1) {
    return (
      <div className="app app_auth">
        <main className="auth_wrap">
          <section className="panel panel_auth">
            <div className="muted">Question 1 / 3</div>
            <h2 className="panel_title" style={{ marginTop: 6 }}>
              What genre do you prefer the most?
            </h2>

            <div className="auth_form">
              <div className="auth_field">
                <label>Favorite genre</label>
                <select
                  value={preferredGenre}
                  onChange={(e) => setPreferredGenre(e.target.value)}
                >
                  <option value="">Select a genre...</option>
                  <option value="Action">Action</option>
                  <option value="RPG">RPG</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Shooter">Shooter</option>
                  <option value="Sandbox">Sandbox</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Sports">Sports</option>
                  <option value="Simulation">Simulation</option>
                  <option value="Horror">Horror</option>
                  <option value="Puzzle">Puzzle</option>
                </select>
              </div>

              <button
                className="btn_primary"
                type="button"
                disabled={!preferredGenre}
                onClick={() => setStep(2)}
              >
                Next
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="app app_auth">
        <main className="auth_wrap">
          <section className="panel panel_auth">
            <div className="muted">Question 2 / 3</div>
            <h2 className="panel_title" style={{ marginTop: 6 }}>
              What games are you playing right now on Steam?
            </h2>

            <div className="auth_form">
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
                  searchResults.length > 0 && (
                    <div className="suggestions">
                      {searchResults.map((g) => (
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
                              alt={g.title}
                            />
                          ) : (
                            <div className="suggestion_img_placeholder" />
                          )}
                          <span className="suggestion_title">{g.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
              </div>

              {searchError && <div className="auth_error">{searchError}</div>}

              <div style={{ marginTop: 6, display: "grid", gap: 10 }}>
                <div className="muted">Selected games</div>

                {selectedGames.length === 0 ? (
                  <div className="muted">No games selected yet.</div>
                ) : (
                  selectedGames.map((g) => (
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

                      <button
                        className="btn_secondary"
                        type="button"
                        onClick={() => removeGame(g.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button
                className="btn_primary"
                type="button"
                disabled={selectedGames.length === 0}
                onClick={() => setStep(3)}
              >
                Next
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="app app_auth">
        <main className="auth_wrap">
          <section className="panel panel_auth">
            <div className="muted">Question 3 / 3</div>
            <h2 className="panel_title" style={{ marginTop: 6 }}>
              Approximately how many hours did you play?
            </h2>

            <div className="auth_form">
              {selectedGames.map((g) => (
                <div className="hours_row" key={g.id}>
                  <div className="hours_left">
                    {g.image ? (
                      <img className="hours_img" src={g.image} alt={g.title} />
                    ) : (
                      <div className="hours_img_placeholder" />
                    )}
                    <div className="hours_title">{g.title}</div>
                  </div>

                  <input
                    className="hours_input"
                    type="number"
                    min="0"
                    value={hoursById[g.id] ?? 1}
                    onChange={(e) =>
                      setHoursById({ ...hoursById, [g.id]: e.target.value })
                    }
                  />
                </div>
              ))}

              <button
                className="btn_primary"
                type="button"
                onClick={finishOnboarding}
              >
                Finish
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return null;
}
