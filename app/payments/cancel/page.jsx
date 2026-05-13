"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCancelledEN() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
        <XCircle className="mx-auto text-red-500" size={72} />
        <h1 className="text-2xl font-bold text-[#0A2942] mt-4 mb-3">
          Payment cancelled ❌
        </h1>
        <p className="text-gray-700 mb-6">
          Your payment has not been completed.<br />
          You can retry your transaction anytime.
        </p>

        <Link
          href="/payments"
          className="inline-block bg-[#0A2942] text-white py-2 px-6 rounded-lg hover:bg-[#103d66] transition"
        >
          Back to payment
        </Link>

        <p className="text-xs text-gray-500 mt-6">
          No amount has been charged. If you experienced a technical issue, please try again or contact ITERIUM PARTNERS Support.
        </p>
      </div>
    </main>
  );
}