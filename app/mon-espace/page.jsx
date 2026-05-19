"use client";

import React, { useState, useMemo } from "react";
import { Search, Gauge, X } from "lucide-react";
import Link from "next/link";

const EXPERTS = [
  {
    id: 1,
    role: "DAF de transition",
    skills: ["Trésorerie", "IFRS", "Clôture", "Bilan"],
    available: "Immédiate",
    tjm: 950,
    experience: "20 ans",
    mode: "Hybride",
  },
  {
    id: 2,
    role: "DSI / CTO",
    skills: ["Cloud", "Cybersécurité", "Infrastructure", "NIS2"],
    available: "Sous 72h",
    tjm: 1100,
    experience: "25 ans",
    mode: "Remote",
  },
  {
    id: 3,
    role: "Expert SAP Finance",
    skills: ["SAP", "Finance", "Migration", "ERP"],
    available: "Immédiate",
    tjm: 1200,
    experience: "18 ans",
    mode: "Hybride",
  },
  {
    id: 4,
    role: "RSSI Senior",
    skills: ["ISO27001", "NIS2", "SOC", "Cyber"],
    available: "Sous 1 semaine",
    tjm: 1300,
    experience: "22 ans",
    mode: "Sur site",
  },
];

// IA Matching
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

  if (q.includes("finance") && expert.role.includes("DAF")) score += 10;
  if (q.includes("cyber") && expert.role.includes("RSSI")) score += 12;
  if (q.includes("cloud") && expert.role.includes("DSI")) score += 10;
  if (q.includes("sap") && expert.role.includes("SAP")) score += 12;
  if (q.includes("nis2") && text.includes("nis2")) score += 15;

  if (expert.available.includes("Immédiate")) score += 4;

  return score;
}

