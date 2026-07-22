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
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">

      {/* HEADER */}
      <header className="bg-[#0A2942] text-white border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-20 w-auto" />
            <div>
              <div className="font-bold text-lg tracking-wide">ITERIUM PARTNERS</div>
              <div className="text-xs text-slate-300">Plateforme IA B2B · Experts seniors & Entreprises</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/expert" className="border border-white/20 px-5 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition hidden md:block">
              Rejoindre le Cercle ITERIUM PARTNERS
            </Link>
            <Link href="/auth/login" className="bg-[#F8B400] text-[#0A2942] px-5 py-2 rounded-xl text-sm font-bold hover:bg-yellow-400 transition">
              Se connecter
            </Link>
          </div>
        </div>
      </header>

      {/* HERO — Bannière LinkedIn + Slogan */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Bannière en fond */}
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/dlo1bbmlf/image/upload/v1784651189/baniere_Iterium_PARTNERS_tle2ua.png"
            alt="ITERIUM PARTNERS"
            className="w-full h-full object-cover"
          />
          {/* Overlay dégradé pour lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2942]/90 via-[#0A2942]/70 to-[#0A2942]/30" />
        </div>

        {/* Contenu hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#F8B400]/20 border border-[#F8B400]/40 rounded-full px-4 py-2 text-sm text-[#F8B400] mb-8">
              <Sparkles className="w-4 h-4" />
              Plateforme IA B2B de mise en relation
            </div>

            {/* Slogan principal */}
            <h1 className="text-5xl md:text-6xl lg:text-4xl font-extrabold text-white leading-tight mb-6">
  Les dirigeants ont besoin d'expérience.
  <span className="block text-[#C9A84C] font-light mt-2">Pas de promesses.</span>
