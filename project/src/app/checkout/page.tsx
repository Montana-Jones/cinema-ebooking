"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TopBar from "@/app/checkout/parts/topBar";

// --- Interfaces ---
interface Seat {
  id: string;
  type: string;
}

interface Ticket {
  id: string;
  ticket_price: number;
  ticket_type: string;
}
interface booking { 
  id: string; 
  movie_title: string; 
  showtime_id: string; 
  email: string; 
  room_name: string; 
  date: string; 
  start_time: string; 
  subtotal: number; 
  booking_fee: number; 
  tax_rate: number; 
  discount_amount: number; 
  total: number; 
  tickets?: {ticket_type: string; ticket_price: string; ticket_num: number}[]; 
}

interface Showtime {
  id: string;
  start_time: string;
  room_name: string;
  seat_binary: string;
}

interface Config {
  booking_fee: number;
  tax_rate: number;
}

interface PromoCode {
  code: string;
  discount_percentage: number; // 10 = 10%
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const movieTitle = searchParams.get("movieTitle") ?? "";
  const showtimeId = searchParams.get("showtimeId");
  const startTime = searchParams.get("startTime");

  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [config, setConfig] = useState<Config | null>(null);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);

  // Promo state
  const [enteredCode, setEnteredCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoMessage, setPromoMessage] = useState("");

  // ✅ Parse seats
  useEffect(() => {
    try {
      const raw = searchParams.get("seats");
      const parsed = raw ? JSON.parse(decodeURIComponent(raw)) : [];
      setSeats(parsed);
    } catch {
      setSeats([]);
    }
  }, [searchParams]);

  // ✅ Fetch data
  useEffect(() => {
    if (!showtimeId) return;

    const fetchAll = async () => {
      try {
        const [ticketRes, configRes, promoRes, showtimeRes] = await Promise.all([
          fetch("http://localhost:8080/api/tickets"),
          fetch("http://localhost:8080/api/fees-and-taxes"),
          fetch("http://localhost:8080/api/promotion-codes"),
          fetch(`http://localhost:8080/api/showtimes/${showtimeId}`),
        ]);

        const [ticketData, configData, promoData, showt] = await Promise.all([
          ticketRes.json(),
          configRes.json(),
          promoRes.json(),
          showtimeRes.json(),
        ]);

        setTickets(ticketData);
        setConfig(configData[0]); // ✅ single object
        setPromoCodes(promoData);
        setShowtime(showt);
      } catch (e) {
        console.error("Failed to fetch:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [showtimeId]);

  if (loading) return <p style={{ color: "white" }}>Loading checkout...</p>;
  if (!config) return <p style={{ color: "white" }}>Config failed to load.</p>;

  // ✅ Calculations
  const subtotal = seats.reduce((sum, seat) => {
    const ticket = tickets.find(
      (t) => t.ticket_type.toUpperCase() === seat.type.toUpperCase()
    );
    return sum + (ticket?.ticket_price ?? 0);
  }, 0);

  const bookingTotal = config.booking_fee * seats.length;
  const tax = (subtotal + bookingTotal) * config.tax_rate;
  const preDiscountTotal = subtotal + bookingTotal + tax;

  const discount =
    appliedPromo
      ? preDiscountTotal * (appliedPromo.discount_percentage / 100)
      : 0;

  const total = preDiscountTotal - discount;

  // ✅ Promo handler
  const handleApplyPromo = () => {
    const found = promoCodes.find(
      (p) => p.code.toUpperCase() === enteredCode.trim().toUpperCase()
    );

    if (!found) {
      setAppliedPromo(null);
      setPromoMessage("Invalid promo code.");
      return;
    }

    setAppliedPromo(found);
    setPromoMessage(`Promo applied! ${found.discount_percentage}% off`);
  };

  // ✅ Confirm handler
  const handleConfirm = async () => {
    if (!seats.length) {
      alert("No seats selected.");
      return;
    }

    const bookingData = {
      movieTitle,
      showtimeId,
      seats,
      subtotal,
      bookingFee: config.booking_fee,
      taxRate: config.tax_rate,
      promoCode: appliedPromo?.code ?? null,
      discountPercentage: appliedPromo?.discount_percentage ?? 0,
      total,
    };

    try {
      await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      alert("Booking confirmed!");
      router.push("/");
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  // ✅ UI
  return (
    <main style={{ minHeight: "100vh", padding: "2rem", background: "#150707", color: "white" }}>
      <TopBar />

      <div style={{
        backgroundColor: "#2b0f0f",
        padding: "2rem",
        borderRadius: "10px",
        maxWidth: "600px",
        margin: "0 auto"
      }}>
        <h1 style={{ textAlign: "center" }}>Checkout Summary</h1>

        <p><strong>Movie:</strong> {movieTitle}</p>
        <p><strong>Showtime:</strong> {startTime}</p>
        <p><strong>Room:</strong> {showtime?.room_name}</p>

        <hr />

        <h3>Tickets</h3>
        {seats.map((seat, i) => (
          <p key={i}>
            Seat {seat.id} — {seat.type}: $
            {tickets.find(t => t.ticket_type === seat.type)?.ticket_price.toFixed(2) ?? "0.00"}
          </p>
        ))}

        <hr />

        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Booking fee: ${bookingTotal.toFixed(2)}</p>
        <p>Tax: ${tax.toFixed(2)}</p>

        {appliedPromo && (
          <p style={{ color: "#00ff99" }}>
            Discount: -${discount.toFixed(2)}
          </p>
        )}

        <h2>Total: ${total.toFixed(2)}</h2>

        {/* Promo Code Section */}
        <div style={{ marginTop: "1rem" }}>
          <input
            type="text"
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
            placeholder="Promo code"
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <button onClick={handleApplyPromo} 
            style={{
                backgroundColor: "#b52727ff",
                border: "none",
                borderRadius: "6px",
                color: "white",
                fontWeight: "bold",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}>
            Apply Promo
          </button>

          {promoMessage && <p>{promoMessage}</p>}
        </div>

        <button
          onClick={() => {
            const token = localStorage.getItem("user");

            if (!token) {
              router.push(
                `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`
              );
            } else {
              handleConfirm();
            }
          }}
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