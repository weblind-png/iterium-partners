"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
        <CheckCircle className="mx-auto text-green-600" size={72} />
        <h1 className="text-2xl font-bold text-[#0A2942] mt-4 mb-3">
          Paiement confirmé ✅
        </h1>
        <p className="text-gray-700 mb-6">
          Merci pour votre confiance.<br />
          Votre contrat et votre facture vous ont été envoyés par e-mail.
        </p>

        <Link
          href="/mon-espace"
          className="inline-block bg-[#0A2942] text-white py-2 px-6 rounded-lg hover:bg-[#103d66] transition"
        >
          Retour à mon espace
        </Link>

        <p className="text-xs text-gray-500 mt-6">
          Une copie de votre contrat et de votre facture a été générée automatiquement par la plateforme ITERIUM PARTNERS.
        </p>
      </div>
    </main>
  );
}