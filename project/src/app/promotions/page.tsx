"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import axios from "axios";

interface Promotion {
  id: string;
  name: string;
  amount: number;
  code: string;
  state: string;
  expiryDate: string;
}

interface NewPromotion {
  name: string;
  amount: string;
  code: string;
  expiryDate: string;
}

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [newPromotion, setNewPromotion] = useState<NewPromotion>({
    name: "",
    amount: "",
    code: "",
    expiryDate: ""
  });
  const [selectedPromo, setSelectedPromo] = useState<string>("");

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/promotions");
      const data = response.data.map((p: any) => ({
        id: p.id || p._id,
        name: p.name,
        amount: p.amount,
        code: p.code,
        state: p.state,
        expiryDate: p.expiryDate,
      }));
      setPromotions(data);
    } catch (err) {
      console.error("Error fetching promotions:", err);
      alert("Failed to fetch promotions from backend!");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPromotion({ ...newPromotion, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPromo = {
      name: newPromotion.name,
      amount: Number(newPromotion.amount),
      code: newPromotion.code,
      state: "Active",
      expiryDate: newPromotion.expiryDate,
    };

    try {
      await axios.post("http://localhost:8080/api/promotions", newPromo);
      setNewPromotion({ name: "", amount: "", code: "", expiryDate: "" });
      fetchPromotions();
      alert("Promotion added and sent to all registered users!");
    } catch (err) {
      console.error("Error saving promotion:", err);
      alert("Failed to save promotion!");
    }
  };

  const handleSend = async () => {
    if (!selectedPromo) {
      alert("Please choose a promotion to send!");
      return;
    }

    const promo = promotions.find((p) => p.id === selectedPromo);
    if (!promo) {
      alert("Promotion not found!");
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/promotions/send/${promo.id}`);
      alert(`Promotion "${promo.name}" sent successfully!`);
    } catch (err) {
      console.error("Error sending promotion:", err);
      alert("Failed to send promotion!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/promotions/${id}`);
      setPromotions(promotions.filter((promo) => promo.id !== id));
      alert("Promotion deleted successfully!");
    } catch (err) {
      console.error("Error deleting promotion:", err);
      alert("Failed to delete promotion!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 sm:p-10">
        <h1 className="text-4xl font-bold text-center mb-10 text-[#75D1A6] drop-shadow-lg">
          Promotions Management
        </h1>

        {/* Active Promotions Table */}
        <section className="bg-[#1b1b1b] rounded-2xl p-6 mb-10 border border-gray-800 shadow-lg">
          <h2 className="text-2xl mb-6 text-[#75D1A6] font-semibold">Active Promotions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#252525] text-[#75D1A6]">
                  <th className="border-b border-gray-700 p-3">Name</th>
                  <th className="border-b border-gray-700 p-3">Amount</th>
                  <th className="border-b border-gray-700 p-3">Code</th>
                  <th className="border-b border-gray-700 p-3">State</th>
                  <th className="border-b border-gray-700 p-3">Actions</th>
                  <th className="border-b border-gray-700 p-3">Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {promotions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-400 p-6 italic">
                      No promotions added yet.
                    </td>
                  </tr>
                ) : (
                  promotions.map((promo) => (
                    <tr
                      key={promo.id}
                      className="hover:bg-[#252525] transition border-b border-gray-800"
                    >
                      <td className="p-3">{promo.name}</td>
                      <td className="p-3">{promo.amount}</td>
                      <td className="p-3 text-[#75D1A6]">{promo.code}</td>
                      <td className="p-3 text-green-400">{promo.state}</td>
                      <td className="p-3 flex gap-2">
                      <td className="p-3">{promo.expiryDate}</td>

                        <button
                          onClick={() => handleDelete(promo.id)}
                          className="bg-red-600 hover:bg-red-800 px-4 py-2 rounded-full text-white font-semibold transition-all duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Add New Promotion */}
        <section className="bg-[#1b1b1b] rounded-2xl p-6 mb-10 border border-gray-800 shadow-lg">
          <h2 className="text-2xl mb-6 text-[#75D1A6] font-semibold">Add New Promotion</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-gray-300">
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
              <label className="block mb-1 text-gray-400">Promotional Amount</label>
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

            <div>
            <label className="block mb-1 text-gray-400">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={newPromotion.expiryDate}
              onChange={handleChange}
              required
              className="w-full bg-[#2a2a2a] p-3 rounded-md border border-gray-700 focus:border-[#75D1A6] outline-none transition"/>
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
          <h2 className="text-2xl mb-6 text-[#75D1A6] font-semibold">Send Promotion</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <select
              value={selectedPromo}
              onChange={(e) => setSelectedPromo(e.target.value)}
              className="flex-1 bg-[#2a2a2a] p-3 rounded-md border border-gray-700 focus:border-[#75D1A6] outline-none transition"
            >
              <option value="">-- Select a Promotion --</option>
              {promotions.map((promo) => (
                <option key={promo.id} value={promo.id}>
                  {promo.name}
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
