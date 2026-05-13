"use client";

import Link from "next/link";
import { ArrowRight, Users, Shield, Sparkles, CheckCircle2, UserPlus, Building2 } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      {/* Header */}
      <header className="bg-[#0A2942] text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <img
            src="/cropped-logo-itrium-conseil.png"
            alt="ITERIUM PARTNERS"
            className="h-10 w-auto"
          />
          <div>
            <div className="text-sm opacity-90">Plateforme IA B2B</div>
            <div className="text-xs opacity-70">Experts disponibles immédiatement</div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0A2942] text-white">
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] select-none">
          <img
            src="/cropped-logo-itrium-conseil.png"
            alt=""
            className="w-[900px] mx-auto mt-10"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            La plateforme IA B2B pour des{" "}
            <span className="text-[#F8B400]">interventions immédiates</span>{" "}
            entre clients et experts.
          </h1>
          <p className="mt-6 text-lg text-slate-200 max-w-4xl mx-auto">
            ITERIUM PARTNERS connecte en temps réel les entreprises et les experts disponibles
            pour des besoins urgents en IT, DAF, conformité, cybersécurité, RH et bien plus encore.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/client"
              className="inline-flex items-center gap-2 bg-[#F8B400] text-[#0A2942] px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition"
            >
              <UserPlus className="w-5 h-5" />
              Devenir client
            </Link>
            <Link
              href="/expert"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              <Building2 className="w-5 h-5" />
              Devenir expert
            </Link>
          </div>
        </div>
      </section>

      {/* AVANTAGES (existant conservé) */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border bg-white shadow-sm">
            <Users className="w-6 h-6 text-[#F8B400]" />
            <h3 className="mt-3 font-semibold text-[#0A2942]">Mise en relation instantanée</h3>
            <p className="text-sm text-slate-600 mt-1">
              Accédez rapidement aux experts disponibles, adaptés à votre besoin.
            </p>
          </div>
          <div className="p-6 rounded-2xl border bg-white shadow-sm">
            <Shield className="w-6 h-6 text-[#F8B400]" />
            <h3 className="mt-3 font-semibold text-[#0A2942]">Sécurisé & conforme</h3>
            <p className="text-sm text-slate-600 mt-1">
              Paiements via Stripe, processus conforme au RGPD.
            </p>
          </div>
          <div className="p-6 rounded-2xl border bg-white shadow-sm">
            <Sparkles className="w-6 h-6 text-[#F8B400]" />
            <h3 className="mt-3 font-semibold text-[#0A2942]">IA d’assistance</h3>
            <p className="text-sm text-slate-600 mt-1">
              Filtrage intelligent des besoins pour accélérer la mise en relation.
            </p>
          </div>
        </div>
      </section>

      {/* OFFRES & TARIFS */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0A2942] text-center">
            Offres & Tarifs
          </h2>
          <p className="text-slate-600 text-center mt-2">
            Deux formules simples pour démarrer rapidement.
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {/* Offre Standard */}
            <div className="border rounded-2xl p-8 shadow-sm bg-white">
              <h3 className="text-xl font-semibold text-[#0A2942] mb-3">
                Offre Standard
              </h3>
              <p className="text-slate-600 mb-6 text-sm">
                Idéale pour les entreprises souhaitant accéder rapidement à des experts,
                sans engagement complexe.
              </p>
              <p className="text-4xl font-bold text-[#F8B400] mb-6">490€ / an</p>
              <ul className="text-sm text-left space-y-2">
                <li>
                  <CheckCircle2 className="inline w-4 h-4 text-[#F8B400]" /> Accès à la plateforme & mise en relation
                </li>
                <li>
                  <CheckCircle2 className="inline w-4 h-4 text-[#F8B400]" /> Matching IA des besoins
                </li>
                <li>
                  <CheckCircle2 className="inline w-4 h-4 text-[#F8B400]" /> Paiements sécurisés via Stripe
                </li>
              </ul>
            </div>

            {/* Offre Premium Groupe (sans mentions SLA / 24/7) */}
            <div className="border-2 border-[#F8B400] rounded-2xl p-8 shadow-lg bg-white">
              <h3 className="text-xl font-semibold text-[#0A2942] mb-3">
                Offre Premium Groupe
              </h3>
              <p className="text-slate-600 mb-6 text-sm">
                Pour les groupes multi-entités ou les organisations nécessitant un
                pilotage complet et un support prioritaire côté plateforme.
              </p>
              <p className="text-4xl font-bold text-[#F8B400] mb-6">1 290€ / an</p>
              <ul className="text-sm text-left space-y-2">
                <li>
                  <CheckCircle2 className="inline w-4 h-4 text-[#F8B400]" /> Accès multi-utilisateurs illimité
                </li>
                <li>
                  <CheckCircle2 className="inline w-4 h-4 text-[#F8B400]" /> Suivi et reporting centralisé
                </li>
                <li>
                  <CheckCircle2 className="inline w-4 h-4 text-[#F8B400]" /> Support prioritaire plateforme (ITERIUM PARTNERS n’intervient pas dans l’exécution des missions)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="text-center py-16 bg-[#0A2942] text-white">
        <h2 className="text-3xl font-bold mb-4">
          Besoin d’un expert disponible maintenant ?
        </h2>
        <p className="text-slate-300 mb-8">
          Accédez en un clic à des experts qualifiés et disponibles immédiatement
          pour vos besoins critiques.
        </p>
        <Link
          href="/mon-espace"
          className="bg-[#F8B400] text-[#0A2942] px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2"
        >
          Accéder à la plateforme <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-600">
          <div>© 2026 ITERIUM PARTNERS — Plateforme digitale IA B2B</div>
          <nav className="flex items-center gap-4">
            <Link href="/legal" className="hover:text-[#0A2942]">
              Mentions légales
            </Link>
            <span className="opacity-40">•</span>
            <Link href="/privacy" className="hover:text-[#0A2942]">
              Politique RGPD
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}