"use client";

import React, { useEffect, useState } from "react";
import TopBar from "@/app/edit-profile/parts/topBar";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  status: string;
  promotion: string;
  homeAddress: string;
  billingAddress: string;
  phoneNumber: string;
  bookings?: {
    id: string;
    bookingNum: string;
    numTickets: number;
    showTime: string;
    movieTitle: string;
  }[];
  paymentInfo?: { cardNumber: string; expirationDate: string }[];
}

export default function EditProfile({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email } = React.use(params);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isHomeAddressValid, setIsHomeAddressValid] = useState(true);
  const [isBillingAddressValid, setIsBillingAddressValid] = useState(true);

  // Password change states
  const [showOldPasswordPrompt, setShowOldPasswordPrompt] = useState(false);
  const [oldPasswordInput, setOldPasswordInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [verifiedOldPassword, setVerifiedOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/customers/email/${email}`
        );
        if (!res.ok) throw new Error("Failed to fetch customer");
        const data = await res.json();

        const customer: Customer = {
          id: data.id || data._id,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          password: data.password,
          status: data.status,
          promotion: data.promotion,
          homeAddress: data.home_address,
          billingAddress: data.billing_address,
          phoneNumber: data.phone_number,
          bookings: data.bookings?.map((b: any) => ({
            id: b.id || b._id,
            bookingNum: b.bookingNum,
            numTickets: b.num_tickets,
            showTime: b.show_time,
            movieTitle: b.movie_title,
          })),
          paymentInfo: data.payment_info?.map((p: any) => ({
            cardNumber: p.card_number,
            expirationDate: p.expiration_date,
          })),
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

  const validateAddress = (address: string) => {
    const pattern = /^[\w\s.]+,\s*[\w\s.]+,\s*[A-Z]{2}\s*\d{5}$/i;
    return pattern.test(address.trim());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!customer) return;
    const { name, value } = e.target;
    let newValue = value;

    if (name === "phoneNumber") {
      newValue = value.replace(/\D/g, "");
      setIsPhoneValid(/^\d{10}$/.test(newValue));
    }

    if (name === "homeAddress") setIsHomeAddressValid(validateAddress(newValue));
    if (name === "billingAddress")
      setIsBillingAddressValid(validateAddress(newValue));

    setCustomer({ ...customer, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    if (!isPhoneValid || !isHomeAddressValid || !isBillingAddressValid) {
      alert("Please correct invalid fields before saving.");
      return;
    }

    setSaving(true);
    setSuccess(false);

    try {
      const payload = {
        id: customer.id,
        first_name: customer.firstName,
        last_name: customer.lastName,
        promotion: customer.promotion,
        home_address: customer.homeAddress,
        billing_address: customer.billingAddress,
        phone_number: customer.phoneNumber,
        ...(verifiedOldPassword && newPassword
          ? { password: newPassword }
          : {password: customer.password}), // only update password if verified
      };

      const res = await fetch(
        `http://localhost:8080/api/customers/email/${customer.email}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to update customer");
      setSuccess(true);
      setAttempts(0);
      setCustomer((prev) => (prev ? { ...prev, password: newPassword || prev.password } : prev));
      setOldPasswordInput("");
      setNewPassword("");
      setConfirmPassword("");
      setVerifiedOldPassword(false);
      setShowOldPasswordPrompt(false);
    } catch (err) {
      console.error(err);
      alert("Error saving customer profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleOldPasswordSubmit = () => {
    if (!customer) return;

    if (oldPasswordInput === customer.password) {
      setVerifiedOldPassword(true);
      setShowOldPasswordPrompt(false);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        alert("Too many failed attempts. Returning to profile page.");
        window.location.href = `/edit-profile/${customer.email}`;
      } else {
        alert(`Incorrect password. Attempt ${newAttempts} of 3.`);
      }
    }
  };

  useEffect(() => {
    setPasswordMismatch(
      newPassword.length > 0 &&
        confirmPassword.length > 0 &&
        newPassword !== confirmPassword
    );
  }, [newPassword, confirmPassword]);

  if (loading)
    return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="flex flex-col items-center mb-2">
      <TopBar />
      <div className="max-w-md w-full pt-20">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6 rounded-2xl shadow"
        >
          {/* Basic info fields */}
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

          {/* Phone Number */}
          <div>
            <label className="block font-medium mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={customer?.phoneNumber || ""}
              onChange={handleChange}
              maxLength={10}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 transition-all ${
                isPhoneValid
                  ? "border-green-500 focus:ring-green-500"
                  : "border-red-500 focus:ring-red-500"
              }`}
            />
            {!isPhoneValid && (
              <p className="text-red-500 text-sm mt-1">
                Phone number must be exactly 10 digits.
              </p>
            )}
          </div>

          {/* Addresses */}
          <div>
            <label className="block font-medium mb-1">Home Address</label>
            <input
              type="text"
              name="homeAddress"
              value={customer?.homeAddress || ""}
              onChange={handleChange}
              placeholder="123 Main St, Boston, MA 02118"
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 transition-all ${
                isHomeAddressValid
                  ? "border-green-500 focus:ring-green-500"
                  : "border-red-500 focus:ring-red-500"
              }`}
            />
            {!isHomeAddressValid && (
              <p className="text-red-500 text-sm mt-1">
                Please use format: Street, City, ST ZIP
              </p>
            )}
          </div>
          
          {/* Payment Info Section */} 
            <div className="mt-10 p-6 rounded-2xl shadow"> 
              <div className="flex justify-between items-center mb-2"> 
                <h3 className="font-semibold text-lg">Saved Payment Cards</h3> 
                <button onClick={
                  () => (window.location.href = "/edit-cards/${customer?.email}")} 
                  className="text-blue-600 text-sm hover:underline" > Edit Cards </button> 
                  </div> 
                  {customer?.paymentInfo && customer.paymentInfo.length > 0 ? ( 
                    <ul className="divide-y divide-gray-200"> 
                      {customer.paymentInfo.map((p, index) => ( 
                        <li key={index} className="py-2 text-sm"> 
                          <p className="font-medium">{p.cardNumber}</p>
                          <p className="text-gray-500">Experation Date: {p.expirationDate}</p> 
                        </li> ))} 
                    </ul> ) 
                  : ( <p className="text-gray-500 text-sm">No payment methods saved.</p> )} 
            </div>

          <div>
            <label className="block font-medium mb-1">Billing Address</label>
            <input
              type="text"
              name="billingAddress"
              value={customer?.billingAddress || ""}
              onChange={handleChange}
              placeholder="456 Elm St, New York, NY 10001"
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 transition-all ${
                isBillingAddressValid
                  ? "border-green-500 focus:ring-green-500"
                  : "border-red-500 focus:ring-red-500"
              }`}
            />
            {!isBillingAddressValid && (
              <p className="text-red-500 text-sm mt-1">
                Please use format: Street, City, ST ZIP
              </p>
            )}
          </div>

          {/* Promotion */}
          <div>
            <label className="block font-medium mb-1">Promotion Status?</label>
            <select
              name="promotion"
              value={customer?.promotion || ""}
              onChange={(e) =>
                setCustomer((prev) =>
                  prev ? { ...prev, promotion: e.target.value } : prev
                )
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="REGISTERED">Registered</option>
              <option value="UNREGISTERED">Unregistered</option>
            </select>
          </div>

          {/* Change Password Link */}
          {!verifiedOldPassword && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowOldPasswordPrompt(true)}
                className="text-blue-600 text-sm hover:underline"
              >
                Change Password
              </button>
            </div>
          )}

          {/* Old Password Prompt */}
          {showOldPasswordPrompt && (
            <div className="border p-3 rounded-md mt-2">
              <p className="text-sm font-medium mb-2">Enter your old password:</p>
              <input
                type="password"
                value={oldPasswordInput}
                onChange={(e) => setOldPasswordInput(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-2"
              />
              <button
                type="button"
                onClick={handleOldPasswordSubmit}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
              >
                Verify
              </button>
            </div>
          )}

          {/* New Password Fields */}
          {verifiedOldPassword && (
            <div className="border p-4 rounded-md  mt-4">
              <p className="font-medium mb-2">Set a new password(should be at least 8 characters):</p>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-2"
              />
              <input
                type="password"
                placeholder="Re-enter Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full border rounded px-3 py-2 ${
                  passwordMismatch
                    ? "border-red-500 focus:ring-red-500"
                    : "border-green-500 focus:ring-green-500"
                }`}
              />
              {passwordMismatch && (
                <p className="text-red-500 text-sm mt-1">
                  Passwords do not match.
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={
              saving ||
              !isPhoneValid ||
              !isHomeAddressValid ||
              !isBillingAddressValid ||
              (verifiedOldPassword &&
                (passwordMismatch || newPassword.length < 4))
            }
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {success && (
            <p className="text-green-600 text-center mt-2">Profile updated!</p>
          )}
        </form>
        {/* Bookings Section */}
         <div className="mt-10 p-6 rounded-2xl shadow"> 
          <h3 className="font-semibold text-lg mb-2">Past Bookings</h3> 
          {customer?.bookings && customer.bookings.length > 0 ? 
          ( <ul className="divide-y divide-gray-200"> 
          {customer.bookings.map((b, index) => 
            ( <li key={index} className="py-3 text-sm"> 
            <p className="font-medium">{b.movieTitle}</p> 
            <p className="text-gray-500">{b.showTime}</p> 
            </li> ))} 
            </ul> ) : 
            ( <p className="text-gray-500 text-sm">No bookings found.</p> )} 
            </div> 

            
      </div>
    </div>
  );
}
