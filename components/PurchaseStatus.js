"use client";

import { useEffect, useState } from "react";

const CART_KEY = "curtis-book-cart";
const CART_EVENT = "curtis-book-cart-updated";

export default function PurchaseStatus() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const purchase = params.get("purchase");
    if (!purchase) return;

    if (purchase === "success") {
      window.localStorage.removeItem(CART_KEY);
      window.dispatchEvent(new Event(CART_EVENT));
      setStatus("success");
    } else if (purchase === "cancelled") {
      setStatus("cancelled");
    }

    params.delete("purchase");
    const cleanQuery = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ""}`);
  }, []);

  if (!status) return null;

  return (
    <section className={`purchase-status purchase-status-${status}`} role="status" aria-live="polite">
      <div>
        <strong>{status === "success" ? "Your order is confirmed." : "Checkout was cancelled."}</strong>
        <p>{status === "success"
          ? "Thank you. Your payment was successful, and we’ll use the shipping details you provided to send your physical book."
          : "Your cart is still saved if you would like to complete your order."}</p>
      </div>
      <button type="button" onClick={() => setStatus("")} aria-label="Dismiss order message">×</button>
    </section>
  );
}