export default function MonEspacePage() {
  const [query, setQuery] = useState("");
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const results = useMemo(() => {
    if (!query) return [];

    const list = EXPERTS.map((e) => ({
      ...e,
      score: scoreExpert(query, e),
    }));

    const filtered = list.filter((e) => e.score >= 8);

    return filtered
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [query]);

  const maxScore =
    results.length > 0
      ? Math.max(...results.map((r) => r.score))
      : 0;

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/contact-expert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          expert: selectedExpert?.role,
        }),
      });

      if (res.ok) {
        setSuccess(true);

        setForm({
          nom: "",
          email: "",
          message: "",
        });
      } else {
        alert("Erreur lors de l’envoi.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur serveur.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-100 text-slate-800">

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          <div className="flex items-center gap-4">
            <img
              src="/Logo.png"
              alt="ITERIUM PARTNERS"
              className="h-10 w-auto"
            />

            <div>
              <div className="font-bold text-[#0A2942]">
                ITERIUM PARTNERS
              </div>

              <div className="text-xs text-slate-500">
                Plateforme IA de mise en relation experts & entreprises
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* HERO */}
      <section
        className="py-20 text-white bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,41,66,0.88), rgba(10,41,66,0.88)), url('/fond.png')",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Trouvez immédiatement l’expert adapté à votre besoin
          </h1>

          <p className="mt-6 text-slate-200 text-lg leading-relaxed">
            DSI, CTO, RSSI, DAF, experts cybersécurité, conformité,
            cloud et transformation digitale disponibles rapidement
            pour vos missions stratégiques.
          </p>

        </div>
      </section>

      {/* RECHERCHE */}
      <section className="max-w-5xl mx-auto px-6 py-14">

        <div className="bg-white rounded-3xl shadow-lg p-6 border">

          <div className="flex items-center gap-3 border rounded-2xl px-5 py-4">
            <Search className="h-5 w-5 text-slate-500" />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex : DSI de transition SAP disponible rapidement"
              className="flex-1 outline-none text-slate-700 placeholder-slate-400"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">

            <span className="bg-slate-100 px-3 py-1 rounded-full">
              DSI
            </span>

            <span className="bg-slate-100 px-3 py-1 rounded-full">
              RSSI
            </span>

            <span className="bg-slate-100 px-3 py-1 rounded-full">
              SAP
            </span>

            <span className="bg-slate-100 px-3 py-1 rounded-full">
              NIS2
            </span>

            <span className="bg-slate-100 px-3 py-1 rounded-full">
              Finance
            </span>

          </div>

        </div>

        {/* RESULTATS */}
        <div className="mt-12">

          {results.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-[#0A2942] mb-6">
                Experts correspondant à votre besoin
              </h2>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {results.map((e) => {
                  const pertinence = maxScore
                    ? Math.round((e.score / maxScore) * 100)
                    : 0;

                  return (
                    <div
                      key={e.id}
                      className="bg-white rounded-3xl border shadow-sm p-6 hover:shadow-xl transition"
                    >

                      <div className="w-20 h-20 rounded-2xl bg-slate-200 mb-5"></div>

                      <div className="font-bold text-xl text-[#0A2942]">
                        {e.role}
                      </div>

                      <div className="text-sm text-slate-500 mt-1">
                        Expérience : {e.experience}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {e.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 space-y-2 text-sm text-slate-600">

                        <div className="flex justify-between">
                          <span>Disponibilité</span>
                          <span className="font-semibold">
                            {e.available}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span>Mode</span>
                          <span className="font-semibold">
                            {e.mode}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span>TJM indicatif</span>
                          <span className="font-semibold text-[#F8B400]">
                            {e.tjm}€ / jour
                          </span>
                        </div>

                      </div>

                      <div className="flex items-center gap-2 mt-5 text-sm">
                        <Gauge className="w-4 h-4 text-[#F8B400]" />

                        <span className="text-slate-500">
                          Pertinence IA :
                        </span>

                        <span className="font-bold text-[#0A2942]">
                          {pertinence}%
                        </span>
                      </div>

                      <div className="mt-6 flex flex-col gap-3">

                        <Link
                          href={`/profils/${e.id}`}
                          className="bg-[#0A2942] text-white text-center py-3 rounded-2xl font-semibold hover:bg-[#081f33] transition"
                        >
                          Voir le profil
                        </Link>

                        <button
                          onClick={() => setSelectedExpert(e)}
                          className="border border-[#0A2942] text-[#0A2942] py-3 rounded-2xl font-semibold hover:bg-slate-50 transition"
                        >
                          Demander une mise en relation
                        </button>

                      </div>

                    </div>
                  );
                })}

              </div>
            </>
          )}

        </div>

      </section>

      {/* MODAL */}
      {selectedExpert && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">

          <div className="bg-white rounded-3xl p-8 max-w-lg w-full relative shadow-2xl">

            <button
              onClick={() => setSelectedExpert(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-[#0A2942] mb-2">
              Demande de mise en relation
            </h3>

            <p className="text-slate-500 mb-6">
              Vous êtes sur le point de demander une mise en relation avec un expert :
            </p>

            <div className="bg-slate-100 rounded-2xl p-4 mb-6">
              <div className="font-semibold text-[#0A2942]">
                {selectedExpert.role}
              </div>

              <div className="text-sm text-slate-500 mt-1">
                Disponibilité : {selectedExpert.available}
              </div>
            </div>

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-green-700">
                Votre demande a bien été transmise à ITERIUM PARTNERS.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                <input
                  required
                  type="text"
                  placeholder="Votre nom"
                  value={form.nom}
                  onChange={(e) =>
                    setForm({ ...form, nom: e.target.value })
                  }
                  className="w-full border rounded-xl px-4 py-3"
                />

                <input
                  required
                  type="email"
                  placeholder="Votre email professionnel"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full border rounded-xl px-4 py-3"
                />

                <textarea
                  required
                  rows="4"
                  placeholder="Décrivez votre besoin"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full border rounded-xl px-4 py-3"
                />

                <div className="bg-slate-100 text-slate-600 text-sm rounded-2xl p-4">
                  Les coordonnées complètes de l’expert sont transmises
                  uniquement après validation de la mise en relation
                  via ITERIUM PARTNERS.
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-[#F8B400] text-[#0A2942] font-bold py-4 rounded-2xl hover:bg-yellow-400 transition"
                >
                  {loading
                    ? "Envoi en cours..."
                    : "Valider la demande"}
                </button>

              </form>
            )}

          </div>

        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t bg-white py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} ITERIUM PARTNERS — Plateforme IA B2B
      </footer>

    </main>
  );
}
