"use client";

import { useEffect, useState } from "react";

const CART_EVENT = "curtis-book-cart-updated";

function readCart() {
  try {
    return JSON.parse(window.localStorage.getItem("curtis-book-cart") || "[]");
  } catch {
    return [];
  }
}

function writeCart(cart) {
  window.localStorage.setItem("curtis-book-cart", JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_EVENT));
}

export default function BookCart({ book }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const sync = () => setCart(readCart());
    sync();
    window.addEventListener(CART_EVENT, sync);
    return () => window.removeEventListener(CART_EVENT, sync);
  }, []);

  const addToCart = () => {
    const next = [...cart];
    const existing = next.find((item) => item.slug === book.slug);
    if (existing) existing.quantity += 1;
    else next.push({ slug: book.slug, title: book.title, quantity: 1 });
    writeCart(next);
    setCart(next);
    setError("");
    setIsOpen(true);
  };

  const updateQuantity = (slug, quantity) => {
    const next = cart
      .map((item) => item.slug === slug ? { ...item, quantity } : item)
      .filter((item) => item.quantity > 0);
    writeCart(next);
    setCart(next);
  };

  const checkout = async () => {
    setIsCheckingOut(true);
    setError("");
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.map(({ slug, quantity }) => ({ slug, quantity })) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout could not be started.");
      window.location.href = data.url;
    } catch (checkoutError) {
      setError(checkoutError.message);
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <button className="btn btn-buy" type="button" onClick={addToCart}>Buy Now <span aria-hidden="true">→</span></button>
      {isOpen && <div className="book-cart" role="dialog" aria-modal="true" aria-labelledby="book-cart-title">
        <button className="book-cart-backdrop" type="button" aria-label="Close cart" onClick={() => setIsOpen(false)} />
        <div className="book-cart-panel">
          <button className="book-cart-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close cart">×</button>
          <p className="kicker">Your cart</p>
          <h2 id="book-cart-title">Get Curtis&apos; books</h2>
          {cart.length === 0 ? <p>Your cart is empty.</p> : <>
            <div className="book-cart-items">
              {cart.map((item) => <div className="book-cart-item" key={item.slug}>
                <strong>{item.title}</strong>
                <label>Qty <input type="number" min="0" max="20" value={item.quantity} onChange={(event) => updateQuantity(item.slug, Number(event.target.value))} /></label>
              </div>)}
            </div>
            <p className="book-cart-note">Secure payment and shipping are completed through Stripe Checkout.</p>
            <button className="btn btn-gold" type="button" onClick={checkout} disabled={isCheckingOut}>{isCheckingOut ? "Opening checkout…" : "Continue to Checkout →"}</button>
            {error && <p className="book-cart-error" role="alert">{error}</p>}
          </>}
        </div>
      </div>}
    </>
  );
}
