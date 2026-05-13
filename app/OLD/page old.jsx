"use client";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ShieldCheck, Clock } from "lucide-react";

const EXPERTS = [
  { id: 1, name: "Sophie", role: "DAF de transition", skills: ["Trésorerie", "IFRS", "Clôture"], available: "Maintenant", tjm: 950 },
  { id: 2, name: "Nicolas", role: "DSI / CTO", skills: ["Cloud", "Cybersécurité", "Conformité"], available: "Aujourd’hui", tjm: 1100 },
  { id: 3, name: "Leïla", role: "Comptable Senior", skills: ["Sage X3", "TVA", "Clôture"], available: "Demain", tjm: 780 },
  { id: 4, name: "Karim", role: "Juriste RGPD / DPO", skills: ["Registre", "DPIA", "Contrats"], available: "Maintenant", tjm: 890 },
  { id: 5, name: "Anna", role: "Admin Paie / RH", skills: ["Bulletins", "DSN", "SIRH"], available: "Aujourd’hui", tjm: 650 },
];

function scoreExpert(query, expert) {
  const q = (query || "").toLowerCase();
  const text = [expert.role, ...expert.skills].join(" ").toLowerCase();
  const hits = (q.match(/\w+/g) || []).filter(w => text.includes(w)).length;
  const avail = expert.available.includes("Maintenant") ? 2 : expert.available.includes("Aujourd’hui") ? 1 : 0;
  return hits * 2 + avail;
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [onlyImmediate, setOnlyImmediate] = useState(true);

  const results = useMemo(() => {
    const list = EXPERTS.map(e => ({ ...e, score: scoreExpert(query, e) }));
    const filtered = onlyImmediate
      ? list.filter(e => e.available.includes("Maintenant") || e.available.includes("Aujourd’hui"))
      : list;
    return filtered.sort((a, b) => b.score - a.score);
  }, [query, onlyImmediate]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
      {/* ---------- HEADER ---------- */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="Itrium Conseil" className="h-10 w-auto" />
            <div>
              <p className="font-semibold text-[#0A2942]">Itrium Conseil</p>
              <p className="text-xs text-slate-500">Intervention Express des Cadres Seniors</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/tarifs" className="text-sm text-slate-600 hover:text-[#0A2942]">Tarifs</a>
            <a href="/contact" className="text-sm text-slate-600 hover:text-[#0A2942]">Contact</a>
            <a href="/legal" className="text-sm text-slate-600 hover:text-[#0A2942]">Mentions légales</a>
            <a href="/privacy" className="text-sm text-slate-600 hover:text-[#0A2942]">Confidentialité / RGPD</a>
            <button className="bg-[#0A2942] text-white rounded-xl px-4 py-2 hover:bg-[#062032]">
              Se connecter / S’abonner
            </button>
          </div>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <section
        className="py-20 bg-cover bg-center text-white"
        style={{ backgroundImage: "linear-gradient(rgba(10,41,66,0.7),rgba(10,41,66,0.7)),url(/fond.png)" }}
      >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Besoin d’un expert <span className="text-[#F8B400]">immédiatement</span> ?
            </motion.h1>
            <p className="text-lg text-slate-100">
              Accédez à un DSI, DAF, RSSI, DPO ou Comptable senior disponible instantanément.
            </p>
            <ul className="mt-6 text-slate-200 text-sm space-y-2">
              <li className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#F8B400]" /> Réponse en temps réel
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#F8B400]" /> Experts vérifiés et confidentiels
              </li>
              <li className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-[#F8B400]" /> Lien Teams & synchro Agenda
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- ARGUMENTAIRE ---------- */}
      <section className="max-w-5xl mx-auto px-6 py-12 text-slate-700 leading-relaxed">
        <h2 className="text-2xl font-bold text-[#0A2942] mb-4">Pourquoi choisir Itrium Conseil ?</h2>
        <p className="mb-4">
          Dans un contexte économique où il devient difficile d’embaucher à plein temps un expert confirmé,
          <strong> Itrium Conseil</strong> propose une alternative simple, rapide et flexible : 
          la mise en relation instantanée avec des spécialistes disponibles immédiatement, sans contrat long ni frais cachés.
        </p>
        <p className="mb-4">
          Un besoin urgent ? Une cyberattaque ? Un problème de clôture comptable, de conformité RGPD ou une mise à jour de vos systèmes ?
          <strong> En un clic, trouvez le bon expert</strong> et organisez une visio <strong>Teams</strong> selon ses disponibilités.
        </p>
        <p className="mb-4">
          Pas d’échange de CV, pas de lenteur administrative. Vous accédez directement à la fiche de votre expert, 
          à son domaine de compétence et à ses créneaux disponibles. 
          <strong> Vous gardez le contrôle total</strong> sur la durée et le périmètre de votre intervention.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <a
            href="/tarifs"
            className="bg-[#0A2942] text-white px-6 py-3 rounded-xl text-center hover:bg-[#062032] font-medium"
          >
            💼 Devenir client
          </a>
          <a
            href="/contact"
            className="border border-[#0A2942] text-[#0A2942] px-6 py-3 rounded-xl text-center hover:bg-[#0A2942] hover:text-white font-medium"
          >
            🚀 Devenir expert
          </a>
        </div>
      </section>

      {/* ---------- EXPERTS LIST ---------- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-4">Profils recommandés</h2>
        {results.length === 0 ? (
          <p className="text-slate-500">Aucun expert disponible actuellement.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((e) => (
              <div
                key={e.id}
                className="border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="font-semibold text-lg">{e.name}</div>
                <div className="text-sm text-slate-500">{e.role}</div>
                <div className="mt-3 text-sm text-slate-600 flex justify-between items-center">
                  <span>Dispo : {e.available}</span>
                  <span className="text-[#F8B400] font-semibold">{e.tjm}€/j</span>
                </div>
                <button className="mt-4 w-full bg-[#0A2942] text-white rounded-xl py-2 hover:bg-[#062032]">
                  Réserver
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t py-6 text-center text-slate-500 text-sm space-y-2">
        <p>© {new Date().getFullYear()} Itrium Conseil — Intervention Express</p>
        <div className="flex justify-center gap-4">
          <a href="/tarifs" className="hover:underline">Tarifs</a>
          <a href="/legal" className="hover:underline">Mentions légales</a>
          <a href="/privacy" className="hover:underline">Confidentialité / RGPD</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>
      </footer>
    </main>
  );
}