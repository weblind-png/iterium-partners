"use client";

import { useState } from "react";

export default function PaymentPage() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!acceptedTerms) {
      alert("Please accept the Terms and Conditions before continuing.");
      return;
    }

    setLoading(true);
    try {
      // 🔗 Trigger Stripe checkout session or your payment endpoint
      const res = await fetch("/api/checkout-session", { method: "POST" });
      const session = await res.json();

      if (session?.url) {
        window.location.href = session.url;
      } else {
        alert("Error: Unable to create the payment session.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#0A2942] mb-6">
          Secure Payment
        </h1>

        <p className="text-gray-700 text-center mb-6">
          You are about to confirm your order.
        </p>

        {/* ✅ Checkbox for Terms & Conditions */}
        <label className="flex items-start space-x-2 mb-6">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 accent-[#0A2942]"
          />
          <span className="text-sm text-gray-700">
            I have read and accept the{" "}
            <a
              href="/legal/Terms_And_Conditions_ITERIUM_PARTNERS.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0A2942] underline hover:text-[#103d66]"
            >
              Terms and Conditions of Use
            </a>{" "}
            of the ITERIUM PARTNERS platform.
          </span>
        </label>

        {/* ✅ Payment button disabled until Terms are accepted */}
        <button
          onClick={handlePayment}
          disabled={!acceptedTerms || loading}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            acceptedTerms
              ? "bg-[#0A2942] text-white hover:bg-[#103d66]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Redirecting..." : "Proceed to Payment"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          By validating, you will be redirected to the secure Stripe payment page.
        </p>
      </div>
    </main>
  );
}