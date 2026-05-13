"use client";
import React, { useState, useEffect } from "react";
import { FileText, Euro, CheckCircle2, CreditCard, Lock, CalendarDays } from "lucide-react";

export default function DevisPage({ params }) {
  const [devis, setDevis] = useState(null);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const id = params?.id || "REQ-2025-0001";

    // Simulation : récupération du devis envoyé par l’expert
    setDevis({
      id,
      expert: "Karim — Juriste RGPD / DPO",
      clientNeed: "Audit de conformité RGPD urgent suite à incident cybersécurité.",
      title: "Accompagnement audit RGPD post-incident",
      description:
        "Réalisation d’un audit complet des traitements de données, revue du registre et plan de remédiation rapide. Livraison d’un rapport et d’un plan d’action priorisé.",
      price: 1200,
      duration: "2 jours",
      commission: 10, // pourcentage plateforme
    });
  }, [params]);

  const handlePayment = () => {
    setTimeout(() => {
      setPaid(true);
    }, 1500); // simulation paiement Stripe
  };

  if (!devis) return null;

  const total = devis.price;
  const commissionAmount = (total * devis.commission) / 100;
  const totalWithCommission = total + commissionAmount;

  if (paid) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 text-slate-800">
        <div className="text-center p-8 max-w-md">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h1 className="text-2xl font-semibold text-[#0A2942] mb-2">Paiement confirmé</h1>
          <p className="text-slate-600">
            Merci, votre devis a été validé et le paiement de <strong>{totalWithCommission} €</strong> a bien été enregistré.
          </p>
          <div className="bg-white border rounded-2xl shadow-sm mt-6 p-6 text-left text-sm text-slate-700">
            <p className="font-medium mb-2">Prochaine étape :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>L’expert recevra la confirmation de paiement.</li>
              <li>Vous serez invité à <strong>planifier une visio Teams</strong> selon vos disponibilités.</li>
              <li>Un lien Teams sera généré automatiquement.</li>
            </ul>
          </div>
          <a href="/mon-espace" className="inline-block mt-6 bg-[#0A2942] text-white rounded-xl px-6 py-3 hover:bg-[#062032]">
            Retour à mon espace
          </a>
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
              <p className="text-xs text-slate-500">Validation de devis et paiement</p>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-[#0A2942] mb-6">
          Validation du devis #{devis.id}
        </h1>

        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#0A2942]" /> Détails de la proposition
          </h2>
          <p className="text-slate-700 mb-1">
            <strong>Expert :</strong> {devis.expert}
          </p>
          <p className="text-slate-700 mb-1">
            <strong>Votre besoin :</strong> {devis.clientNeed}
          </p>
          <p className="text-slate-700 mb-1">
            <strong>Titre :</strong> {devis.title}
          </p>
          <p className="text-slate-700 mb-4">
            <strong>Description :</strong> {devis.description}
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
            <p><strong>Durée estimée :</strong> {devis.duration}</p>
            <p><strong>Tarif proposé :</strong> {devis.price} € HT</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-lg font-semibold mb-3 text-[#0A2942]">Récapitulatif du paiement</h2>
          <div className="text-sm text-slate-700 space-y-1">
            <p>Sous-total (expert) : {devis.price} €</p>
            <p>Commission ITERIUM PARTNERS (10%) : {commissionAmount.toFixed(2)} €</p>
            <p className="text-lg font-semibold mt-3">
              Total à payer : <span className="text-[#F8B400]">{totalWithCommission.toFixed(2)} € TTC</span>
            </p>
          </div>

          <button
            onClick={handlePayment}
            className="mt-6 w-full bg-[#0A2942] text-white rounded-xl py-3 text-base font-medium hover:bg-[#062032]"
          >
            <CreditCard className="inline h-4 w-4 mr-2" /> Valider et payer maintenant
          </button>

          <div className="mt-4 text-xs text-slate-500 flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Paiement sécurisé via Stripe. Aucun partage de données bancaires avec l’expert.
          </div>
        </div>

        <div className="text-center text-sm text-slate-500 flex flex-col items-center gap-2">
          <CalendarDays className="h-5 w-5 text-[#F8B400]" />
          Une fois le paiement validé, un lien de planification Teams vous sera proposé.
        </div>
      </section>
    </main>
  );
}