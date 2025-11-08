"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

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
  booking_fee: number; // corresponds to Double in Java
  tax_rate: number; // corresponds to Double in Java
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
  const [loading, setLoading] = useState(true);

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

  // Fetch tickets and config (booking_fee, tax_rate) from backend
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ticketRes, configRes] = await Promise.all([
          fetch("http://localhost:8080/api/tickets"),
          fetch("http://localhost:8080/api/fees-and-taxes"),
        ]);

        const [ticketData, configData] = await Promise.all([
          ticketRes.json(),
          configRes.json(),
        ]);

        setTickets(ticketData);
        setConfig(configData);
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
  if (!config)
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
  const total = subtotal + bookingTotal + tax;

  const handleConfirm = async () => {
    try {
      // Example booking payload
      const bookingData = {
        movieTitle,
        showtimeId,
        seats,
        subtotal,
        bookingFee: config[0].booking_fee,
        taxRate: config[0].tax_rate,
        total,
      };

      // Send to backend (optional)
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
      <Navbar />

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
          <h2>Total: ${total.toFixed(2)}</h2>
        </div>

        <button
          onClick={handleConfirm}
          style={{
            marginTop: "1.5rem",
            width: "100%",
            padding: "1rem",
            backgroundColor: "#0070f3",
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
