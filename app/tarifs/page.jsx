"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle2, Lock, ShieldCheck, CalendarDays, Building2, Loader2, CreditCard } from "lucide-react";

export default function TarifsPage() {
  const [companyType, setCompanyType] = useState("standard");
  const [loading, setLoading] = useState(false);

  // Simulation d'une future détection IA (selon le domaine)
  useEffect(() => {
    const host = window.location.hostname;
    if (host.includes("group") || host.includes("holding")) {
      setCompanyType("premium");
    }
  }, []);

  // Fonction pour créer une session Stripe Checkout
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
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="Itrium Conseil" className="h-10 w-auto" />
            <div>
              <p className="font-semibold text-[#0A2942]">ITERIUM PARTNERS</p>
              <p className="text-xs text-slate-500">Intervention Express des Cadres Top Level</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-slate-600 hover:text-[#0A2942]">Accueil</a>
            <a href="/contact" className="text-sm text-slate-600 hover:text-[#0A2942]">Contact</a>
            <button className="bg-[#0A2942] text-white rounded-xl px-4 py-2 hover:bg-[#062032]">
              Se connecter / S’abonner
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="py-20 bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,41,66,0.8),rgba(10,41,66,0.8)),url(/fond.png)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nos offres d’abonnement — Simples, claires et performantes
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto">
            Accédez à un réseau d’experts vérifiés, disponibles en urgence et en visio,
            sans contrat complexe ni engagement caché.
          </p>
        </div>
      </section>

      {/* Suggestion IA */}
      {companyType === "premium" && (
        <div className="bg-amber-100 border-l-4 border-[#F8B400] py-3 px-6 text-sm text-slate-700 text-center">
          <Building2 className="inline h-4 w-4 mr-2 text-[#F8B400]" />
          Détection automatique : votre entreprise semble correspondre à une structure multi-entités. 
          Découvrez notre formule <strong>Premium Groupe</strong> ci-dessous.
        </div>
      )}

      {/* Standard Entreprise */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[#0A2942]">
              Abonnement Standard Entreprise
            </h2>
            <p className="text-slate-600 mb-4">
              Conçu pour les PME, startups et entreprises indépendantes,
              cet abonnement offre un accès direct à notre réseau d’experts qualifiés,
              sans passer par une ESN ou un contrat long terme. Idéal pour les besoins
              ponctuels et les urgences métier.
            </p>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-[#F8B400]" /> Accès illimité à la plateforme et à l’IA de matching</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-[#F8B400]" /> 3 utilisateurs inclus (puis 10 €/utilisateur suppl.)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-[#F8B400]" /> Synchro Google Agenda & Teams</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-[#F8B400]" /> Priorité d’accès aux experts disponibles</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#F8B400]" /> RGPD & Confidentialité renforcée</li>
            </ul>
          </div>

          <div className="border rounded-2xl p-8 shadow-md bg-white text-center">
            <h3 className="text-3xl font-bold text-[#0A2942] mb-1">Abonnement Annuel Standard</h3>
            <p className="text-slate-600 text-sm mb-4">Accès illimité à ITERIUM PARTNERS pour votre entreprise</p>
            <div className="text-5xl font-extrabold text-[#F8B400]">490 €</div>
            <div className="text-sm text-slate-500 mb-6">/ an — 3 utilisateurs inclus</div>

            <button
              onClick={() => handlePayment("standard")}
              disabled={loading}
              className="w-full bg-[#0A2942] text-white rounded-xl py-4 hover:bg-[#062032] flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
              {loading ? "Création de la session..." : "Souscrire maintenant"}
            </button>

            <p className="text-xs text-slate-500 mt-3 text-center">
              * Abonnement annuel obligatoire — accès réservé aux entreprises abonnées.
            </p>
          </div>
        </div>
      </section>

      {/* Premium Groupe */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="border rounded-2xl p-10 shadow-lg bg-gradient-to-br from-[#0A2942] to-[#163B63] text-white">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-[#F8B400]">Formule Premium Groupe</h2>
              <p className="text-slate-200 mb-4">
                Conçue pour les <strong>ETI, holdings et grands comptes multi-entités</strong>,
                cette formule offre un accès multi-filiales et une conciergerie expert dédiée.
              </p>
              <ul className="space-y-3 text-slate-100">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-[#F8B400]" /> Jusqu’à 10 utilisateurs / entités inclus</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-[#F8B400]" /> Gestion centralisée et facturation unifiée</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-[#F8B400]" /> Accès prioritaire à un pool d’experts dédiés</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-[#F8B400]" /> Conciergerie expert – mise en relation sous 1h ouvrée</li>
              </ul>
            </div>

            <div className="bg-white text-slate-800 rounded-2xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-semibold text-[#0A2942] mb-2">Abonnement Premium Groupe</h3>
              <p className="text-slate-600 mb-4">Accès multi-entités et accompagnement prioritaire</p>
              <div className="text-5xl font-extrabold text-[#F8B400] mb-1">1 290 €</div>
              <div className="text-sm text-slate-500 mb-6">/ an — jusqu’à 10 utilisateurs</div>

              <button
                onClick={() => handlePayment("premium")}
                disabled={loading}
                className="w-full bg-[#F8B400] text-[#0A2942] rounded-xl py-4 hover:bg-[#e0a000] flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                {loading ? "Création de la session..." : "Souscrire Premium"}
              </button>

              <p className="text-xs text-slate-500 mt-3 text-center">
                * Offre réservée aux structures multi-sites ou holdings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} ITERIUM PARTNERS — Intervention Express des Cadres Top Level
      </footer>
    </main>
  );
}