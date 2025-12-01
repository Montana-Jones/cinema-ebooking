"use client";

import React, { use, useEffect, useState } from "react";
import TopBar from "@/app/edit-profile/parts/topBar";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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
  paymentInfo?: { cardHolder: string; cardNumber: string; expirationDate: string; cvv?: string }[];
}

interface User {
  email: string;
}

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
  const [user, setUser] = useState<User | null>(null);

  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isHomeAddressValid, setIsHomeAddressValid] = useState(true);
  const [isBillingAddressValid, setIsBillingAddressValid] = useState(true);
  const [bookings, setBookings] = useState<booking[]>([]);

  // Password change states
  const [showOldPasswordPrompt, setShowOldPasswordPrompt] = useState(false);
  const [oldPasswordInput, setOldPasswordInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [verifiedOldPassword, setVerifiedOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const [showCardEditor, setShowCardEditor] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/users/email/${email}`
        );
        if (!res.ok) throw new Error("Failed to fetch customer");
        const data = await res.json();

        const customer: Customer = {
          id: data.id || data._id,
          firstName: data.firstname,
          lastName: data.lastname,
          email: data.email,
          password: data.password,
          status: data.status,
          promotion: data.promotion,
          homeAddress: data.homeaddress,
          billingAddress: data.billingaddress,
          phoneNumber: data.phonenumber,
          paymentInfo: data.payment_info?.map((p: any) => ({
            cardHolder: p.card_holder,
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

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/bookings/email/${email}`
        );
        if (!res.ok) throw new Error("Failed to fetch customer");
        const data = await res.json();

    
        setBookings(data);
        console.log("Fetched bookings:", data);
       
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [email]);

  


  console.log("Name:", customer?.firstName, customer?.lastName);

// Handle card input changes
type PaymentCard = {
  cardHolder: string;
  cardNumber: string;
  expirationDate: string;
  cvv?: string;
};

const handleCardChange = (index: number, field: keyof PaymentCard, value: string) => {
  setCustomer((prev) => {
    if (!prev) return prev;
    const updated = [...(prev.paymentInfo || [])] as PaymentCard[];
    while (updated.length < 3) updated.push({ cardHolder: "", cardNumber: "", expirationDate: "", cvv: "" });
    updated[index] = {
      ...(updated[index] || { cardHolder: "", cardNumber: "", expirationDate: "", cvv: "" }),
      [field]: value,
    };
    return { ...prev, paymentInfo: updated };
  });
};


// Detect duplicate card numbers
const hasDuplicateCard = (index: number): boolean => {
  if (!customer?.paymentInfo) return false;
  const currentCard = customer.paymentInfo[index]?.cardNumber?.trim();
  if (!currentCard) return false;
  return customer.paymentInfo.some(
    (c, i) => i !== index && c.cardNumber.trim() === currentCard
  );
};

