"use client";

import { useState } from "react";

export default function ExpertPage() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    linkedin: "",
    metier: "",
    experience: "",
    expertises: "",
    disponibilite: "",
    localisation: "",
    tjm: "",
    intervention: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/contact-expert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Votre candidature a bien été envoyée.");
    } else {
      alert("Erreur lors de l’envoi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A2942] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Rejoindre le réseau d’experts ITERIUM PARTNERS
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed">
            ITERIUM PARTNERS met en relation des entreprises,
            PME, ETI et grands groupes avec des experts seniors
            immédiatement disponibles pour des missions stratégiques,
            ponctuelles ou de transition.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white text-slate-800 rounded-3xl p-8 shadow-2xl space-y-5"
        >

          <input
            type="text"
            name="nom"
            placeholder="Nom / Prénom"
            value={form.nom}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-xl p-4"
          />

          <input
            type="email"
            name="email"
            placeholder="Email professionnel"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-xl p-4"
          />

          <input
            type="text"
            name="telephone"
            placeholder="Téléphone"
            value={form.telephone}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl p-4"
          />

          <input
            type="text"
            name="linkedin"
            placeholder="Lien LinkedIn ou site professionnel"
            value={form.linkedin}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl p-4"
          />

          <input
            type="text"
            name="metier"
            placeholder="Fonction (DSI, CTO, DAF, RSSI...)"
            value={form.metier}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-xl p-4"
          />

          <textarea
            name="experience"
            placeholder="Résumé de votre parcours et expériences"
            rows={4}
            value={form.experience}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-xl p-4"
          />

          <textarea
            name="expertises"
            placeholder="Expertises clés (SAP, Azure, NIS2, Finance, RH, etc.)"
            rows={3}
            value={form.expertises}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl p-4"
          />

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              name="localisation"
              placeholder="Ville / Région / Pays"
              value={form.localisation}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-4"
            />

            <input
              type="text"
              name="disponibilite"
              placeholder="Disponibilité"
              value={form.disponibilite}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-4"
            />

            <input
              type="text"
              name="tjm"
              placeholder="TJM indicatif (€ / jour)"
              value={form.tjm}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-4"
            />

            <input
              type="text"
              name="intervention"
              placeholder="Télétravail / Hybride / Sur site"
              value={form.intervention}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-4"
            />
          </div>

          <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-sm text-slate-600">
            Les informations transmises restent confidentielles.
            Les clients ITERIUM PARTNERS n’accèdent pas directement
            à vos coordonnées avant validation de la mise en relation
            et contractualisation.
          </div>

          <button
            type="submit"
            className="w-full bg-[#F8B400] text-[#0A2942] font-bold py-4 rounded-2xl hover:bg-yellow-400 transition"
          >
            Rejoindre le réseau ITERIUM PARTNERS
          </button>
        </form>
      </div>
    </div>
  );
}
