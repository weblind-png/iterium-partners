"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Send, FileText, Euro } from "lucide-react";

export default function ExpertReplyPage() {
  const searchParams = useSearchParams();
  const expertName = searchParams.get("exp") || "Expert";
  const [message, setMessage] = useState("");
  const [addInvoice, setAddInvoice] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/expert-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expertName,
        message,
        addInvoice,
        amount,
        description,
      }),
    });

    if (res.ok) {
      setStatus("success");
      setMessage("");
      setAmount("");
      setDescription("");
    } else {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#0A2942] mb-3">
          Répondre au client
        </h1>
        <p className="text-slate-600 mb-6">
          Bonjour <span className="font-semibold">{expertName}</span>,<br />
          Vous pouvez répondre directement depuis cette interface.
          Votre adresse e-mail reste confidentielle — le message sera
          transmis au client par la plateforme <strong>ITERIUM PARTNERS</strong>.
        </p>

        {status === "success" ? (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Message et devis envoyés avec succès ! Le client recevra votre réponse sous peu.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              rows="6"
              className="w-full border rounded-xl p-3 text-slate-700 focus:ring-2 focus:ring-[#F8B400] outline-none"
              placeholder="Votre réponse au client..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            {/* Bloc facturation optionnelle */}
            <div className="border-t pt-4">
              <label className="flex items-center gap-2 text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={addInvoice}
                  onChange={() => setAddInvoice(!addInvoice)}
                />
                Joindre un devis / facturation
              </label>

              {addInvoice && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-sm text-slate-600">Montant (€ HT)</label>
                    <div className="flex items-center border rounded-xl px-3">
                      <Euro className="h-4 w-4 text-slate-500 mr-2" />
                      <input
                        type="number"
                        min="50"
                        step="10"
                        className="w-full py-2 outline-none"
                        placeholder="Ex: 450"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Description</label>
                    <textarea
                      rows="2"
                      className="w-full border rounded-xl p-3 text-slate-700 focus:ring-2 focus:ring-[#F8B400] outline-none"
                      placeholder="Ex: Intervention comptable - audit de conformité"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full flex items-center justify-center gap-2 bg-[#0A2942] hover:bg-[#062032] text-white rounded-xl py-3"
            >
              {status === "sending" ? "Envoi en cours..." : (
                <>
                  <Send className="h-4 w-4" /> Envoyer la réponse
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}