"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TopBar from "@/app/checkout/parts/topBar"

// --- Interfaces ---
interface Seat {
  id: string;
  type: string; // e.g. "ADULT", "CHILD", "SENIOR"
}

interface Ticket {
  id: string;
  ticket_price: number;
  ticket_type: string;
}

interface Config {
  booking_fee: number;
  tax_rate: number;
}

interface PromoCode {
  code: string;
  discount_percentage: number; // e.g., 10 means 10%
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const movieTitle = searchParams.get("movieTitle");
  const showtimeId = searchParams.get("showtimeId");
  const startTime = searchParams.get("startTime");

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [config, setConfig] = useState<Config[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);

  // Promo input
  const [enteredCode, setEnteredCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoMessage, setPromoMessage] = useState("");

  // Parse selected seats from query params
  useEffect(() => {
    try {
      const raw = searchParams.get("seats");
      const parsed = raw ? JSON.parse(decodeURIComponent(raw)) : [];
      setSeats(parsed);
    } catch (e) {
      console.error("Error parsing seats:", e);
      setSeats([]);
    }
  }, [searchParams]);

  // Fetch tickets, config, and promo codes
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ticketRes, configRes, promoRes] = await Promise.all([
          fetch("http://localhost:8080/api/tickets"),
          fetch("http://localhost:8080/api/fees-and-taxes"),
          fetch("http://localhost:8080/api/promotion-codes"),
        ]);

        const [ticketData, configData, promoData] = await Promise.all([
          ticketRes.json(),
          configRes.json(),
          promoRes.json(),
        ]);

        setTickets(ticketData);
        setConfig(configData);
        setPromoCodes(promoData);
      } catch (e) {
        console.error("Failed to fetch data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading)
    return <p style={{ color: "white" }}>Loading checkout information...</p>;
  if (!config.length)
    return <p style={{ color: "white" }}>Failed to load pricing configuration.</p>;

  // --- Calculations ---
  const calculateSubtotal = (): number =>
    seats.reduce((sum, seat) => {
      const ticket = tickets.find(
        (t) => t.ticket_type.toUpperCase() === seat.type.toUpperCase()
      );
      return sum + (ticket ? ticket.ticket_price : 0);
    }, 0);

  const subtotal = calculateSubtotal();
  const bookingTotal = (config[0].booking_fee ?? 0) * seats.length;
  const tax = (subtotal + bookingTotal) * (config[0].tax_rate ?? 0);
  const preDiscountTotal = subtotal + bookingTotal + tax;

  // Apply discount if promo applied
  const discount =
    appliedPromo && appliedPromo.discount_percentage
      ? (preDiscountTotal * appliedPromo.discount_percentage)
      : 0;

  const total = preDiscountTotal - discount;

  // --- Handlers ---
  const handleApplyPromo = () => {
    const found = promoCodes.find(
      (p) => p.code.toUpperCase() === enteredCode.trim().toUpperCase()
    );

    if (found) {
      setAppliedPromo(found);
      setPromoMessage(`Promo applied! ${found.discount_percentage * 100}% off`);
    } else {
      setAppliedPromo(null);
      setPromoMessage("Invalid promo code.");
    }
  };

  const handleConfirm = async () => {
    try {
      const bookingData = {
        movieTitle,
        showtimeId,
        seats,
        subtotal,
        bookingFee: config[0].booking_fee,
        taxRate: config[0].tax_rate,
        promoCode: appliedPromo ? appliedPromo.code : null,
        discountPercentage: appliedPromo ? appliedPromo.discount_percentage : 0,
        total,
      };

      await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      alert(`Booking confirmed for ${movieTitle}!`);
      router.push("/");
    } catch (err) {
      console.error("Error confirming booking:", err);
    }
  };

  // --- JSX UI ---
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: "#150707",
        color: "white",
      }}
    >
      <TopBar/>

      <div
        style={{
          backgroundColor: "#2b0f0f",
          padding: "2rem",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "600px",
          boxShadow: "0 0 10px rgba(255,255,255,0.2)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Checkout Summary
        </h1>

        <div style={{ marginBottom: "1rem" }}>
          <p><strong>Movie:</strong> {movieTitle}</p>
          <p><strong>Showtime:</strong> {startTime}</p>
          <p><strong>Showtime ID:</strong> {showtimeId}</p>
          <p>
            <strong>Seats:</strong>{" "}
            {seats.map((s) => `${s.id} (${s.type})`).join(", ")}
          </p>
        </div>

        <hr style={{ margin: "1rem 0" }} />

        {/* --- Ticket breakdown --- */}
        <div style={{ lineHeight: "1.8" }}>
          <h3>Ticket Breakdown:</h3>
          {seats.map((seat, i) => {
            const ticket = tickets.find(
              (t) => t.ticket_type.toUpperCase() === seat.type.toUpperCase()
            );
            return (
              <p key={i}>
                Seat {seat.id} – {seat.type}: $
                {ticket ? ticket.ticket_price.toFixed(2) : "N/A"}
              </p>
            );
          })}

          <hr style={{ margin: "1rem 0" }} />
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>
            Booking Fee (${config[0].booking_fee.toFixed(2)} × {seats.length}) = $
            {bookingTotal.toFixed(2)}
          </p>
          <p>
            Tax ({(config[0].tax_rate * 100).toFixed(2)}%): ${tax.toFixed(2)}
          </p>

          {appliedPromo && (
            <p style={{ color: "#00ff99" }}>
              Promo Discount ({appliedPromo.discount_percentage * 100}%): -$
              {discount.toFixed(2)}
            </p>
          )}

          <h2>Total: ${total.toFixed(2)}</h2>
        </div>

        {/* --- Promo Code Input --- */}
        <div style={{ marginTop: "1.5rem" }}>
          <label htmlFor="promo" style={{ fontWeight: "bold" }}>
            Have a promo code?
          </label>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <input
              id="promo"
              type="text"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
              placeholder="Enter promo code"
              style={{
                flex: 1,
                padding: "0.5rem",
                borderRadius: "4px",
                border: "none",
              }}
            />
            <button
              onClick={handleApplyPromo}
              style={{
                backgroundColor: "#0070f3",
                border: "none",
                borderRadius: "6px",
                color: "white",
                fontWeight: "bold",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              Apply
            </button>
          </div>
          {promoMessage && (
            <p
              style={{
                color: appliedPromo ? "#00ff99" : "#ff5555",
                marginTop: "0.5rem",
              }}
            >
              {promoMessage}
            </p>
          )}
        </div>

        <button
          onClick={handleConfirm}
          style={{
            marginTop: "1.5rem",
            width: "100%",
            padding: "1rem",
            backgroundColor: "#00b14f",
            border: "none",
            borderRadius: "6px",
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Confirm & Pay
        </button>
      </div>
    </main>
  );
}
