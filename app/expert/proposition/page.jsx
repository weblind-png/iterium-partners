"use client";
import React, { useState } from "react";
import { Upload, FileText, Clock, Euro, Send } from "lucide-react";

export default function PropositionExpertPage({ params }) {
  const [formData, setFormData] = useState({
    nom: "",
    domaine: "",
    description: "",
    duree: "",
    tjm: "",
    type: "Immédiate",
    devis: null,
    commentaire: "",
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFile = (e) => {
    setFormData({ ...formData, devis: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => data.append(key, val));
      data.append("id", params.id);

      const res = await fetch("/api/propositions", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Erreur lors de l’envoi du devis");

      setStatus({ loading: false, success: true, error: null });
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
      <header className="border-b bg-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-[#0A2942]">Proposition d’intervention</h1>
          <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-8" />
        </div>
      </header>

      <section className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-semibold text-[#0A2942] mb-6">
          Formulaire de proposition – Mission #{params.id}
        </h2>

        {status.success ? (
          <div className="p-6 bg-green-50 border border-green-300 text-green-700 rounded-xl text-center">
            ✅ Votre proposition a été transmise au client.  
            Vous serez notifié dès qu’il validera le devis.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nom / Prénom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Domaine d’intervention</label>
              <input
                type="text"
                name="domaine"
                placeholder="Ex : Comptabilité, Cybersécurité, RH..."
                value={formData.domaine}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description de la mission</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full border rounded-xl px-4 py-2"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#F8B400]" /> Durée (en jours)
                </label>
                <input
                  type="number"
                  name="duree"
                  value={formData.duree}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full border rounded-xl px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Euro className="h-4 w-4 text-[#F8B400]" /> TJM (€)
                </label>
                <input
                  type="number"
                  name="tjm"
                  value={formData.tjm}
                  onChange={handleChange}
                  required
                  min="100"
                  className="w-full border rounded-xl px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type d’intervention</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2"
                >
                  <option>Immédiate</option>
                  <option>Programmée</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#F8B400]" /> Devis PDF
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFile}
                className="w-full border rounded-xl px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Commentaire (facultatif)</label>
              <textarea
                name="commentaire"
                value={formData.commentaire}
                onChange={handleChange}
                rows="2"
                className="w-full border rounded-xl px-4 py-2"
              />
            </div>

            {status.error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-300 rounded-xl p-3">
                ❌ {status.error}
              </div>
            )}

            <button
              type="submit"
              disabled={status.loading}
              className="w-full bg-[#0A2942] text-white rounded-xl py-3 font-semibold hover:bg-[#062032] flex items-center justify-center gap-2"
            >
              <Send className="h-5 w-5" />
              {status.loading ? "Envoi en cours..." : "Envoyer la proposition au client"}
            </button>
          </form>
        )}
      </section>

      <footer className="border-t text-center py-6 text-slate-500 text-sm">
        © {new Date().getFullYear()} ITERIUM PARTNERS — Proposition Expert Sécurisée
      </footer>
    </main>
  );
}