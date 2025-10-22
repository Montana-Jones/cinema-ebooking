"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import  dummyCustomer from "@/data/DummyCustomers"; // 👈 import shared data



export default function EditCardsPage() {
  const [cards, setCards] = useState<
    { cardNumber: string; cardHolder: string; expiry: string }[]
  >([]);
    
  
  useEffect(() => {
    // Simulate loading data from the same source
    setTimeout(() => {
      setCards(dummyCustomer.paymentInfo || []);
    }, 500);
  }, []);

  const handleAddCard = () => {
    const newCard = { 
      cardNumber: "**** **** **** 2222",
      cardHolder: dummyCustomer.firstName + " " + dummyCustomer.lastName,
      expiry: "01/30",
    };
    setCards([...cards, newCard]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 overflow-y-auto">
      <div className="w-full max-w-md p-6 rounded-2xl shadow">
        <Link href="/dummy-edit-profile/" className="text-gray-600 text-sm hover:underline">
          ← Back to Edit Profile
        </Link>

        <h2 className="text-2xl font-bold text-center my-6">Edit Payment Cards</h2>

        {cards.length > 0 ? (
          <ul className="divide-y divide-gray-200 mb-4">
            {cards.map((card, i) => (
              <li key={i} className="py-2">
                <p className="font-medium">{card.cardNumber}</p>
                <p className="text-gray-500">
                  {card.cardHolder} — exp: {card.expiry}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center mb-4">No cards found.</p>
        )}

        <button
          onClick={handleAddCard}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add New Card
        </button>
      </div>
    </div>
  );
}