</h1>
            <p className="text-xl text-slate-200 leading-relaxed mb-10 max-w-2xl">
              ITERIUM PARTNERS connecte en quelques heures les entreprises avec les experts seniors
              disponibles DG, DSI, RSSI, DAF, CTO sans processus lourds ni marges.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/auth/login" className="inline-flex items-center gap-3 bg-[#F8B400] text-[#0A2942] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-yellow-400 transition shadow-2xl">
                Trouver un expert maintenant
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/auth/login" className="inline-flex items-center gap-3 border-2 border-white/40 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition">
                Accéder à mon espace
              </Link>
            </div>

            {/* Badges de confiance */}
            <div className="flex flex-wrap gap-6 mt-12 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F8B400]" />
                Mise en relation immédiate
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F8B400]" />
                Matching IA intelligent
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F8B400]" />
                Contrats générés automatiquement
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F8B400]" />
                0% commission sur les missions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POSITIONNEMENT */}
      <section className="bg-white py-20 border-b">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-2xl text-[#0A2942] font-bold leading-relaxed mb-8">
            ITERIUM PARTNERS réinvente l'accès à l'expertise senior.
          </p>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            Contrairement aux modèles traditionnels de recrutement, la plateforme permet une mise en relation
            directe entre entreprises et experts indépendants, sans processus lourds ni marges excessives.
          </p>
          <div className="bg-[#0A2942] rounded-2xl p-8 mb-8 text-left">
  <p className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-4">Notre ADN</p>
  <p className="text-white text-lg font-semibold leading-relaxed mb-4">
    "Chez ITERIUM PARTNERS, nous ne sélectionnons pas des profils.
  </p>
  <p className="text-slate-300 leading-relaxed mb-4">
    Nous réunissons des femmes et des hommes qui ont déjà <strong className="text-white">dirigé, décidé et transformé.</strong> Nous conjuguons exigence, indépendance et esprit entrepreneurial pour accompagner nos partenaires sur le long terme."
  </p>
  <div className="border-t border-white/20 pt-4 mt-4">
    <p className="text-[#C9A84C] font-semibold italic">
      "Parce que l'expérience ne se résume pas à un CV ou des cases."
    </p>
  </div>
</div>
            </p>
          </div>
          <p className="text-slate-600 text-lg leading-relaxed">
            ITERIUM PARTNERS est une plateforme créée par des experts, pour des experts.
            Nous réinventons le business model du recrutement : 2026 marque un tournant dans ce domaine,
            nos clients n'ont plus forcément besoin d'une ressource permanente, ils cherchent
            de la <strong className="text-[#0A2942]">réactivité</strong> et de la{" "}
            <strong className="text-[#0A2942]">spontanéité</strong> pour répondre à des besoins urgents ou ponctuels.
          </p>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0A2942]">Comment fonctionne ITERIUM PARTNERS ?</h2>
            <p className="text-slate-600 mt-4 text-lg">Une plateforme pensée pour connecter rapidement les entreprises avec les meilleurs experts disponibles.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="w-7 h-7" />,
                title: "Décrivez votre besoin",
                desc: "Exprimez votre problématique métier, votre urgence ou vos besoins stratégiques en quelques mots.",
                step: "01"
              },
              {
                icon: <Sparkles className="w-7 h-7" />,
                title: "L'IA identifie les experts",
                desc: "Notre moteur IA sélectionne les profils les plus pertinents parmi nos experts vérifiés.",
                step: "02"
              },
              {
                icon: <Shield className="w-7 h-7" />,
                title: "Mise en relation sécurisée",
                desc: "Contractualisation automatique, conformité RGPD et accès aux coordonnées après validation.",
                step: "03"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition relative overflow-hidden">
                <div className="absolute top-4 right-6 text-6xl font-black text-slate-100">{item.step}</div>
                <div className="w-14 h-14 rounded-2xl bg-[#0A2942] text-white flex items-center justify-center mb-6 relative z-10">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0A2942] mb-4 relative z-10">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERTISES */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0A2942]">Expertises disponibles</h2>
            <p className="text-slate-600 mt-4 text-lg">Des profils seniors immédiatement mobilisables sur des missions stratégiques et sensibles.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {["DSI / CTO", "RSSI / Cybersécurité", "Direction Générale", "Direction Opérationnelle", "DAF de transition", "Transformation digitale", "Conformité/ Compliance", "Direction de programme", "RH & organisation"].map((item, index) => (
              <div key={index} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-center gap-4 hover:border-[#F8B400] hover:shadow-md transition">
                <div className="w-11 h-11 rounded-xl bg-[#0A2942] text-white flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="font-semibold text-[#0A2942]">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFRES */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0A2942]">Offres & accès plateforme</h2>
            <p className="text-slate-600 mt-4 text-lg">Deux formules adaptées aux besoins des PME, ETI et grands groupes.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border rounded-3xl p-10 shadow-sm bg-white hover:shadow-lg transition">
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

            <div className="border-2 border-[#F8B400] rounded-3xl p-10 shadow-xl bg-[#0A2942] relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#F8B400] text-[#0A2942] px-5 py-2 text-sm font-bold rounded-bl-2xl">
                PREMIUM
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Forfait Groupe</h3>
              <p className="text-slate-300 text-sm mb-6">Pour les ETI et grands groupes avec des besoins multiples et récurrents.</p>
              <div className="mb-2">
                <span className="text-5xl font-bold text-[#F8B400]">490€</span>
                <span className="text-lg text-slate-400 font-medium"> /mois</span>
              </div>
              <p className="text-sm text-slate-400 mb-8">ou <strong className="text-white">4 900€/an</strong> (2 mois offerts)</p>
              <ul className="space-y-3 text-slate-300 mb-8">
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
      <section className="bg-white py-16 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0A2942]">Pourquoi choisir ITERIUM PARTNERS ?</h2>
            <p className="text-slate-600 mt-3">Comparez et faites le calcul vous-même.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl shadow">
            <table className="w-full text-sm bg-white overflow-hidden">
              <thead>
                <tr className="bg-[#0A2942] text-white">
                  <th className="px-6 py-4 text-left"></th>
                  <th className="px-6 py-4 text-center">Cabinet recrutement</th>
                  <th className="px-6 py-4 text-center">Plateformes freelance</th>
                  <th className="px-6 py-4 text-center bg-[#F8B400] text-[#0A2942]">ITERIUM PARTNERS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { label: "Coût", val1: "15-25% du salaire annuel", val2: "10-15% par mission", val3: "199€/mois fixe", c1: "text-red-600", c2: "text-orange-500", c3: "text-emerald-600" },
                  { label: "Accès aux experts", val1: "—", val2: "1 freelance à la fois", val3: "✅ Illimité", c1: "text-red-500", c2: "text-slate-500", c3: "text-emerald-600 font-bold" },
                  { label: "Délai de mise en relation", val1: "4 à 8 semaines", val2: "Variable", val3: "✅ 48h", c1: "text-red-500", c2: "text-orange-500", c3: "text-emerald-600 font-bold" },
                  { label: "Contrat automatique", val1: "❌", val2: "❌", val3: "✅ Oui", c1: "", c2: "", c3: "text-emerald-600 font-bold" },
                  { label: "Multi-experts simultanés", val1: "❌", val2: "❌", val3: "✅ Oui", c1: "", c2: "", c3: "text-emerald-600 font-bold" },
                  { label: "Missions urgentes", val1: "❌", val2: "Difficile", val3: "✅ Express", c1: "", c2: "text-orange-500", c3: "text-emerald-600 font-bold" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-slate-50" : ""}>
                    <td className="px-6 py-4 font-semibold text-slate-700">{row.label}</td>
                    <td className={`px-6 py-4 text-center ${row.c1}`}>{row.val1}</td>
                    <td className={`px-6 py-4 text-center ${row.c2}`}>{row.val2}</td>
                    <td className={`px-6 py-4 text-center ${row.c3}`}>{row.val3}</td>
                  </tr>
                ))}
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

      {/* CTA EXPERT */}
      <section className="bg-[#0A2942] text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <img src="/Logo.png" alt="" className="w-[600px] mx-auto mt-10" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <Award className="w-14 h-14 text-[#F8B400] mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Vous êtes un expert senior ?</h2>
          <p className="text-[#F8B400] text-xl font-semibold mb-6">
            "Les dirigeants ont besoin d'expérience. Pas de promesses."
          </p>
          <p className="text-slate-300 text-lg leading-relaxed mb-10">
            Rejoindre le Cercle ITERIUM PARTNERS

ITERIUM PARTNERS n'est pas une plateforme de recrutement.

C'est un réseau créé par des dirigeants et des experts de terrain qui connaissent les réalités des entreprises.

Nous croyons qu'une carrière ne se résume pas à un CV, mais à des décisions prises, des équipes dirigées et des transformations réussies.

En rejoignant le Cercle ITERIUM PARTNERS, vous valorisez votre expérience auprès d'entreprises qui recherchent avant tout des experts capables d'agir.

Votre référencement est entièrement gratuit.
          </p>
          <Link href="/expert" className="inline-flex items-center gap-3 bg-[#F8B400] text-[#0A2942] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-yellow-400 transition shadow-xl">
            Rejoindre le Cercle ITERIUM PARTNERS
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-8 w-auto" />
            <span>© 2026 ITERIUM PARTNERS — Plateforme IA B2B</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/legal" className="hover:text-[#0A2942] transition">Mentions légales</Link>
            <Link href="/privacy" className="hover:text-[#0A2942] transition">Politique RGPD</Link>
            <Link href="/legal/conditions" className="hover:text-[#0A2942] transition">CGU</Link>
           </div>
        </div>
      </footer>

    </main>
  );
}
