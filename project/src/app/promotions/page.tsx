"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

interface Promotion {
  id?: string;
  name: string;
  amount: number;
  code: string;
  state: string;
}

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [newPromotion, setNewPromotion] = useState({
    name: "",
    amount: "",
    code: "",
  });
  const [selectedPromo, setSelectedPromo] = useState("");

  // Fetch promotions from backend when page loads
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/promotions");
        if (!res.ok) throw new Error("Failed to fetch promotions");
        const data = await res.json();
        setPromotions(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPromotions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPromotion({ ...newPromotion, [e.target.name]: e.target.value });
  };

  // Save promotion to database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPromo: Promotion = {
      name: newPromotion.name,
      amount: Number(newPromotion.amount),
      code: newPromotion.code,
      state: "ACTIVE",
    };

    try {
      const res = await fetch("http://localhost:8080/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPromo),
      });

      if (!res.ok) throw new Error("Failed to save promotion");

      const savedPromo = await res.json();
      setPromotions([...promotions, savedPromo]);
      setNewPromotion({ name: "", amount: "", code: "" });

      alert("Promotion added successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving promotion");
    }
  };

  // Send promotion email
  const handleSend = async () => {
    if (!selectedPromo) {
      alert("Please choose a promotion to send!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/promotions/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promoCode: selectedPromo }),
      });

      if (!res.ok) throw new Error("Failed to send promotion");

      alert(`Promotion "${selectedPromo}" sent to subscribed customers!`);
    } catch (error) {
      console.error(error);
      alert("Error sending promotion");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6 sm:p-10">
        <h1 className="text-4xl font-bold text-center mb-10 text-[#75D1A6] drop-shadow-lg">
          Promotions Management
        </h1>

        {/* Promotion Table */}
        <section className="bg-[#1b1b1b] rounded-2xl p-6 mb-10 border border-gray-800 shadow-lg">
          <h2 className="text-2xl mb-6 text-[#75D1A6] font-semibold">
            Active Promotions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#252525] text-[#75D1A6]">
                  <th className="border-b border-gray-700 p-3">Name</th>
                  <th className="border-b border-gray-700 p-3">Amount</th>
                  <th className="border-b border-gray-700 p-3">Code</th>
                  <th className="border-b border-gray-700 p-3">State</th>
                </tr>
              </thead>
              <tbody>
                {promotions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-gray-400 p-6 italic"
                    >
                      No promotions added yet.
                    </td>
                  </tr>
                ) : (
                  promotions.map((promo, index) => (
                    <tr
                      key={index}
                      className="hover:bg-[#252525] transition border-b border-gray-800"
                    >
                      <td className="p-3">{promo.name}</td>
                      <td className="p-3">{promo.amount}</td>
                      <td className="p-3 text-[#75D1A6]">{promo.code}</td>
                      <td className="p-3 text-green-400">{promo.state}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Add New Promotion */}
        <section className="bg-[#1b1b1b] rounded-2xl p-6 mb-10 border border-gray-800 shadow-lg">
          <h2 className="text-2xl mb-6 text-[#75D1A6] font-semibold">
            Add New Promotion
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 text-gray-300"
          >
            <div>
              <label className="block mb-1 text-gray-400">Name</label>
              <input
                type="text"
                name="name"
                value={newPromotion.name}
                onChange={handleChange}
                required
                className="w-full bg-[#2a2a2a] p-3 rounded-md border border-gray-700 focus:border-[#75D1A6] outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-400">
                Promotional Amount
              </label>
              <input
                type="number"
                name="amount"
                value={newPromotion.amount}
                onChange={handleChange}
                required
                className="w-full bg-[#2a2a2a] p-3 rounded-md border border-gray-700 focus:border-[#75D1A6] outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-400">Promotional Code</label>
              <input
                type="text"
                name="code"
                value={newPromotion.code}
                onChange={handleChange}
                required
                className="w-full bg-[#2a2a2a] p-3 rounded-md border border-gray-700 focus:border-[#75D1A6] outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="bg-[#675068] hover:bg-[#4c3b4d] py-3 mt-4 rounded-full text-white font-semibold transition-all duration-200"
            >
              Add Promotion
            </button>
          </form>
        </section>

        {/* Send Promotion */}
        <section className="bg-[#1b1b1b] rounded-2xl p-6 border border-gray-800 shadow-lg">
          <h2 className="text-2xl mb-6 text-[#75D1A6] font-semibold">
            Send Promotion
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <select
              value={selectedPromo}
              onChange={(e) => setSelectedPromo(e.target.value)}
              className="flex-1 bg-[#2a2a2a] p-3 rounded-md border border-gray-700 focus:border-[#75D1A6] outline-none transition"
            >
              <option value="">-- Select a Promotion --</option>
              {promotions.map((promo, index) => (
                <option key={index} value={promo.code}>
                  {promo.name} ({promo.code})
                </option>
              ))}
            </select>
            <button
              onClick={handleSend}
              className="bg-[#675068] hover:bg-[#4c3b4d] px-8 py-3 rounded-full text-white font-semibold transition-all duration-200"
            >
              Send
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Promotions;
