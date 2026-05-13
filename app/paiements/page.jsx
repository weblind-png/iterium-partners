"use client";

import { useState } from "react";

export default function PaiementPage() {
  const [acceptedCGU, setAcceptedCGU] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!acceptedCGU) {
      alert("Merci d'accepter les Conditions Générales d’Utilisation avant de poursuivre.");
      return;
    }

    setLoading(true);
    try {
      // Ici tu peux déclencher ton appel à Stripe ou ton endpoint de paiement
      const res = await fetch("/api/checkout-session", { method: "POST" });
      const session = await res.json();

      if (session?.url) {
        window.location.href = session.url;
      } else {
        alert("Erreur : impossible de créer la session de paiement.");
      }
    } catch (error) {
      console.error("Erreur lors du paiement :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#0A2942] mb-6">
          Paiement sécurisé
        </h1>

        <p className="text-gray-700 text-center mb-6">
          Vous êtes sur le point de confirmer votre commande.
        </p>

        {/* ✅ Case à cocher CGU */}
        <label className="flex items-start space-x-2 mb-6">
          <input
            type="checkbox"
            checked={acceptedCGU}
            onChange={(e) => setAcceptedCGU(e.target.checked)}
            className="mt-1 accent-[#0A2942]"
          />
          <span className="text-sm text-gray-700">
            J’ai lu et j’accepte les{" "}
            <a
              href="/legal/CGU_ITERIUM_PARTNERS.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0A2942] underline hover:text-[#103d66]"
            >
              Conditions Générales d’Utilisation
            </a>{" "}
            de la plateforme ITERIUM PARTNERS.
          </span>
        </label>

        {/* ✅ Bouton de paiement désactivé tant que la case n’est pas cochée */}
        <button
          onClick={handlePayment}
          disabled={!acceptedCGU || loading}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            acceptedCGU
              ? "bg-[#0A2942] text-white hover:bg-[#103d66]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Redirection..." : "Procéder au paiement"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          En validant, vous serez redirigé vers la page Stripe pour finaliser votre paiement en toute sécurité.
        </p>
      </div>
    </main>
  );
}