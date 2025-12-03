"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TopBar from "@/app/checkout/parts/topBar";
import Unverified from "@/components/Unverified";

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

interface Booking {
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
  seats: Seat[];
}

interface Showtime {
  id: string;
  start_time: string;
  room_name: string;
  seat_binary: string;
  date: string;
}

interface User {
  status: string;
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
  const cols = parseInt(searchParams.get("cols") || "0", 10);

  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [config, setConfig] = useState<Config | null>(null);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const [enteredCode, setEnteredCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoMessage, setPromoMessage] = useState("");

  // Parse seats from query
  useEffect(() => {
    try {
      const raw = searchParams.get("seats");
      const parsed = raw ? JSON.parse(decodeURIComponent(raw)) : [];
      setSeats(parsed);
    } catch {
      setSeats([]);
    }
  }, [searchParams]);

  // Fetch all required data
  useEffect(() => {
    if (!showtimeId) return;

    const fetchAll = async () => {
      try {
        const [ticketRes, configRes, promoRes, showtimeRes] = await Promise.all([
          fetch("http://localhost:8080/api/tickets"),
          fetch("http://localhost:8080/api/fees-and-taxes"),
          fetch("http://localhost:8080/api/promotions"),
          fetch(`http://localhost:8080/api/showtimes/${showtimeId}`),
        ]);

        const [ticketData, configData, promoData, showt] = await Promise.all([
          ticketRes.json(),
          configRes.json(),
          promoRes.json(),
          showtimeRes.json(),
        ]);

        setTickets(ticketData);
        setConfig(configData[0]);
        setPromoCodes(promoData);
        setShowtime(showt);
      } catch (e) {
        console.error("Failed to fetch:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();

    // Load user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [showtimeId, searchParams]);

  // Compute locked seat binary
  const lockedBinary = React.useMemo(() => {
    if (!showtime?.seat_binary || !seats.length || cols <= 0) return "";

    const arr = showtime.seat_binary.split("");

    seats.forEach(({ id }) => {
      const [r, c] = id.split("-").map(Number);
      const idx = r * cols + c;
      if (idx >= 0 && idx < arr.length) arr[idx] = "1";
    });

    return arr.join("");
  }, [showtime?.seat_binary, seats, cols]);

  if (loading) return <p className="text-white text-center mt-20">Loading checkout...</p>;
  if (!config) return <p className="text-white text-center mt-20">Config failed to load.</p>;
  if (user?.status === "SUSPENDED") return <Unverified />;

  // Pricing calculations
  const subtotal = seats.reduce((sum, seat) => {
    const ticket = tickets.find((t) => t.ticket_type.toUpperCase() === seat.type.toUpperCase());
    return sum + (ticket?.ticket_price ?? 0);
  }, 0);

  const bookingTotal = config.booking_fee * seats.length;
  const tax = (subtotal + bookingTotal) * config.tax_rate;
  const preDiscountTotal = subtotal + bookingTotal + tax;
  const discount = appliedPromo ? preDiscountTotal * (appliedPromo.discount_percentage / 100) : 0;
  const total = preDiscountTotal - discount;

  const handleApplyPromo = () => {
    const inputCode = enteredCode.trim().toUpperCase();
    const found = promoCodes.find((p) => {
      const code = String(p.code || "").trim().toUpperCase();
      return code === inputCode;
    });

    if (!found) {
      setAppliedPromo(null);
      setPromoMessage("Invalid promo code.");
      return;
    }

    setAppliedPromo(found);
    setPromoMessage(`Discount applied successfully! ${found.discount_percentage}% off`);
  };

  const handleConfirm = async () => {
    if (!seats.length) {
      alert("No seats selected.");
      return;
    }

    const bookingData = {
      booking_num: `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      showtime_id: showtimeId,
      email: JSON.parse(localStorage.getItem("user") || "{}").email,
      room_name: showtime?.room_name,
      date: showtime?.date,
      start_time: startTime,
      subtotal_price: subtotal,
      total_price: total,
      tax_rate: config.tax_rate,
      booking_fee: config.booking_fee,
      discount: appliedPromo?.discount_percentage ?? 0,
      movie_title: movieTitle,
      original_binary: showtime?.seat_binary || "",
      seats: seats,
    };

    try {
      await fetch("http://localhost:8080/api/bookings/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      await fetch(`http://localhost:8080/api/showtimes/saveSeats/${showtimeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatBinary: lockedBinary }),
      });

      router.push(`/finish-checkout/${bookingData.booking_num}`);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed! Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#150707] text-white py-24">
      <TopBar />

      <div className="max-w-2xl mx-auto bg-[#2b0f0f] p-8 rounded-2xl shadow-2xl border border-gray-700">
        <h1 className="text-center text-4xl font-bold mb-6 text-[#75D1A6]">Checkout Summary</h1>

        <div className="space-y-2">
          <p><span className="font-semibold">Movie:</span> {movieTitle}</p>
          <p><span className="font-semibold">Showtime:</span> {startTime}</p>
          <p><span className="font-semibold">Room:</span> {showtime?.room_name}</p>
        </div>

        <hr className="my-4 border-gray-600" />

        <h2 className="text-2xl font-semibold mb-2 text-[#75D1A6]">Tickets</h2>
        <div className="space-y-1">
          {seats.map((seat, i) => (
            <p key={i} className="bg-[#3a0d0d] p-2 rounded">
              Seat {seat.id} — {seat.type}: $
              {tickets.find(t => t.ticket_type.toUpperCase() === seat.type.toUpperCase())?.ticket_price.toFixed(2) ?? "0.00"}
            </p>
          ))}
        </div>

        <hr className="my-4 border-gray-600" />

        <div className="space-y-1">
          <p>Subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span></p>
          <p>Booking fee: <span className="font-semibold">${bookingTotal.toFixed(2)}</span></p>
          <p>Tax: <span className="font-semibold">${tax.toFixed(2)}</span></p>
          {appliedPromo && (
            <p className="text-green-400">Discount: -${discount.toFixed(2)}</p>
          )}
          <h2 className="text-2xl font-bold mt-4 text-[#75D1A6]">Total: ${total.toFixed(2)}</h2>
        </div>

        {/* Promo Code */}
        <div className="mt-6 space-y-2">
          <input
            type="text"
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
            placeholder="Promo code"
            className="w-full p-3 rounded-lg bg-[#3a0d0d] border border-gray-600 text-white focus:outline-none focus:border-[#75D1A6] transition"
          />
          <button
            onClick={handleApplyPromo}
            className="w-full bg-[#b52727] py-3 rounded-lg font-bold hover:bg-[#a01f1f] transition"
          >
            Apply Promo
          </button>
          {promoMessage && <p className="text-center mt-1 text-green-400">{promoMessage}</p>}
        </div>

        <button
          onClick={() => {
            const token = localStorage.getItem("user");
            if (!token) {
              router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
            } else {
              handleConfirm();
            }
          }}
          className="mt-8 w-full bg-[#00b14f] py-4 rounded-2xl font-bold text-xl hover:bg-[#009844] transition"
        >
          Confirm & Pay
        </button>
      </div>
    </main>
  );
}
