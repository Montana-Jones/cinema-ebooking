"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  bookings?: any[];
  paymentInfo?: any[];
}

const EditProfile: React.FC = () => {
  // Replace with actual logged-in customer's ID
  const customerId = "670c5b7a2e0b6b0012a2f123";

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch customer data on page load
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get<Customer>(`http://localhost:8080/api/customers/${customerId}`);
        setCustomer(res.data);
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!customer) return;
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      await axios.put(`http://localhost:8080/api/customers/${customerId}`, customer);
      setSuccess(true);
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!customer) return <div className="text-center mt-10">No customer data found.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-xl rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={customer.firstName}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={customer.lastName}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            value={customer.status}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {success && <p className="text-green-600 text-center mt-2">Profile updated!</p>}
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </form>

      {/* Optional: Show linked bookings or payment info */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Linked Bookings</h3>
        {customer.bookings && customer.bookings.length > 0 ? (
          <ul className="list-disc ml-6 text-sm">
            {customer.bookings.map((b, i) => (
              <li key={i}>{b.id || "Booking ID not available"}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No bookings yet.</p>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
