"use client";

import { useState } from "react";

export default function ExpertPage() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    metier: "",
    experience: "",
    disponibilite: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Votre demande a bien été envoyée !");
      setForm({
        nom: "",
        email: "",
        metier: "",
        experience: "",
        disponibilite: "",
      });
    } else {
      alert("Erreur lors de l’envoi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A2942] flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">
        Devenir expert ITERIUM PARTNERS
      </h1>

      <p className="text-slate-300 mb-8 text-center max-w-md">
        Rejoignez la plateforme ITERIUM et accédez à des missions ciblées en fonction de vos compétences et disponibilités.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md space-y-4"
      >
        <input
          type="text"
          name="nom"
          placeholder="Nom / Prénom"
          value={form.nom}
          onChange={handleChange}
          required
          className="w-full border border-slate-300 rounded-lg p-3 text-slate-800 placeholder:text-slate-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email professionnel"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-slate-300 rounded-lg p-3 text-slate-800 placeholder:text-slate-500"
        />

        <input
          type="text"
          name="metier"
          placeholder="Votre métier (ex: DSI, DAF, Expert cybersécurité...)"
          value={form.metier}
          onChange={handleChange}
          required
          className="w-full border border-slate-300 rounded-lg p-3 text-slate-800 placeholder:text-slate-500"
        />

        <textarea
          name="experience"
          placeholder="Décrivez brièvement votre expérience"
          value={form.experience}
          onChange={handleChange}
          rows={3}
          required
          className="w-full border border-slate-300 rounded-lg p-3 text-slate-800 placeholder:text-slate-500"
        />

        <input
          type="text"
          name="disponibilite"
          placeholder="Disponibilité (immédiate, sous 1 semaine...)"
          value={form.disponibilite}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg p-3 text-slate-800 placeholder:text-slate-500"
        />

        <button
          type="submit"
          className="w-full bg-[#F8B400] text-[#0A2942] font-semibold py-3 rounded-xl hover:bg-yellow-400 transition"
        >
          Envoyer ma candidature
        </button>
      </form>
    </div>
  );
}