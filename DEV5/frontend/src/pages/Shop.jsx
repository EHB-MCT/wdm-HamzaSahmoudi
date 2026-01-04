import { useEffect, useState } from "react";

export default function Shop({ session, onBack }) {
  const [view, setView] = useState("cart");
  const [cart, setCart] = useState(null);
  const [orders, setOrders] = useState(null);
  const [steamCode, setSteamCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadCart() {
    setError("");
    try {
      const res = await fetch(`http://localhost:3000/cart?uid=${session.uid}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "failed to load cart");
        return;
      }

      setCart(json);
    } catch (e) {
      setError("backend not running?");
    }
  }

  async function loadOrders() {
    setError("");
    try {
      const res = await fetch(`http://localhost:3000/orders?uid=${session.uid}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "failed to load orders");
        return;
      }

      setOrders(json);
    } catch (e) {
      setError("backend not running?");
    }
  }

  useEffect(() => {
    if (view === "cart") {
      loadCart();
    } else if (view === "orders") {
      loadOrders();
    }
  }, [view, session.uid]);

  async function removeFromCart(gameId) {
    const res = await fetch(`http://localhost:3000/cart/remove/${gameId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: session.uid }),
    });

    const json = await res.json();
    if (!res.ok) {
      alert(json.error || "failed to remove item");
      return;
    }

    loadCart();
  }

  async function checkout() {
    if (!cart || cart.items.length === 0) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: session.uid }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "failed to checkout");
        return;
      }

      setSteamCode(json.steamCode);
      setView("thankyou");
    } catch (e) {
      setError("checkout failed");
    } finally {
      setLoading(false);
    }
  }

  function CartView() {
    return (
      <>
        <div style={{ marginBottom: 20 }}>
          <h3>
            {cart.count} {cart.count === 1 ? "item" : "items"} in cart
          </h3>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {cart.items.map((item) => (
            <div key={item.gameId} className="cart_row">
              <div className="cart_item">
                {item.image ? (
                  <img
                    className="cart_img"
                    src={item.image}
                    alt={item.title}
                  />
                ) : (
                  <div className="cart_img_placeholder" />
                )}
                <div className="cart_title">{item.title}</div>
              </div>

              <button
                type="button"
                className="btn_secondary"
                onClick={() => removeFromCart(item.gameId)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, textAlign: "right" }}>
          <button
            type="button"
            className="btn_primary"
            onClick={checkout}
            disabled={loading}
          >
            {loading ? "Processing..." : "Checkout"}
          </button>
        </div>
      </>
    );
  }

  function ThankYouView() {
    return (
      <div className="thank_card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ marginBottom: 8 }}>Thank you for your purchase!</h2>
          <p className="muted">Your order has been processed successfully.</p>
        </div>

        <div style={{ background: "rgba(124, 92, 255, 0.1)", padding: 16, borderRadius: 8, marginBottom: 24 }}>
          <div style={{ fontSize: 12, textTransform: "uppercase", marginBottom: 4, opacity: 0.7 }}>
            Steam Code
          </div>
          <div style={{ fontSize: 20, fontWeight: "bold", fontFamily: "monospace", letterSpacing: 1 }}>
            {steamCode}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <p className="muted" style={{ marginBottom: 16 }}>
            This code can be redeemed on Steam to access your games.
          </p>
          <button onClick={() => setView("cart")} className="btn_primary" type="button">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  function OrdersView() {
    return (
      <>
        <div style={{ marginBottom: 20 }}>
          <h3>Your Orders</h3>
        </div>

        {orders.length === 0 ? (
          <div className="muted">No orders found.</div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {orders.map((order) => (
              <div key={order._id} className="panel" style={{ padding: 16 }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, textTransform: "uppercase", marginBottom: 4, opacity: 0.7 }}>
                    Order ID
                  </div>
                  <div style={{ fontSize: 14, fontWeight: "bold" }}>
                    {order._id}
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, textTransform: "uppercase", marginBottom: 4, opacity: 0.7 }}>
                    Steam Code
                  </div>
                  <div style={{ fontSize: 16, fontWeight: "bold", fontFamily: "monospace", letterSpacing: 1 }}>
                    {order.steamCode}
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, textTransform: "uppercase", marginBottom: 4, opacity: 0.7 }}>
                    Items ({order.items.length})
                  </div>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      {item.image && (
                        <img src={item.image} alt={item.title} style={{ width: 24, height: 24, objectFit: "cover" }} />
                      )}
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <div className="app">
      <header className="header header_dash">
        <div>
          <h1 className="title">
            {view === "cart" && "Shopping Cart"}
            {view === "thankyou" && "Order Complete!"}
            {view === "orders" && "My Orders"}
          </h1>
          <div className="session_info">
            <div className="session_line">
              Logged in as <span className="pill">{session.name}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setView("cart")} className={view === "cart" ? "btn_primary" : "btn_secondary"} type="button">
            Cart
          </button>
          <button onClick={() => setView("orders")} className={view === "orders" ? "btn_primary" : "btn_secondary"} type="button">
            Orders
          </button>
          <button onClick={onBack} className="btn_secondary" type="button">
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="cart_page">
        <section className="panel">
          {error && <div className="auth_error">{error}</div>}
          
          {view === "cart" && !cart && <div className="muted">Loading...</div>}
          {view === "orders" && !orders && <div className="muted">Loading...</div>}

          {view === "cart" && cart && cart.items.length === 0 && (
            <div className="muted">Your cart is empty.</div>
          )}

          {view === "cart" && cart && cart.items.length > 0 && <CartView />}
          {view === "thankyou" && <ThankYouView />}
          {view === "orders" && orders && <OrdersView />}
        </section>
      </main>
    </div>
  );
}