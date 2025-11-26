"use client";
import React, { use, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TopBar from "@/app/checkout/parts/topBar";

// --- Interfaces ---
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
  seats: Seat[]; 
}

interface Seat {
  id: string;
  type: string;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();   
    const bookingNum = searchParams.get("id");
    const [bookingData, setBookingData] = useState<booking | null>(null);
    useEffect(() => {
      const fetchBookingData = async () => {
        try {
          const res = await fetch(`http://localhost:8080/api/bookings/${bookingNum}`);
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
  
  return (
    <div>
      <TopBar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Finish Checkout</h1>
        {bookingData ? (
          <div>
            <h2 className="text-xl font-semibold mb-2">Booking Details</h2>
            <p><strong>Booking Number:</strong> {bookingData.id}</p>
            <p><strong>Movie Title:</strong> {bookingData.movie_title}</p>
            <p><strong>Showtime:</strong> {bookingData.start_time} on {bookingData.date}</p>
            <p><strong>Room:</strong> {bookingData.room_name}</p>
            <p><strong>Seats:</strong> {bookingData.seats.map(seat => seat.id).join(", ")}</p>
            <p><strong>Subtotal:</strong> ${bookingData.subtotal.toFixed(2)}</p>
            <p><strong>Booking Fee:</strong> ${bookingData.booking_fee.toFixed(2)}</p>
            <p><strong>Tax Rate:</strong> {bookingData.tax_rate}%</p>
            <p><strong>Discount Amount:</strong> ${bookingData.discount_amount.toFixed(2)}</p>
            <p><strong>Total:</strong> ${bookingData.total.toFixed(2)}</p>
          </div>
        ) : (
          <p>Loading booking details...</p>
        )}
      </div>
    </div>
  );    
}