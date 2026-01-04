export default function AuthPage({
  mode,
  setMode,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  authError,
  onSubmit,
  setSession,
  adminEmail,
  setAdminEmail,
  adminPassword,
  setAdminPassword,
  adminAuthError,
  onAdminSubmit,
}) {
  function handleAdminMode() {
    setMode("admin-login");
  }

  return (
    <div className="app app_auth">
      <header className="header header_auth">
        <div>
          <h1 className="title">Games Tracker</h1>
          <p className="subtitle">Create an account and track your games.</p>
        </div>

        <div className="mode_tabs">
          <button
            className={mode === "login" ? "tab tab_active" : "tab"}
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={mode === "register" ? "tab tab_active" : "tab"}
            onClick={() => setMode("register")}
            type="button"
          >
            Register
          </button>
          <button
            className={mode === "admin-login" ? "tab tab_active" : "tab"}
            onClick={handleAdminMode}
            type="button"
          >
            Admin
          </button>
        </div>
      </header>

      <main className="auth_wrap">
        <section className="panel panel_auth">
          <h2 className="panel_title">
            {mode === "register" ? "Create your account" : 
             mode === "admin-login" ? "Admin Login" : "Welcome back"}
          </h2>

          {mode === "admin-login" ? (
            <form onSubmit={onAdminSubmit} className="auth_form">
              <div className="auth_field">
                <label>Admin Email</label>
                <input
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin email"
                  type="email"
                />
              </div>

              <div className="auth_field">
                <label>Admin Password</label>
                <input
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="admin password"
                  type="password"
                />
              </div>

              {adminAuthError && <div className="auth_error">{adminAuthError}</div>}

              <button className="btn_primary" type="submit">
                Admin Login
              </button>
            </form>
          ) : (
            <form onSubmit={onSubmit} className="auth_form">
              {mode === "register" && (
                <div className="auth_field">
                  <label>Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
              )}

              <div className="auth_field">
                <label>Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                />
              </div>

              <div className="auth_field">
                <label>Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  type="password"
                />
              </div>

              {authError && <div className="auth_error">{authError}</div>}

              <button className="btn_primary" type="submit">
                {mode === "register" ? "Create account" : "Login"}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}