// Save updated cards to backend — removed duplicate; the validated handleSaveCards implementation appears later in the file.




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


    const validateCardFields = (card: Partial<PaymentCard> = {}, index: number): Record<string, string> => {
      const errors: Record<string, string> = {};

      const cardNumber = (card.cardNumber || "").replace(/\s+/g, "");
      const name = card.cardHolder?.trim() || "";
      const exp = card.expirationDate?.trim() || "";
      const cvv = card.cvv?.trim() || "";

      // If all fields are blank — skip validation
      if (!cardNumber && !name && !exp && !cvv) return errors;

      // Card number: must be digits 13–19
      if (!/^\d{13,19}$/.test(cardNumber)) {
        errors.cardNumber = "Invalid card number (must be 13–19 digits).";
      } else if (hasDuplicateCard(index)) {
        errors.cardNumber = "This card number is already used.";
      }

      // Card holder: must have at least two names
      if (!/^[A-Za-z]+(\s[A-Za-z]+)+$/.test(name)) {
        errors.cardHolder = "Enter a valid full name (first and last).";
      }

      // Expiration: MM/YY format and not expired
      const expMatch = exp.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
      if (!expMatch) {
        errors.expirationDate = "Invalid format (MM/YY).";
      } else {
        const [_, month, year] = expMatch;
        const expYear = Number(`20${year}`);
        const expMonthIndex = Number(month) - 1; // convert to 0-based month index
        // Card is valid through the end of the expiration month — build a Date at the
        // last millisecond of that month for a correct comparison against now.
        const expDate = new Date(expYear, expMonthIndex + 1, 0, 23, 59, 59, 999);
        if (expDate < new Date()) {
          errors.expirationDate = "Card has expired.";
        }
      }

      // CVV: 3–4 digits
      if (!/^\d{3,4}$/.test(cvv)) {
        errors.cvv = "Invalid CVV (must be 3–4 digits).";
      }

      return errors;
    };

    const handleSaveCards = async () => {
      if (!customer) return;

      // Validate all cards
      const hasErrors = (customer.paymentInfo || [])
        .slice(0, 3)
        .some((card, i) => Object.keys(validateCardFields(card, i)).length > 0);

      if (hasErrors) {
        alert("Please fix validation errors before saving.");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8080/api/users/email/${customer.email}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...customer,
              payment_info: (customer.paymentInfo || []).map((c) => ({
                card_holder: c.cardHolder,
                card_number: c.cardNumber,
                expiration_date: c.expirationDate,
                cvv: c.cvv,
              })),
            }),
          }
        );

        if (!res.ok) throw new Error("Failed to update cards");
        alert("Cards saved successfully!");
        setShowCardEditor(false);
      } catch (err) {
        console.error(err);
        alert("Error saving cards.");
      }
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
        const basePayload = {
          id: customer.id,
          firstname: customer.firstName,
          lastname: customer.lastName,
          promotion: customer.promotion,
          homeaddress: customer.homeAddress,
          billingaddress: customer.billingAddress,
          phonenumber: customer.phoneNumber,
        };

        const payload = verifiedOldPassword && newPassword
          ? { ...basePayload, password: newPassword }
          : basePayload;

        const res = await fetch(
          `http://localhost:8080/api/users/email/${customer.email}`,
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

  const handleOldPasswordSubmit = async () => {
    if (!customer) return;

    try {
      const res = await fetch(`http://localhost:8080/api/users/verify-password/${customer.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: oldPasswordInput }),
      });

      const isValid = await res.json();

      if (isValid ) {
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
    } catch (err) {
      console.error(err);
      alert("Error verifying password.");
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

  if (!user || !customer || user.email !== customer.email) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <Navbar />
        <p className="text-lg mb-6">Access denied.</p>
        <Link
          href="/"
          className="bg-[#4c3b4d] px-4 py-3 rounded-2xl text-lg font-medium hover:bg-[#5d4561]"
        >
          Go back home
        </Link>
      </div>
    );
  }
  
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
                <button
                  onClick={() => setShowCardEditor(true)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Edit Cards
                </button>
 
              </div> 
              {customer?.paymentInfo && customer.paymentInfo.length > 0 ? ( 
                <ul className="divide-y divide-gray-200"> 
                  {customer.paymentInfo.map((p, index) => ( 
                    <li key={index} className="py-2 text-sm"> 
                      <p className="font-medium">Card Number: {p.cardNumber}</p>
                      <p className="text-gray-500">Experation Date: {p.expirationDate}</p>
                      <p className="text-gray-500">Card Holder Name: {p.cardHolder}</p> 
                    </li> ))} 
                </ul> ) 
                  : ( <p className="text-gray-500 text-sm">No payment methods saved.</p> )} 
            </div>

            {showCardEditor && (
              <div className=" inset-0 flex items-center justify-center z-50">
                <div className=" p-6 rounded-2xl shadow-lg w-full max-w-lg relative">
                  <button
                    onClick={() => setShowCardEditor(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>

                  <h2 className="text-xl font-semibold mb-4">Edit Payment Cards</h2>

                  {Array.from({ length: 3 }).map((_, index) => {
                    const card = customer?.paymentInfo?.[index] || {
                      cardHolder: "",
                      cardNumber: "",
                      expirationDate: "",
                      cvv: "",
                    };

                    const errors = validateCardFields(card, index);

                    return (
                      <div key={index} className="border p-4 rounded-lg mb-3">
                        <h3 className="font-medium mb-2">Card {index + 1}</h3>

                        {/* Card Number */}
                        <label className="block text-sm font-medium mb-1">Card Number</label>
                        <input
                          type="text"
                          placeholder="e.g. 4111111111111111"
                          value={card.cardNumber ?? ""}
                          onChange={(e) => handleCardChange(index, "cardNumber", e.target.value)}
                          className={`w-full border rounded-lg px-3 py-2 mb-1 ${
                            errors.cardNumber ? "border-red-500" : "border-gray-300"
                          }`}
                          maxLength={19}
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-sm mb-2">{errors.cardNumber}</p>
                        )}

                        {/* Card Holder */}
                        <label className="block text-sm font-medium mb-1">Card Holder Name</label>
                        <input
                          type="text"
                          placeholder="e.g. John Doe"
                          value={card.cardHolder ?? ""}
                          onChange={(e) => handleCardChange(index, "cardHolder", e.target.value)}
                          className={`w-full border rounded-lg px-3 py-2 mb-1 ${
                            errors.cardHolder ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.cardHolder && (
                          <p className="text-red-500 text-sm mb-2">{errors.cardHolder}</p>
                        )}

                        {/* Expiration Date */}
                        <label className="block text-sm font-medium mb-1">Expiration Date (MM/YY)</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={card.expirationDate ?? ""}
                          onChange={(e) =>
                            handleCardChange(index, "expirationDate", e.target.value)
                          }
                          className={`w-full border rounded-lg px-3 py-2 mb-1 ${
                            errors.expirationDate ? "border-red-500" : "border-gray-300"
                          }`}
                          maxLength={5}
                        />
                        {errors.expirationDate && (
                          <p className="text-red-500 text-sm mb-2">{errors.expirationDate}</p>
                        )}

                        {/* CVV */}
                        <label className="block text-sm font-medium mb-1">CVV</label>
                        <input
                          type="text"
                          placeholder="3 digits"
                          value={card.cvv ?? ""}
                          onChange={(e) => handleCardChange(index, "cvv", e.target.value)}
                          className={`w-full border rounded-lg px-3 py-2 mb-1 ${
                            errors.cvv ? "border-red-500" : "border-gray-300"
                          }`}
                          maxLength={4}
                        />
                        {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
                      </div>
                    );
                  })}

                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => setShowCardEditor(false)}
                      className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveCards}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Save Cards
                    </button>
                  </div>
                </div>
              </div>
            )}




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
                (passwordMismatch || newPassword.length < 8))
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
          {bookings && bookings.length > 0 ? 
          ( <ul className="divide-y divide-gray-200"> 
          {bookings.map((b, index) => 
            ( <li key={index} className="py-3 text-sm"> 
            <p className="font-medium">{b.movie_title}</p> 
            <p className="text-gray-500">Show time: {b.date} at {b.start_time}</p> 
            <p className="text-gray-500">Booking Number: {b.booking_num}</p> 
            <p className="text-gray-500">Total: ${b.total_price}</p> 
            </li> ))} 
            </ul> ) : 
            ( <p className="text-gray-500 text-sm">No bookings found.</p> )} 
            </div> 

            
      </div>
    </div>
  );
}