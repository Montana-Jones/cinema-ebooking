"use client";

import React, {use,  useEffect, useState } from "react";
import TopBar from "@/app/dummy-edit-profile/parts/topBar";

interface CustomerProps {
  params: { email: string };
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  bookings?: { id: string; movieTitle: string; date: string }[];
  paymentInfo?: { cardNumber: string; cardHolder: string; expiry: string }[];
}

export default function EditProfile({ params }: { params: Promise<{ email: string }> }) {
  // ✅ unwrap the Promise
  const { email } = use(params);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
 

  useEffect(() => {
  const fetchCustomer = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/customers/email/${email}`);
      if (!res.ok) throw new Error("Failed to fetch customer");
      const data = await res.json();

      // Map snake_case to camelCase
      const customer = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        status: data.status,
        bookings: data.bookings?.map((b: any) => ({
          id: b.id,
          movieTitle: b.movie_title,
          date: b.show_time,
        })),
        paymentInfo: data.payment_info || [],
      };

      setCustomer(customer);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchCustomer();
}, [email]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!customer) return;
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!customer) return;

  setSaving(true);
  setSuccess(false);

  try {
    // Map camelCase to snake_case
    const payload = {
      id: customer.id,
      first_name: customer.firstName,
      last_name: customer.lastName,
      email: customer.email,
      status: customer.status,
      bookings: customer.bookings?.map(b => ({
        id: b.id,
        movie_title: b.movieTitle,
        show_time: b.date,
      })),
      payment_info: customer.paymentInfo || [],
    };

    const res = await fetch(`http://localhost:8080/api/customers/email/${customer.email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update customer");
    setSuccess(true);
  } catch (err) {
    console.error(err);
    alert("Error saving customer profile.");
  } finally {
    setSaving(false);
  }
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
        <div className="max-w-md w-full pt-20"> 
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
    
            {/* Change Password Link */}
            <div className="text-right">
              <a
                href="/change-password"
                className="text-blue-600 text-sm hover:underline"
              >
                Change Password
              </a>
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
                  onClick={() => (window.location.href = "/edit-cards")}
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


