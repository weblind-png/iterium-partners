"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCancelled() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
        <XCircle className="mx-auto text-red-500" size={72} />
        <h1 className="text-2xl font-bold text-[#0A2942] mt-4 mb-3">
          Paiement annulé ❌
        </h1>
        <p className="text-gray-700 mb-6">
          Votre paiement n’a pas été finalisé.<br />
          Vous pouvez réessayer à tout moment.
        </p>

        <Link
          href="/paiements"
          className="inline-block bg-[#0A2942] text-white py-2 px-6 rounded-lg hover:bg-[#103d66] transition"
        >
          Revenir au paiement
        </Link>

        <p className="text-xs text-gray-500 mt-6">
          Aucun montant n’a été débité. Si vous avez rencontré un problème technique, veuillez réessayer ou contacter le support ITERIUM PARTNERS.
        </p>
      </div>
    </main>
  );
}