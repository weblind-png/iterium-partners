"use client";

import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle2,
  Users,
  Search,
  Briefcase,
  X,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">

      {/* HEADER */}
      <header className="bg-[#0A2942] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-18 w-auto" />
            <div>
              <div className="font-bold text-lg">ITERIUM PARTNERS</div>
              <div className="text-xs text-slate-300">Plateforme IA B2B de mise en relation experts & entreprises</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/expert" className="border border-white/20 px-5 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition">
              Rejoindre le réseau expert
            </Link>
            <Link href="/auth/login" className="bg-[#F8B400] text-[#0A2942] px-5 py-2 rounded-xl text-sm font-bold hover:bg-yellow-400 transition">
              Se connecter
            </Link>
          </div>
        </div>
      </header>

      {/* POSITIONNEMENT */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xl text-[#0A2942] font-semibold leading-relaxed">
            ITERIUM PARTNERS réinvente l'accès à l'expertise senior.
          </p>
          <p className="mt-5 text-slate-600 text-lg leading-relaxed">
            Contrairement aux modèles traditionnels de recrutement, la plateforme permet une mise en relation
            directe entre entreprises et experts indépendants, sans processus lourds ni marges excessives.
          </p>
        </div>
      </section>

     

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0A2942] text-white">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <img src="/Logo.png" alt="" className="w-[900px] mx-auto mt-20" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm mb-8">
            <Sparkles className="w-4 h-4 text-[#F8B400]" />
            Experts seniors disponibles rapidement
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-5xl mx-auto">
            Accédez immédiatement aux meilleurs experts seniors pour vos projets critiques
          </h1>
          <p className="mt-8 text-xl text-slate-200 leading-relaxed max-w-4xl mx-auto">
            DSI, CTO, RSSI, DAF, DRH, experts cybersécurité, cloud, conformité et transformation digitale
            disponibles rapidement pour des missions stratégiques.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/login" className="inline-flex items-center gap-3 bg-[#F8B400] text-[#0A2942] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-yellow-400 transition shadow-xl">
              Trouver un expert maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/auth/login" className="inline-flex items-center gap-3 border border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition">
              Accéder à mon espace
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="mt-14 flex flex-wrap justify-center gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#F8B400]" />Mise en relation rapide</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#F8B400]" />Matching IA intelligent</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#F8B400]" />Contractualisation sécurisée</div>
          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0A2942]">Comment fonctionne ITERIUM PARTNERS ?</h2>
            <p className="text-slate-600 mt-4 text-lg">Une plateforme pensée pour connecter rapidement les entreprises avec les meilleurs experts disponibles.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border rounded-3xl p-8 shadow-sm hover:shadow-xl transition">
              <div className="w-14 h-14 rounded-2xl bg-[#0A2942] text-white flex items-center justify-center mb-6">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-[#0A2942] mb-4">Décrivez votre besoin</h3>
              <p className="text-slate-600 leading-relaxed">Exprimez votre problématique métier, votre urgence ou vos besoins stratégiques.</p>
            </div>
            <div className="bg-white border rounded-3xl p-8 shadow-sm hover:shadow-xl transition">
              <div className="w-14 h-14 rounded-2xl bg-[#0A2942] text-white flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-[#0A2942] mb-4">L'IA identifie les experts</h3>
              <p className="text-slate-600 leading-relaxed">Notre moteur IA sélectionne les profils les plus pertinents selon votre besoin.</p>
            </div>
            <div className="bg-white border rounded-3xl p-8 shadow-sm hover:shadow-xl transition">
              <div className="w-14 h-14 rounded-2xl bg-[#0A2942] text-white flex items-center justify-center mb-6">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-[#0A2942] mb-4">Mise en relation sécurisée</h3>
              <p className="text-slate-600 leading-relaxed">Contractualisation, conformité RGPD, paiement sécurisé et accès aux coordonnées après validation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISES */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0A2942]">Expertises disponibles</h2>
            <p className="text-slate-600 mt-4 text-lg">Des profils seniors immédiatement mobilisables sur des missions stratégiques et sensibles.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {["DSI / CTO", "RSSI / Cybersécurité", "Cloud & Infrastructure", "SAP / ERP", "DAF de transition", "Transformation digitale", "Conformité NIS2", "Direction de programme", "RH & organisation"].map((item, index) => (
              <div key={index} className="bg-white border rounded-2xl p-6 flex items-center gap-4 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-[#0A2942] text-white flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="font-semibold text-[#0A2942]">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFRES */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0A2942]">Offres & accès plateforme</h2>
            <p className="text-slate-600 mt-4 text-lg">Deux formules adaptées aux besoins des PME, ETI et grands groupes.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">

            <div className="border rounded-3xl p-10 shadow-sm bg-white">
              <h3 className="text-2xl font-bold text-[#0A2942] mb-2">Forfait Essentiel</h3>
              <p className="text-slate-500 text-sm mb-6">Idéal pour les PME avec des besoins ponctuels en expertise senior.</p>
              <div className="mb-2">
                <span className="text-5xl font-bold text-[#F8B400]">199€</span>
                <span className="text-lg text-slate-500 font-medium"> /mois</span>
              </div>
              <p className="text-sm text-slate-400 mb-8">ou <strong>1 990€/an</strong> (2 mois offerts)</p>
              <ul className="space-y-3 text-slate-700 mb-8">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#F8B400] shrink-0" />Accès moteur de recherche IA</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#F8B400] shrink-0" />Consultation profils experts illimitée</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#F8B400] shrink-0" />5 mises en relation / mois</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#F8B400] shrink-0" />Génération contrat automatique</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#F8B400] shrink-0" />Support email</li>
              </ul>
              <Link href="/auth/login" className="block w-full text-center bg-[#0A2942] text-white font-bold py-3 rounded-2xl hover:bg-slate-800 transition">
                Commencer maintenant
              </Link>
            </div>

            <div className="border-2 border-[#F8B400] rounded-3xl p-10 shadow-xl bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#F8B400] text-[#0A2942] px-5 py-2 text-sm font-bold rounded-bl-2xl">
                PREMIUM
              </div>
              <h3 className="text-2xl font-bold text-[#0A2942] mb-2">Forfait Groupe</h3>
              <p className="text-slate-500 text-sm mb-6">Pour les ETI et grands groupes avec des besoins multiples et récurrents.</p>
              <div className="mb-2">
                <span className="text-5xl font-bold text-[#F8B400]">490€</span>
                <span className="text-lg text-slate-500 font-medium"> /mois</span>
              </div>
              <p className="text-sm text-slate-400 mb-8">ou <strong>4 900€/an</strong> (2 mois offerts)</p>
              <ul className="space-y-3 text-slate-700 mb-8">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#F8B400] shrink-0" />Tout le forfait Essentiel</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#F8B400] shrink-0" />Mises en relation illimitées</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#F8B400] shrink-0" />Multi-utilisateurs</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#F8B400] shrink-0" />Reporting & suivi missions</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#F8B400] shrink-0" />Account manager dédié</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#F8B400] shrink-0" />NDA automatique inclus</li>
              </ul>
              <Link href="/auth/login" className="block w-full text-center bg-[#F8B400] text-[#0A2942] font-bold py-3 rounded-2xl hover:bg-yellow-400 transition">
                Commencer maintenant
              </Link>
            </div>

          </div>
        </div>
      </section>
 {/* COMPARATIF */}
      <section className="bg-slate-50 py-16 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0A2942]">Pourquoi choisir ITERIUM PARTNERS ?</h2>
            <p className="text-slate-600 mt-3">Comparez et faites le calcul vous-même.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-2xl shadow overflow-hidden">
              <thead>
                <tr className="bg-[#0A2942] text-white">
                  <th className="px-6 py-4 text-left"></th>
                  <th className="px-6 py-4 text-center">Cabinet recrutement</th>
                  <th className="px-6 py-4 text-center">Plateformes freelance</th>
                  <th className="px-6 py-4 text-center bg-[#F8B400] text-[#0A2942]">ITERIUM PARTNERS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-6 py-4 font-semibold text-slate-700">Coût</td>
                  <td className="px-6 py-4 text-center text-red-600 font-semibold">15-25% du salaire annuel</td>
                  <td className="px-6 py-4 text-center text-orange-500 font-semibold">10-15% par mission</td>
                  <td className="px-6 py-4 text-center text-emerald-600 font-bold">199€/mois fixe</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-700">Accès aux experts</td>
                  <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-slate-500">1 freelance à la fois</td>
                  <td className="px-6 py-4 text-center"><span className="text-emerald-600 font-bold">✅ Illimité</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-slate-700">Délai de mise en relation</td>
                  <td className="px-6 py-4 text-center text-red-500">4 à 8 semaines</td>
                  <td className="px-6 py-4 text-center text-orange-500">Variable</td>
                  <td className="px-6 py-4 text-center"><span className="text-emerald-600 font-bold">✅ Immédiat</span></td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-700">Contrat automatique</td>
                  <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><span className="text-emerald-600 font-bold">✅ Oui</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-slate-700">Multi-experts simultanés</td>
                  <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><span className="text-emerald-600 font-bold">✅ Oui</span></td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-700">Missions urgentes</td>
                  <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-orange-500">Difficile</td>
                  <td className="px-6 py-4 text-center"><span className="text-emerald-600 font-bold">✅ Express</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <p className="text-slate-600 text-sm italic">
              Exemple : 3 mises en relation réussies dans l'année = économie de <strong className="text-[#0A2942]">30 000 à 50 000€</strong> vs un cabinet de recrutement.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA FINAL */}
      <section className="bg-[#0A2942] text-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Users className="w-14 h-14 text-[#F8B400] mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">Vous êtes un expert senior ?</h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-10">
            Rejoignez le réseau ITERIUM PARTNERS et accédez à des missions stratégiques
            auprès de PME, ETI et grands groupes. Inscription gratuite.
          </p>
          <Link href="/expert" className="inline-flex items-center gap-3 bg-[#F8B400] text-[#0A2942] px-8 py-4 rounded-2xl font-bold hover:bg-yellow-400 transition">
            Rejoindre le réseau expert
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div>© 2026 ITERIUM PARTNERS — Plateforme IA B2B</div>
          <div className="flex items-center gap-5">
            <Link href="/legal" className="hover:text-[#0A2942] transition">Mentions légales</Link>
            <Link href="/privacy" className="hover:text-[#0A2942] transition">Politique RGPD</Link>
            <Link href="/legal/conditions" className="hover:text-[#0A2942] transition">CGU</Link>
            <Link href="/auth/login" className="font-semibold text-[#0A2942] hover:text-[#F8B400] transition">Se connecter</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
