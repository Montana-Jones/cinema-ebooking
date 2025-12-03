"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";

type PaymentCard = {
  cardHolder: string;
  cardNumber: string;
  expirationDate: string;
  cvv?: string;
};

export default function Signup() {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [paymentInfo, setPaymentInfo] = useState<PaymentCard[]>([]);
  const [promotionsOptIn, setPromotionsOptIn] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const validateAddress = (address: string) => {
    return /^[a-zA-Z0-9\s,.-]{5,}$/.test(address.trim());
  };

  const validateCard = (card: PaymentCard) => {
    const errs: string[] = [];
    const cardNumber = card.cardNumber.replace(/\s+/g, "");
    if (!/^\d{13,19}$/.test(cardNumber))
      errs.push("Card number must be 13–19 digits");
    if (!/^[A-Za-z]+(\s[A-Za-z]+)+$/.test(card.cardHolder))
      errs.push("Card holder must be full name");
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expirationDate))
      errs.push("Expiration must be MM/YY");
    if (card.cvv && !/^\d{3,4}$/.test(card.cvv))
      errs.push("CVV must be 3–4 digits");
    return errs;
  };

  const handleCardChange = (
    index: number,
    field: keyof PaymentCard,
    value: string
  ) => {
    const newCards = [...paymentInfo];
    newCards[index] = { ...newCards[index], [field]: value };
    setPaymentInfo(newCards);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!/^\d{10}$/.test(phoneNumber))
      newErrors.push("Phone number must be 10 digits");
    if (!validateAddress(homeAddress)) newErrors.push("Home address invalid");
    if (!validateAddress(billingAddress))
      newErrors.push("Billing address invalid");
    if (password.length < 8)
      newErrors.push("Password must be at least 8 characters");
    if (password !== confirmPassword) newErrors.push("Passwords do not match");

    paymentInfo.forEach((card, i) => {
      if (card.cardNumber || card.cardHolder || card.expirationDate || card.cvv) {
        const cardErrors = validateCard(card).map(
          (err) => `Card ${i + 1}: ${err}`
        );
        newErrors.push(...cardErrors);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    // Build signupData object for logging and fetch
    const signupData = {
      firstname: firstName,
      lastname: lastName,
      email,
      phonenumber: phoneNumber,
      homeaddress: homeAddress,
      billingaddress: billingAddress,
      password,
      promotion: promotionsOptIn ? "REGISTERED" : "UNREGISTERED",
      payment_info: paymentInfo
        .filter(c => c.cardNumber || c.cardHolder || c.expirationDate || c.cvv)
        .map(c => ({
          card_holder: c.cardHolder,
          card_number: c.cardNumber,
          expiration_date: c.expirationDate,
          cvv: c.cvv,
        })),
    };

    try {
      const res = await fetch("http://localhost:8080/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      if (!res.ok) {
        const backendMessage = await res.text();
        throw new Error(backendMessage || "Signup failed");
      }

      const data = await res.json();
      setUserId(data.id);
      setStep("verify");
      setErrors([]);
    } catch (err: any) {
      console.error(err);
      setErrors([err.message || "Server error: failed to register"]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:8080/api/users/verify/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });

      if (!res.ok) throw new Error("Verification failed");

      setSuccess(true);
      setErrors([]);
    } catch {
      setErrors(["Invalid verification code"]);
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "verify") {
    return (
      <div className="flex flex-col items-center mb-10">
        <Navbar />
        <div className="max-w-md w-full pt-20">
          <form
            onSubmit={handleVerify}
            className="space-y-4 p-6 rounded-2xl shadow bg-[#131313]"
          >
            <h2 className="text-2xl font-semibold text-center text-[#675068] mb-4">
              Email Verification
            </h2>

            {errors.length > 0 && (
              <ul className="text-red-500 text-sm mb-2 list-disc list-inside">
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            )}

            {success && (
              <p className="text-green-600 text-center">
                Your account is verified! You can now log in.
              </p>
            )}

            <input
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={submitting || success}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {submitting ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mb-10">
      <Navbar />
      <div className="max-w-md w-full pt-20">
        <form
          onSubmit={handleSignup}
          className="space-y-4 p-6 rounded-2xl shadow bg-[#131313]"
        >
          <h2 className="text-2xl font-semibold text-center text-[#675068] mb-4">
            Sign Up
          </h2>

          {errors.length > 0 && (
            <ul className="text-red-500 text-sm mb-2 list-disc list-inside">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          )}

          {/* Personal Fields */}
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            placeholder="Phone Number (10 digits)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
            maxLength={10}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            placeholder="Home Address"
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            placeholder="Billing Address"
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Promotion Checkbox */}
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={promotionsOptIn}
              onChange={(e) => setPromotionsOptIn(e.target.checked)}
              className="w-5 h-5 accent-[#75D1A6]"
            />
            <label className="text-white text-sm">Send me promotions</label>
          </div>

          {/* Payment Cards */}
          <h3 className="font-semibold text-[#675068] mt-4">
            Payment Cards (Optional)
          </h3>

          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border p-3 rounded-lg mb-2">
              <p className="font-medium mb-1">Card {i + 1}</p>

              <input
                type="text"
                placeholder="Card Number"
                value={paymentInfo[i]?.cardNumber || ""}
                onChange={(e) =>
                  handleCardChange(i, "cardNumber", e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2 mb-1"
              />

              <input
                type="text"
                placeholder="Card Holder Name"
                value={paymentInfo[i]?.cardHolder || ""}
                onChange={(e) =>
                  handleCardChange(i, "cardHolder", e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2 mb-1"
              />

              <input
                type="text"
                placeholder="Expiration (MM/YY)"
                value={paymentInfo[i]?.expirationDate || ""}
                onChange={(e) =>
                  handleCardChange(i, "expirationDate", e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2 mb-1"
              />

              <input
                type="text"
                placeholder="CVV"
                value={paymentInfo[i]?.cvv || ""}
                onChange={(e) => handleCardChange(i, "cvv", e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {submitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
