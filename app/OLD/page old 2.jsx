"use client";
import Link from "next/link";
import { ArrowRight, Zap, Users, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="Itrium Conseil" className="h-10 w-auto" />
            <div>
              <p className="font-semibold text-[#0A2942]">Itrium Conseil</p>
              <p className="text-xs text-slate-500">
                Plateforme IA B2B — Experts disponibles immédiatement
              </p>
            </div>
          </div>
          <Link
            href="/mon-espace"
            className="text-white bg-[#0A2942] px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#062032] transition"
          >
            Espace client
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section
        className="py-20 bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,41,66,0.85),rgba(10,41,66,0.85)),url(/fond.png)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            La plateforme IA B2B pour des{" "}
            <span className="text-[#F8B400]">interventions immédiates</span> entre
            clients et experts.
          </h1>
          <p className="text-slate-200 text-lg mb-8">
            Itrium Conseil connecte en temps réel les entreprises et les experts
            disponibles, pour résoudre rapidement les besoins urgents : IT, DAF,
            conformité, cybersécurité, RH et plus encore.
          </p>
          <Link
            href="/mon-espace"
            className="bg-[#F8B400] text-[#0A2942] font-semibold px-6 py-3 rounded-xl hover:bg-yellow-400 transition inline-flex items-center gap-2"
          >
            Trouver un expert maintenant <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* VALEURS */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8 text-center">
        <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition">
          <Zap className="w-10 h-10 mx-auto text-[#F8B400]" />
          <h3 className="font-semibold text-lg mt-4 text-[#0A2942]">
            Réactivité instantanée
          </h3>
          <p className="text-slate-600 text-sm mt-2">
            Une IA analyse votre besoin et identifie immédiatement l’expert le plus
            pertinent, prêt à intervenir.
          </p>
        </div>

        <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition">
          <Users className="w-10 h-10 mx-auto text-[#F8B400]" />
          <h3 className="font-semibold text-lg mt-4 text-[#0A2942]">
            Experts qualifiés et indépendants
          </h3>
          <p className="text-slate-600 text-sm mt-2">
            Les experts présents sur la plateforme sont des professionnels
            indépendants, sélectionnés pour leurs compétences et leur
            disponibilité. Itrium Conseil agit comme intermédiaire de mise en
            relation, sans intervenir dans l’exécution des prestations.
          </p>
        </div>

        <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition">
          <ShieldCheck className="w-10 h-10 mx-auto text-[#F8B400]" />
          <h3 className="font-semibold text-lg mt-4 text-[#0A2942]">
            Confiance & sécurité
          </h3>
          <p className="text-slate-600 text-sm mt-2">
            Paiements sécurisés via Stripe et contrats automatiques signés
            électroniquement.
          </p>
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
      <footer className="border-t py-6 text-center text-slate-500 text-sm bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 px-4">
          <p>© {new Date().getFullYear()} Itrium Conseil — Plateforme digitale IA B2B</p>
          <div className="flex items-center gap-4">
            <Link
              href="/legal/CGU_Itrium_Conseil.pdf"
              className="text-[#0A2942] hover:text-[#F8B400] transition"
              target="_blank"
            >
              CGU
            </Link>
            <Link
              href="/legal/mentions"
              className="text-[#0A2942] hover:text-[#F8B400] transition"
            >
              Mentions légales
            </Link>
            <Link
              href="/privacy"
              className="text-[#0A2942] hover:text-[#F8B400] transition"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}