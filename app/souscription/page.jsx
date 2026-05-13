"use client";
import React, { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

export default function SouscriptionPage() {
  const [loading, setLoading] = useState(false);

  async function handlePayment(plan) {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirection Stripe Checkout
      } else {
        alert("Erreur lors de la création du paiement.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Erreur paiement:", error);
      alert("Erreur inattendue, réessayez.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-[#0A2942]">Souscrire à ITERIUM PARTNERS</h1>
        <p className="text-slate-600 mb-6 text-sm">
          Choisissez votre formule et procédez au paiement sécurisé via Stripe.
        </p>

        <div className="grid gap-4">
          <button
            onClick={() => handlePayment("standard")}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-[#0A2942] text-white py-3 rounded-xl hover:bg-[#062032]"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
            {loading ? "Création de la session..." : "Payer 490 € - Standard Entreprise"}
          </button>

          <button
            onClick={() => handlePayment("premium")}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-[#F8B400] text-[#0A2942] py-3 rounded-xl hover:bg-[#e0a000]"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
            {loading ? "Création de la session..." : "Payer 1 290 € - Premium Groupe"}
          </button>
        </div>
      </div>
    </main>
  );
}