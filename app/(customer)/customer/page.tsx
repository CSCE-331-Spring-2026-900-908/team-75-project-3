"use client";

import { useState, useEffect } from "react";

interface MenuItem {
  itemid: number;
  itemname: string;
  category: string;
  price: number;
}

interface CartItem {
  item: string;
  price: number;
  addOns: string[];
}

const CATEGORIES = ["Classic Drink", "Fruit Drink", "Food"];

export default function CustomerPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMenu(data.filter((i: MenuItem) => i.category !== "Add-on"));
        } else {
          console.error("Menu API error:", data);
        }
      })
      .catch((err) => console.error("Failed to fetch menu:", err));
  }, []);

  const filtered = menu.filter((i) => i.category === activeCategory);
  const total = cart.reduce((s, i) => s + i.price, 0);

  function add(item: MenuItem) {
    setCart([...cart, { item: item.itemname, price: Number(item.price), addOns: [] }]);
  }

  async function placeOrder() {
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, total, source: "kiosk" }),
    });
    setCart([]);
    setOrderPlaced(true);
  }

  if (orderPlaced) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-2">Order placed</h1>
        <p className="text-muted mb-6">Thank you for your order.</p>
        <button
          onClick={() => setOrderPlaced(false)}
          className="rounded-lg bg-accent px-6 py-2 text-white font-medium hover:opacity-90 transition"
        >
          New Order
        </button>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col lg:flex-row">
      {/* Menu */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-display tracking-tight mb-6">Taro Root</h1>

        <div className="flex gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeCategory === cat
                  ? "bg-accent text-white"
                  : "bg-card border border-border text-muted hover:border-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((item) => (
            <button
              key={item.itemid}
              onClick={() => add(item)}
              className="text-left rounded-xl border border-border bg-card p-4 hover:border-accent hover:shadow-sm transition"
            >
              <div className="font-medium">{item.itemname}</div>
              <div className="text-sm text-muted mt-1">${Number(item.price).toFixed(2)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border bg-card p-6 flex flex-col">
        <h2 className="font-bold text-lg mb-4">Your Order</h2>

        {cart.length === 0 ? (
          <p className="text-muted text-sm flex-1">No items added yet.</p>
        ) : (
          <div className="flex-1 space-y-2 overflow-y-auto">
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span>{item.item}</span>
                <div className="flex items-center gap-2 text-muted">
                  <span>${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => setCart(cart.filter((_, j) => j !== i))}
                    className="hover:text-red-500 transition"
                    aria-label={`Remove ${item.item}`}
                  >
                    x
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-border pt-4 mt-4">
          <div className="flex justify-between font-bold mb-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={placeOrder}
            disabled={cart.length === 0}
            className="w-full rounded-lg bg-accent py-2.5 text-white font-medium hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Place Order
          </button>
        </div>
      </div>
    </main>
  );
}
