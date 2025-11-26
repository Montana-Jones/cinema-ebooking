"use client"; // app/finish-checkout/[bookingNum]/page.tsx

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/app/checkout/parts/topBar";

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

interface PaymentCard {
  card_holder: string;
  card_number: string;
  expiration_date: string;
  cvv?: string;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  promotion: string;
  home_address: string;
  billing_address: string;
  phone_number: string;
  paymentInfo?: PaymentCard[];
}

export default function FinshCheckoutPage({
  params,
}: {
  params: Promise<{ bookingNum: string }>;
}) {
  const router = useRouter();
  const { bookingNum } = React.use(params);
  
  const [bookingData, setBookingData] = useState<booking | null>(null);
  const [customerData, setCustomerData] = useState<Customer | null>(null);
  
  // State for Billing Address Input
  const [newBillingAddress, setNewBillingAddress] = useState(""); 
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(4); 
  const [isExpired, setIsExpired] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Payment UI State
  const [useNewCard, setUseNewCard] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);

  // New Card Form State
  const [cardForm, setCardForm] = useState({
    name: "",
    number: "",
    exp: "",
    cvv: "",
    zip: "",
  });
  // --- Determine button disabled state ---
  const billingAddressRequired = !customerData?.billing_address || customerData.billing_address.trim() === "";
  const billingAddressIncomplete = billingAddressRequired && !newBillingAddress.trim();

  let paymentIncomplete = false;
  if (useNewCard) {
    paymentIncomplete = !cardForm.name || !cardForm.number || !cardForm.exp || !cardForm.cvv || !cardForm.zip;
  } else {
    paymentIncomplete = !customerData?.paymentInfo?.[selectedCardIndex];
  }

  const isPayDisabled = paymentSuccess || isExpired || billingAddressIncomplete || paymentIncomplete;


  // --- Data Fetching ---
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
    const fetchCustomerData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/users/email/${bookingData?.email}`);
        if (!res.ok) throw new Error("Failed to fetch customer data");
        const data: Customer = await res.json();
        setCustomerData(data);
        
        if (!data.paymentInfo || data.paymentInfo.length === 0) {
          setUseNewCard(true);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    if (bookingData?.email) {
      fetchCustomerData();
    }
  }, [bookingData?.email]);

  // --- Timer Logic ---
 useEffect(() => {
  if (isExpired || paymentSuccess) return;

  const intervalId = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        
        clearInterval(intervalId);
        handleTimeout();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(intervalId);
}, [isExpired, paymentSuccess]);

useEffect(() => {
  if (!isExpired || !bookingData) return;
  handleTimeout();
}, [isExpired]);



  // --- Unlock Seats Handler ---
  const handleTimeout = async () => {
    setIsExpired(true);
    if (!bookingData) return;

    try {
      console.log("Time expired. Unlocking seats...");
      await fetch(`http://localhost:8080/api/showtimes/saveSeats/${bookingData.showtime_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatBinary: bookingData.original_binary }),
      });
      console.log("Seats successfully unlocked.");
    } catch (err) {
      console.error("Unlocking seats failed:", err);
    }
  };

  // --- Formatters ---
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpirationDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    return v;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "number") {
      const raw = value.replace(/\D/g, "").slice(0, 16);
      formattedValue = formatCardNumber(raw);
    } else if (name === "exp") {
      const raw = value.replace(/\D/g, "").slice(0, 4);
      formattedValue = formatExpirationDate(raw);
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    } else if (name === "zip") {
      formattedValue = value.replace(/\D/g, "").slice(0, 5);
    }

    setCardForm((prev) => ({ ...prev, [name]: formattedValue }));
  };
  
  // Handler for the new billing address input field
  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewBillingAddress(e.target.value);
  }

  const handleFinishPayment = () => {
    if (isExpired) return;

    // Check if billing address is missing and the user hasn't typed anything
    const billingAddressRequired = !customerData?.billing_address || customerData.billing_address.trim() === "";
    if (billingAddressRequired && !newBillingAddress.trim()) {
        alert("Please enter a billing address to proceed.");
        return;
    }

    let paymentDetails;
    if (useNewCard) {
      if (!cardForm.number || !cardForm.exp || !cardForm.cvv || !cardForm.zip || !cardForm.name) {
        alert("Please fill in all payment fields.");
        return;
      }
      paymentDetails = { ...cardForm, type: "NEW_CARD" };
    } else {
      if (!customerData?.paymentInfo?.[selectedCardIndex]) return;
      paymentDetails = { 
        ...customerData.paymentInfo[selectedCardIndex], 
        type: "SAVED_CARD" 
      };
    }

    console.log("Processing Payment with:", paymentDetails);
    
    // Stop the timer and finalize
    setPaymentSuccess(true); 
    alert("Payment Processed Successfully!");
    
    // Here you would likely make an API call to finalize the booking status to 'PAID'
    // router.push("/confirmation"); 
  };

  // --- Render Loading ---
  if (!bookingData) return <div className="p-10 text-white">Loading...</div>;

  // --- Render Expired State ---
  if (isExpired) {
    
  
    return (
      <div className="min-h-screen bg-[#150707] text-white">
        <TopBar />
        <div className="container mx-auto p-10 max-w-2xl text-center mt-10">
          <div className="bg-[#2b0f0f] p-8 rounded-lg border border-red-800">
            <h1 className="text-3xl font-bold mb-4 text-[#b52727]">Session Expired</h1>
            <p className="text-lg text-gray-300 mb-6">
              You did not complete the payment within the allotted time. 
              The seats have been released for other customers.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-[#b52727] text-white font-bold rounded hover:bg-[#962020] transition"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine if billing address input should be shown
  const showBillingAddressInput = !customerData?.billing_address || customerData.billing_address.trim() === "";

  // --- Render Main Checkout ---
  return (
    <div className="min-h-screen bg-[#150707] text-white">
      <TopBar /> 
      
      <div className="container mx-auto p-6 max-w-4xl pt-4"> 
        <h1 className="text-3xl font-bold mb-8 text-[#00ff99] text-center">
          Finalize Your Booking
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: Booking Summary & Time Banner */}
          <div className="space-y-6">
            
            {/* 1. Booking Summary */}
            <div className="bg-[#2b0f0f] p-6 rounded-lg h-fit">
              <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
                Booking Details
              </h2>
              <div className="space-y-2 text-gray-300">
                <p><strong className="text-white">Booking #:</strong> {bookingData.booking_num}</p>
                <p><strong className="text-white">Movie:</strong> {bookingData.movie_title}</p>
                <p><strong className="text-white">Time:</strong> {bookingData.start_time} on {bookingData.date}</p>
                <p><strong className="text-white">Room:</strong> {bookingData.room_name}</p>
                <p><strong className="text-white">Seats:</strong> {bookingData.seats.map((seat) => seat.id).join(", ")}</p>
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
            </div>

            {/* 2. Time Banner (Moved here) */}
            <div 
              className={`p-4 rounded-lg font-bold text-center border-2 
                ${timeLeft <= 20 ? ' border-red-500' : 'bg-[#1a332a] text-[#00ff99] border-[#00ff99]'}`
              }
            >
              <span className="text-lg">Please finalize your payment within:</span> 
              <span className="text-3xl font-mono block mt-1">{formatTime(timeLeft)}</span>
            </div>
            
          </div> {/* END of LEFT COLUMN */}


          {/* RIGHT COLUMN: Payment & Billing */}
          <div className="space-y-6">
            
            {/* 1. Billing Address Section */}
            <div className="bg-[#2b0f0f] p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
                Billing Address
              </h2>
              {/* Display existing address OR show the input field */}
              {!showBillingAddressInput ? (
                <p className="text-gray-300">{customerData?.billing_address}</p>
              ) : (
                <div className="space-y-3">
                    <p className="text-yellow-500 italic text-sm">Please provide your **billing address** to proceed.</p>
                    <textarea
                        value={newBillingAddress}
                        onChange={handleAddressChange}
                        placeholder="Ex:123 Main St, Boston, MA 02118"
                        rows={3}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-[#00ff99]"
                    />
                </div>
              )}
            </div>

            {/* 2. Payment Method Section */}
            <div className="bg-[#2b0f0f] p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
                Payment Method
              </h2>

              {customerData?.paymentInfo && customerData.paymentInfo.length > 0 && (
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setUseNewCard(false)}
                    className={`px-4 py-2 rounded text-sm font-bold transition ${
                      !useNewCard ? "bg-[#b52727] text-white" : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    Saved Cards
                  </button>
                  <button
                    onClick={() => setUseNewCard(true)}
                    className={`px-4 py-2 rounded text-sm font-bold transition ${
                      useNewCard ? "bg-[#b52727] text-white" : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    New Card
                  </button>
                </div>
              )}

              {/* SCENARIO A: Saved Cards */}
              {!useNewCard && customerData?.paymentInfo && customerData.paymentInfo.length > 0 && (
                <div className="space-y-3">
                  {customerData.paymentInfo.map((card, idx) => (
                    <label
                      key={idx}
                      className={`block border p-4 rounded cursor-pointer transition ${
                        selectedCardIndex === idx
                          ? "border-[#00ff99] bg-[#1a332a]"
                          : "border-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="savedCard"
                          checked={selectedCardIndex === idx}
                          onChange={() => setSelectedCardIndex(idx)}
                          className="accent-[#00ff99]"
                        />
                        <div>
                          <p className="font-bold">{card.card_holder}</p>
                          <p className="text-sm text-gray-400">
                            Ends in {card.card_number.slice(-4)} | Exp: {card.expiration_date}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* SCENARIO B: New Card Form */}
              {useNewCard && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      name="name"
                      value={cardForm.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-[#00ff99]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      name="number"
                      value={cardForm.number}
                      onChange={handleInputChange}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-[#00ff99]"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1">Expiration</label>
                      <input
                        type="text"
                        name="exp"
                        value={cardForm.exp}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-[#00ff99]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardForm.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={4}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-[#00ff99]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Billing Zip Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={cardForm.zip}
                      onChange={handleInputChange}
                      placeholder="12345"
                      maxLength={5}
                      className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-[#00ff99]"
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleFinishPayment}
                disabled={isPayDisabled}
                className={`w-full mt-6 text-white font-bold py-3 rounded transition shadow-lg
                  ${isPayDisabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#00b14f] hover:bg-[#009e47]'}`}
              >
                {paymentSuccess ? 'Payment Completed' : `Pay $${bookingData.total_price.toFixed(2)}`}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}