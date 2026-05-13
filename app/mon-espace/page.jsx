"use client";
import React, { useState, useMemo } from "react";
import { Search, Gauge, X } from "lucide-react";

const EXPERTS = [
  { id: 1, name: "Sophie", role: "DAF de transition", email: "sophie@itriumconseil.com", skills: ["Trésorerie", "IFRS", "Clôture", "Bilan", "Comptabilité"], available: "Maintenant", tjm: 950 },
  { id: 2, name: "Nicolas", role: "DSI / CTO", email: "nicolas@itriumconseil.com", skills: ["Cloud", "Cybersécurité", "Conformité", "Infrastructure"], available: "Aujourd’hui", tjm: 1100 },
  { id: 3, name: "Leïla", role: "Comptable Senior", email: "leila@itriumconseil.com", skills: ["Sage X3", "TVA", "Bilan", "Fiscalité"], available: "Maintenant", tjm: 780 },
  { id: 4, name: "Karim", role: "Juriste RGPD / DPO", email: "karim@itriumconseil.com", skills: ["Registre", "DPIA", "Contrats", "Conformité RGPD"], available: "Maintenant", tjm: 890 },
  { id: 5, name: "Anna", role: "Admin Paie / RH", email: "anna@itriumconseil.com", skills: ["Bulletins", "DSN", "SIRH", "RH"], available: "Aujourd’hui", tjm: 650 },
];

// --- IA de matching ---
function scoreExpert(query, expert) {
  if (!query) return 0;

  const q = query.toLowerCase();
  const keywords = q.match(/\w+/g) || [];
  const text = [expert.role, ...expert.skills].join(" ").toLowerCase();

  let score = 0;

  for (const word of keywords) {
    if (text.includes(word)) score += 6;
    else if (word.length > 5 && text.includes(word.slice(0, -2))) score += 3;
  }

  const role = expert.role.toLowerCase();
  if (q.includes("compta") && (role.includes("comptable") || role.includes("bilan"))) score += 12;
  if (q.includes("rh") && (role.includes("paie") || role.includes("rh"))) score += 12;
  if (q.includes("cyber") && role.includes("dsi")) score += 12;
  if (q.includes("rgpd") && (role.includes("juriste") || role.includes("dpo"))) score += 12;
  if (q.includes("finance") && (role.includes("daf") || role.includes("financier"))) score += 10;

  if (expert.available.includes("Maintenant")) score += 3;
  else if (expert.available.includes("Aujourd’hui")) score += 2;

  return score;
}

export default function MonEspacePage() {
  const [query, setQuery] = useState("");
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [form, setForm] = useState({ nom: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const results = useMemo(() => {
    const list = EXPERTS.map((e) => ({ ...e, score: scoreExpert(query, e) }));
    const filtered = list.filter((e) => e.score >= 8);
    return filtered.sort((a, b) => b.score - a.score).slice(0, 5);
  }, [query]);

  const maxScore = results.length > 0 ? Math.max(...results.map((r) => r.score)) : 0;

  // Envoi du message
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const res = await fetch("/api/contact-expert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, expert: selectedExpert }),
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setForm({ nom: "", email: "", message: "" });
    } else {
      alert("Erreur lors de l’envoi du message. Réessayez plus tard.");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-10 w-auto" />
            <div>
              <p className="font-semibold text-[#0A2942]">ITERIUM PARTNERS</p>
              <p className="text-xs text-slate-500">Espace client — Matching experts IA</p>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        className="py-16 bg-cover bg-center text-white"
        style={{
          backgroundImage: "linear-gradient(rgba(10,41,66,0.8),rgba(10,41,66,0.8)),url(/fond.png)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Trouvez votre expert en <span className="text-[#F8B400]">quelques secondes</span>
          </h1>
          <p className="text-slate-200 text-lg">
            Décrivez votre besoin — notre IA identifie les experts les plus pertinents et disponibles immédiatement.
          </p>
        </div>
      </section>

      {/* RECHERCHE */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 border rounded-full px-4 py-3 shadow-sm bg-white">
          <Search className="h-5 w-5 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex : besoin d'aide pour un bilan comptable"
            className="flex-1 outline-none text-slate-700 placeholder-slate-400"
          />
        </div>

        <div className="mt-10">
          {results.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Résultats IA pour “{query}”
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((e) => {
                  const pertinence = maxScore ? Math.round((e.score / maxScore) * 100) : 0;
                  return (
                    <div key={e.id} className="border rounded-2xl p-5 shadow-sm bg-white hover:shadow-md transition">
                      <div className="font-semibold text-lg text-[#0A2942]">{e.name}</div>
                      <div className="text-sm text-slate-500">{e.role}</div>
                      <div className="mt-3 text-sm text-slate-600 flex justify-between items-center">
                        <span>Dispo : {e.available}</span>
                        <span className="text-[#F8B400] font-semibold">{e.tjm}€/j</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                        <Gauge className="h-4 w-4 text-[#F8B400]" />
                        Pertinence IA : <span className="font-semibold text-[#0A2942]">{pertinence}%</span>
                      </div>
                      <button
                        onClick={() => setSelectedExpert(e)}
                        className="mt-4 w-full bg-[#0A2942] text-white rounded-xl py-2 hover:bg-[#062032]"
                      >
                        Contacter cet expert
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* MODAL CONTACT EXPERT */}
      {selectedExpert && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setSelectedExpert(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-semibold text-[#0A2942] mb-2">
              Contacter {selectedExpert.name}
            </h3>
            <p className="text-sm text-slate-500 mb-4">{selectedExpert.role}</p>

            {success ? (
              <p className="text-green-600 font-semibold">
                ✅ Message envoyé avec succès ! Vous serez recontacté rapidement.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  required
                  placeholder="Votre nom"
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                />
                <input
                  required
                  type="email"
                  placeholder="Votre email professionnel"
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <textarea
                  required
                  rows="4"
                  placeholder="Décrivez votre besoin..."
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                <button
                  disabled={loading}
                  className="w-full bg-[#0A2942] text-white rounded-xl py-2 hover:bg-[#062032]"
                >
                  {loading ? "Envoi en cours..." : "Envoyer le message"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <footer className="border-t py-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} ITERIUM PARTNERS — Espace client IA
      </footer>
    </main>
  );
}