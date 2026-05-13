"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle2, FileText, ShieldCheck, Clock, Euro, CreditCard } from "lucide-react";

export default function ValidationClientPage({ params }) {
  const [proposition, setProposition] = useState(null);
  const [acceptConditions, setAcceptConditions] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: null });
  const [stripeLoading, setStripeLoading] = useState(false);

  // 🔹 Simuler la récupération de la proposition (dans une vraie version, elle viendrait d’une DB)
  useEffect(() => {
    // Idéalement, tu appellerais ici un fetch `/api/propositions/[id]`
    setProposition({
      id: params.id,
      expert: "Jean Dupont",
      domaine: "Cybersécurité",
      description: "Audit d’urgence suite à une attaque ransomware",
      duree: 2,
      tjm: 950,
      type: "Immédiate",
      devis: "/uploads/devis/exemple.pdf",
      commentaire: "Disponibilité immédiate – intervention à distance possible",
    });
  }, [params.id]);

  const handlePaiement = async () => {
    if (!acceptConditions) {
      setStatus({ error: "Vous devez accepter les conditions avant de continuer." });
      return;
    }
    setStripeLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "expert-proposition",
          amount: proposition.duree * proposition.tjm,
          description: `Mission ${proposition.id} - ${proposition.expert}`,
        }),
      });
      const data = await res.json();
      if (!data.url) throw new Error("Erreur création session Stripe");
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setStatus({ error: err.message });
      setStripeLoading(false);
    }
  };

  if (!proposition)
    return (
      <main className="min-h-screen flex items-center justify-center text-slate-600">
        Chargement de la proposition...
      </main>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
      <header className="sticky top-0 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-[#0A2942]">Validation de la proposition</h1>
          <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-8" />
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-[#0A2942] mb-6">
          Mission proposée par {proposition.expert}
        </h2>

        <div className="border rounded-2xl bg-white shadow-sm p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-slate-700">
              <FileText className="h-5 w-5 text-[#F8B400]" />
              <span><strong>Domaine :</strong> {proposition.domaine}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="h-5 w-5 text-[#F8B400]" />
              <span><strong>Durée :</strong> {proposition.duree} jour(s)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Euro className="h-5 w-5 text-[#F8B400]" />
            <span><strong>TJM :</strong> {proposition.tjm} €</span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="h-5 w-5 text-[#F8B400]" />
            <span><strong>Type :</strong> {proposition.type}</span>
          </div>

          <p className="text-slate-600 mt-4">{proposition.description}</p>
          {proposition.commentaire && (
            <p className="text-slate-500 italic">💬 {proposition.commentaire}</p>
          )}

          <a
            href={proposition.devis}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-[#0A2942] underline hover:text-[#F8B400]"
          >
            📎 Télécharger le devis de {proposition.expert}
          </a>
        </div>

        <div className="mt-8 p-6 bg-slate-50 border rounded-2xl">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptConditions}
              onChange={(e) => setAcceptConditions(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-slate-600">
              J’accepte les <strong>conditions d’intervention ITERIUM PARTNERS</strong>, incluant :
              <ul className="list-disc list-inside mt-1 text-slate-500">
                <li>Engagement de disponibilité de l’expert selon les termes convenus</li>
                <li>Confidentialité & conformité RGPD</li>
                <li>Paiement via plateforme sécurisée Stripe</li>
                <li>Archivage automatique du contrat d’intervention</li>
              </ul>
            </span>
          </label>
        </div>

        {status.error && (
          <div className="text-red-600 mt-3 bg-red-50 border border-red-300 rounded-xl p-3 text-sm">
            ❌ {status.error}
          </div>
        )}

        <button
          onClick={handlePaiement}
          disabled={!acceptConditions || stripeLoading}
          className="mt-6 w-full bg-[#0A2942] text-white py-3 rounded-xl hover:bg-[#062032] flex items-center justify-center gap-2"
        >
          <CreditCard className="h-5 w-5" />
          {stripeLoading
            ? "Redirection vers Stripe..."
            : `Procéder au paiement sécurisé (${proposition.duree * proposition.tjm} €)`}
        </button>

        <p className="text-xs text-center mt-3 text-slate-500">
          Une fois le paiement validé, un contrat d’intervention sera généré automatiquement et transmis à l’expert et au client.
        </p>
      </section>

      <footer className="border-t py-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} ITERIUM PARTNERS — Validation Client Sécurisée
      </footer>
    </main>
  );
}