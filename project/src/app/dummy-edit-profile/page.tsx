"use client";
import React, { useEffect, useState } from "react";
import TopBar from "@/app/dummy-edit-profile/parts/topBar";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  bookings?: { id: string; movieTitle: string; date: string }[];
  paymentInfo?: { cardNumber: string; cardHolder: string; expiry: string }[];
}

const EditProfile: React.FC = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Dummy "database" data
  useEffect(() => {
    const dummyCustomer: Customer = {
      id: "CUST001",
      firstName: "Emma",
      lastName: "Stone",
      email: "emma.stone@example.com",
      status: "ACTIVE",
      bookings: [
        { id: "B001", movieTitle: "Inception", date: "2025-08-01" },
        { id: "B002", movieTitle: "Interstellar", date: "2025-07-20" },
        { id: "B003", movieTitle: "Oppenheimer", date: "2025-05-12" },
        { id: "B004", movieTitle: "Dune 2", date: "2025-02-28" },
      ],
      paymentInfo: [
        { cardNumber: "**** **** **** 4242", cardHolder: "Emma Stone", expiry: "12/26" },
        { cardNumber: "**** **** **** 1111", cardHolder: "Emma Stone", expiry: "08/25" },
        { cardNumber: "**** **** **** 9999", cardHolder: "Emma Stone", expiry: "10/27" },
      ],
    };

    setTimeout(() => {
      setCustomer(dummyCustomer);
      setLoading(false);
    }, 800); // Simulate loading delay
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!customer) return;
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    setSaving(true);
    setSuccess(false);

    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      console.log("Updated customer:", customer);
    }, 1000); // simulate save delay
  };

  const handleGoHome = () => {
    window.location.href = "/"; // Navigate to home page
  };

  const handleEditCards = () => {
    alert("Redirecting to Edit Cards page...");
  };

  if (loading) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div
    style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "0.5rem",
    }}
    >
    <TopBar />

    {/* Add padding-top to prevent overlap with TopBar */}
    <div className="max-w-md w-full pt-20"> {/* 👈 Adjust padding if TopBar is taller */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl shadow">
        <div>
            <label className="block font-medium mb-1">First Name</label>
            <input
            type="text"
            name="firstName"
            value={customer?.firstName || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div>
            <label className="block font-medium mb-1">Last Name</label>
            <input
            type="text"
            name="lastName"
            value={customer?.lastName || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div>
            <label className="block font-medium mb-1">Email</label>
            <input
            type="email"
            name="email"
            value={customer?.email || ""}
            disabled
            className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
        </div>

        <div>
            <label className="block font-medium mb-1">Status</label>
            <input
            type="text"
            name="status"
            value={customer?.status || ""}
            disabled
            className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
        </div>

        <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
            {saving ? "Saving..." : "Save Changes"}
        </button>

        {success && <p className="text-green-600 text-center mt-2">Profile updated!</p>}
        </form>

        {/* Bookings Section */}
        <div className="mt-10 p-6 rounded-2xl shadow">
        <h3 className="font-semibold text-lg mb-2">Past Bookings</h3>
        {customer?.bookings && customer.bookings.length > 0 ? (
            <ul className="divide-y divide-gray-200">
            {customer.bookings.map((b) => (
                <li key={b.id} className="py-3 text-sm">
                <p className="font-medium">{b.movieTitle}</p>
                <p className="text-gray-500">{b.date}</p>
                </li>
            ))}
            </ul>
        ) : (
            <p className="text-gray-500 text-sm">No bookings found.</p>
        )}
        </div>

        {/* Payment Info Section */}
        <div className="mt-10 p-6 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Saved Payment Cards</h3>
            <button
            onClick={handleEditCards}
            className="text-blue-600 text-sm hover:underline"
            >
            Edit Cards
            </button>
        </div>

        {customer?.paymentInfo && customer.paymentInfo.length > 0 ? (
            <ul className="divide-y divide-gray-200">
            {customer.paymentInfo.map((p, index) => (
                <li key={index} className="py-2 text-sm">
                <p className="font-medium">{p.cardNumber}</p>
                <p className="text-gray-500">
                    {p.cardHolder} — exp: {p.expiry}
                </p>
                </li>
            ))}
            </ul>
        ) : (
            <p className="text-gray-500 text-sm">No payment methods saved.</p>
        )}
        </div>

        <div className="h-12" />
    </div>
    </div>

  );
};

export default EditProfile;
