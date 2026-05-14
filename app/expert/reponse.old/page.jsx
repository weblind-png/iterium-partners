"use client";
import React, { useState, useEffect } from "react";
import { FileText, Euro, Clock, Send, CheckCircle2, Lock } from "lucide-react";

export default function ExpertResponsePage() {
  const [reqId, setReqId] = useState("");
  const [clientNeed, setClientNeed] = useState("");
  const [proposal, setProposal] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
  });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "REQ-2025-0001";
    setReqId(id);

    // Simulation du besoin client récupéré
    setClientNeed("Audit de conformité RGPD urgent suite à incident cybersécurité.");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => setSent(true), 1000); // simulation envoi via relay
  };

  if (sent) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center text-slate-800">
        <div className="text-center p-8 max-w-md">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h1 className="text-2xl font-semibold text-[#0A2942]">Devis envoyé !</h1>
          <p className="text-slate-600 mt-2">
            Votre proposition a été transmise au client via le relais sécurisé ITERIUM PARTNERS.
            Vous recevrez une notification si le client la valide et procède au paiement.
          </p>
          <div className="mt-6">
            <a href="/" className="bg-[#0A2942] text-white rounded-xl px-6 py-3 hover:bg-[#062032]">
              Retour à l’accueil
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-10 w-auto" />
            <div>
              <p className="font-semibold text-[#0A2942]">ITERIUM PARTNERS</p>
              <p className="text-xs text-slate-500">Réponse expert — Proposition de devis</p>
            </div>
          </div>
          <a href="/" className="text-sm text-slate-600 hover:text-[#0A2942]">
            Déconnexion
          </a>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-[#0A2942] mb-2">
          Répondre à la demande {reqId}
        </h1>
        <p className="text-slate-600 mb-8">
          Vous répondez à une demande transmise via ITERIUM PARTNERS.  
          Votre message et votre devis seront envoyés au client de manière confidentielle via notre relais.
        </p>

        <div className="bg-white p-8 rounded-2xl shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#0A2942]" /> Besoin client
          </h2>
          <p className="text-slate-700">{clientNeed}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Titre du devis
            </label>
            <input
              required
              type="text"
              value={proposal.title}
              onChange={(e) => setProposal({ ...proposal, title: e.target.value })}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2942]"
              placeholder="Ex : Accompagnement audit RGPD post-incident"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Détails / Description
            </label>
            <textarea
              required
              rows={5}
              value={proposal.description}
              onChange={(e) => setProposal({ ...proposal, description: e.target.value })}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2942]"
              placeholder="Décrivez en quelques lignes votre accompagnement proposé, vos étapes ou livrables..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Euro className="inline h-4 w-4 mr-1 text-[#0A2942]" /> Tarif total proposé (€)
              </label>
              <input
                required
                type="number"
                min="0"
                value={proposal.price}
                onChange={(e) => setProposal({ ...proposal, price: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2942]"
                placeholder="Ex : 1200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Clock className="inline h-4 w-4 mr-1 text-[#0A2942]" /> Durée estimée
              </label>
              <input
                required
                type="text"
                value={proposal.duration}
                onChange={(e) => setProposal({ ...proposal, duration: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2942]"
                placeholder="Ex : 2 jours"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0A2942] text-white rounded-xl py-3 text-base font-medium hover:bg-[#062032]"
          >
            <Send className="inline h-4 w-4 mr-2" /> Envoyer ma proposition au client
          </button>
        </form>

        <div className="mt-6 text-xs text-slate-500 flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Les échanges sont relayés et archivés pour garantir confidentialité et conformité RGPD.
        </div>
      </section>
    </main>
  );
}