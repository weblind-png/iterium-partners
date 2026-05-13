"use client";
import React, { useEffect, useState } from "react";
import { Loader2, FileText, FileCheck2, AlertCircle } from "lucide-react";

export default function HistoriquePaiements() {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPaiements() {
      try {
        const res = await fetch("/api/paiements", { cache: "no-store" });
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();

        // ✅ Correction ici : détecter si data est un tableau ou un objet
        const result = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        setPaiements(result);
      } catch (err) {
        console.error("Erreur chargement paiements :", err);
        setError("Impossible de charger l'historique des paiements.");
      } finally {
        setLoading(false);
      }
    }

    fetchPaiements();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-slate-600">
        <Loader2 className="animate-spin mr-2" /> Chargement de l’historique…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  if (!Array.isArray(paiements) || paiements.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-slate-600">
        <FileText className="w-8 h-8 mb-2" />
        <p>Aucun paiement trouvé pour le moment.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-10 w-auto" />
            <div>
              <p className="font-semibold text-[#0A2942] text-lg">ITERIUM PARTNERS</p>
              <p className="text-xs text-slate-500">Espace client — Historique des paiements</p>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-[#0A2942] mb-6">
          Historique de vos paiements
        </h1>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-[#0A2942] text-white text-left">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 text-right">Montant (€)</th>
                <th className="px-4 py-3 text-center">Statut</th>
                <th className="px-4 py-3 text-center">Documents</th>
              </tr>
            </thead>
            <tbody>
              {paiements.map((p) => (
                <tr key={p.id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3">{p.date_paiement}</td>
                  <td className="px-4 py-3">{p.client_nom}</td>
                  <td className="px-4 py-3">{p.client_email}</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {Number(p.montant).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        p.statut === "payé"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      {p.contrat_pdf && (
                        <a
                          href={`/${p.contrat_pdf}`}
                          target="_blank"
                          className="text-[#0A2942] hover:underline flex items-center gap-1"
                        >
                          <FileCheck2 className="w-4 h-4" /> Contrat
                        </a>
                      )}
                      {p.facture_pdf && (
                        <a
                          href={`/${p.facture_pdf}`}
                          target="_blank"
                          className="text-[#F8B400] hover:underline flex items-center gap-1"
                        >
                          <FileText className="w-4 h-4" /> Facture
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} ITERIUM PARTNERS — Historique des paiements
      </footer>
    </main>
  );
}