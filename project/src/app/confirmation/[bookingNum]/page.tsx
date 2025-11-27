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
      <h1 className="text-3xl font-bold mb-4"> .</h1>
      <h1 className="text-3xl font-bold mb-4"> ------------------------------------------------------------------------</h1>

      <div className="min-h-screen bg-[#150707] text-white">
      
        <div className="bg-[#2b0f0f] p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
            Booking Confirmation
          </h2>
          <div className="space-y-2 text-gray-300">
            <p><strong className="text-white">Booking #:</strong> {bookingData.booking_num}</p>
            <p><strong className="text-white">Movie:</strong> {bookingData.movie_title}</p>
            <p><strong className="text-white">Time:</strong> {bookingData.start_time} on {bookingData.date}</p>
            <p><strong className="text-white">Room:</strong> {bookingData.room_name}</p>
            <p><strong className="text-white">Seats:</strong> {bookingData.seats.map((seat) => seat.id).join(", ")}</p>
            <p>The confirmation email was sent to {bookingData.email} </p>

          </div>

          <div className="mt-6 pt-4 border-t border-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${bookingData.subtotal_price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Booking Fee:</span>
              <span>${bookingData.booking_fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${(bookingData.total_price - bookingData.subtotal_price - bookingData.booking_fee + bookingData.discount).toFixed(2)}</span>
            </div>
            {bookingData.discount > 0 && (
              <div className="flex justify-between text-[#00ff99]">
                <span>Discount:</span>
                <span>-${bookingData.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold mt-4 pt-2 border-t border-gray-500">
              <span>Total:</span>
              <span>${bookingData.total_price.toFixed(2)}</span>
            </div>
          </div>
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

 