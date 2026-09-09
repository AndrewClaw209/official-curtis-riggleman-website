"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const CART_KEY = "curtis-book-cart";
const CART_EVENT = "curtis-book-cart-updated";
const CART_OPEN_EVENT = "curtis-book-cart-open";
const PRICES = { digital: 19, physical: 29 };
const FORMAT_LABELS = { digital: "Digital Edition", physical: "Physical Book" };

function readCart() {
  try {
    return JSON.parse(window.localStorage.getItem(CART_KEY) || "[]").map((item) => ({
      ...item,
      format: item.format || "digital"
    }));
  } catch {
    return [];
  }
}

function writeCart(cart) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_EVENT));
}

export default function BookCart({ book, showTrigger = true }) {
  const pathname = usePathname();
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const [isChoosingFormat, setIsChoosingFormat] = useState(false);

  useEffect(() => {
    const sync = () => setCart(readCart());
    const openCart = () => setIsOpen(true);
    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener(CART_OPEN_EVENT, openCart);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener(CART_OPEN_EVENT, openCart);
    };
  }, []);

  const addToCart = (format) => {
    const next = [...cart];
    const existing = next.find((item) => item.slug === book.slug && item.format === format);
    if (existing) existing.quantity += 1;
    else next.push({ slug: book.slug, title: book.title, format, quantity: 1 });
    writeCart(next);
    setCart(next);
    setError("");
    setIsChoosingFormat(false);
    window.dispatchEvent(new Event(CART_OPEN_EVENT));
  };

  const updateQuantity = (slug, format, quantity) => {
    const next = cart
      .map((item) => item.slug === slug && item.format === format ? { ...item, quantity: Math.min(20, Math.max(0, Number(quantity) || 0)) } : item)
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
        body: JSON.stringify({ items: cart.map(({ slug, format, quantity }) => ({ slug, format, quantity })) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout could not be started.");
      window.location.href = data.url;
    } catch (checkoutError) {
      setError(checkoutError.message);
      setIsCheckingOut(false);
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.quantity * PRICES[item.format], 0);
  const normalizedPathname = pathname?.replace(/\/$/, "") || "";
  const canShowCartTrigger = ["/training-courses", "/merch"].includes(normalizedPathname);

  return (
    <>
      {showTrigger && book ? <div className="book-purchase-wrap">
        <button className="btn btn-buy" type="button" onClick={() => setIsChoosingFormat((open) => !open)} aria-expanded={isChoosingFormat}>
          {cart.length ? "Add to Cart" : "Buy Now"} <span aria-hidden="true">+</span>
        </button>
        {isChoosingFormat && <div className="book-purchase-options" role="dialog" aria-label={`Choose an edition of ${book.title}`}>
          <p>Choose your edition</p>
          <button type="button" onClick={() => addToCart("digital")}><span><strong>Digital</strong><small>Instant access</small></span><b>$19</b></button>
          <button type="button" onClick={() => addToCart("physical")}><span><strong>Physical</strong><small>Ships to you</small></span><b>$29</b></button>
        </div>}
      </div> : null}
      {!book && canShowCartTrigger ? <button className="cart-trigger" type="button" onClick={() => setIsOpen(true)} aria-label={`Open shopping cart, ${cartCount} items`}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 4h2l1.8 10.2a2 2 0 0 0 2 1.8h7.9a2 2 0 0 0 1.9-1.5L21 7H7" /><circle cx="10" cy="20" r="1.3" /><circle cx="18" cy="20" r="1.3" /></svg>
        <span className="cart-trigger-label">Cart</span><span className="cart-count" aria-hidden="true">{cartCount}</span>
      </button> : null}
      {!book && isOpen && <div className="book-cart" role="dialog" aria-modal="true" aria-labelledby="book-cart-title">
        <button className="book-cart-backdrop" type="button" aria-label="Close cart" onClick={() => setIsOpen(false)} />
        <div className="book-cart-panel">
          <button className="book-cart-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close cart">×</button>
          <p className="kicker">Your cart</p><h2 id="book-cart-title">Get Curtis&apos; books</h2>
          {cart.length === 0 ? <p>Your cart is empty.</p> : <>
            <div className="book-cart-items">
              {cart.map((item) => <div className="book-cart-item" key={`${item.slug}-${item.format}`}>
                <div><strong>{item.title}</strong><small>{FORMAT_LABELS[item.format]} · ${PRICES[item.format]} each</small></div>
                <div className="book-cart-quantity"><label>Qty <input type="number" min="0" max="20" value={item.quantity} onChange={(event) => updateQuantity(item.slug, item.format, event.target.value)} /></label><strong>${(item.quantity * PRICES[item.format]).toFixed(2)}</strong></div>
              </div>)}
            </div>
            <div className="book-cart-total"><span>Total</span><strong>${cartTotal.toFixed(2)}</strong></div>
            <p className="book-cart-note">Secure payment for your books will be completed through Stripe Checkout.</p>
            <button className="btn btn-gold" type="button" onClick={checkout} disabled={isCheckingOut}>{isCheckingOut ? "Opening checkout…" : "Continue to Checkout →"}</button>
            {error && <p className="book-cart-error" role="alert">{error}</p>}
          </>}
        </div>
      </div>}
    </>
  );
}
