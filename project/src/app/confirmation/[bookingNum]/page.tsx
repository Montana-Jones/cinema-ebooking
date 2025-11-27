"use client";
import React, { use, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TopBar from "@/app/confirmation/parts/topBar";

// --- Interfaces ---
interface Seat {
  id: string;
  type: string;
}



interface booking {
  id: string;
  booking_num: string;
  movie_title: string;
  showtime_id: string;
  email: string;
  room_name: string;
  date: string;
  start_time: string;
  subtotal_price: number;
  booking_fee: number;
  tax_rate: number;
  discount: number;
  total_price: number;
  original_binary: string; 
  seats: Seat[];
}

export default function ConfirmationPage({
  params,
}: {
  params: Promise<{ bookingNum: string }>;
}) {
  const router = useRouter();
  const { bookingNum } = React.use(params);
  
  const [bookingData, setBookingData] = useState<booking | null>(null);


  useEffect(() => {
      const fetchBookingData = async () => {
        try {
          const res = await fetch(`http://localhost:8080/api/bookings/number/${bookingNum}`);
          if (!res.ok) throw new Error("Failed to fetch booking data");
          const data = await res.json();
          setBookingData(data);
        } catch (error) {
          console.error("Error fetching booking data:", error);
        }
      };
  
      if (bookingNum) {
        fetchBookingData();
      }
    }, [bookingNum]);

   

    useEffect(() => {
      const handleEmailConfirmation = async () => {
        console.log("Sending confirmation email for booking number:", bookingNum);
        try {
          const res = await fetch(`http://localhost:8080/api/bookings/send`, {
            method: "POST",
            body: bookingNum,
            headers: {
              "Content-Type": "text/plain",
            },
          });

          if (!res.ok) throw new Error("Failed to send confirmation email");

          console.log("Confirmation email sent successfully.");
        } catch (error) {
          console.error("Error sending confirmation email:", error);
        }
      };

      if (bookingData) {
        handleEmailConfirmation(); 
      }
    }, [bookingData, bookingNum]);


  if (!bookingData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <TopBar /> 
    <div className="min-h-screen bg-[#150707] text-white">
     <h1 className="text-3xl font-bold mb-4"> .</h1>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4"> ------------------------------------------------------------------------</h1>

        <h1 className="text-3xl font-bold mb-4">Booking Confirmation</h1>
        <p className="mb-2">Thank you for your purchase!</p>
        <p className="mb-2">The Booking Confirmation was sent to {bookingData.email}!</p>
        <p className="mb-2">
          <strong>Booking Number:</strong> {bookingData.booking_num}
        </p>
        <p className="mb-2">
          <strong>Movie Title:</strong> {bookingData.movie_title}
        </p>
        <p className="mb-2">
          <strong>Date & Time:</strong> {bookingData.date} at {bookingData.start_time}
        </p>
        <p className="mb-2">
          <strong>Room:</strong> {bookingData.room_name}
        </p>
        <p className="mb-2">
          <strong>Seats:</strong>{" "}
          {bookingData.seats.map((seat) => seat.id).join(", ")}
        </p>
        <p className="mb-2">
          <strong>Total Paid:</strong> ${bookingData.total_price.toFixed(2)}
        </p>
        <div className="mt-6">
          <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-[#b52727] text-white font-bold rounded hover:bg-[#962020] transition"
            >
              Return to Home
            </button>
         
        </div>
      </div>
    </div>
    </div>
  );    
}