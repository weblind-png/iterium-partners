"use client";
import React, { useState, useEffect } from "react";
import { Send, Mail, Building2, User, FileText, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [plan, setPlan] = useState("standard"); // "standard" ou "premium"
  const [sent, setSent] = useState(false);

  // Détection automatique de la formule via URL ?plan=premium
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get("plan");
    if (planParam === "premium") setPlan("premium");
  }, []);

  // Sujet et message prérempli selon la formule
  const subject =
    plan === "premium"
      ? "Demande de devis – Formule Premium Groupe"
      : "Demande d'accès – Abonnement Standard Entreprise";

  const defaultMessage =
    plan === "premium"
      ? "Bonjour, nous souhaiterions obtenir un devis pour la Formule Premium Groupe afin de donner accès à plusieurs entités de notre groupe aux experts Itrium Conseil."
      : "Bonjour, nous souhaiterions souscrire à l'abonnement Standard Entreprise pour bénéficier d’un accès à vos experts.";

  // Envoi simulé — à remplacer par ton backend / service mail
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          plan,
          subject,
        }),
      });
      if (response.ok) {
        setSent(true);
      } else {
        alert("Erreur lors de l'envoi du message. Réessaie plus tard.");
      }
    } catch (error) {
      alert("Erreur réseau : " + error.message);
    }
  };

  if (sent) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 text-slate-800">
        <div className="text-center space-y-4">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
          <h1 className="text-2xl font-semibold text-[#0A2942]">Message envoyé !</h1>
          <p className="text-slate-600 max-w-md mx-auto">
            Merci pour votre intérêt. Notre équipe vous répondra dans les plus brefs délais à l’adresse indiquée.
          </p>
          <a
            href="/"
            className="inline-block bg-[#0A2942] text-white rounded-xl px-6 py-3 hover:bg-[#062032]"
          >
            Retour à l’accueil
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-10 w-auto" />
            <div>
              <p className="font-semibold text-[#0A2942]">ITERIUM PARTNERS</p>
              <p className="text-xs text-slate-500">Intervention Express des Cadres Seniors</p>
            </div>
          </div>
          <a
            href="/"
            className="bg-[#0A2942] text-white rounded-xl px-4 py-2 hover:bg-[#062032]"
          >
            Accueil
          </a>
        </div>
      </header>

      <section
        className="py-20 bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,41,66,0.8),rgba(10,41,66,0.8)),url(/fond.png)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {plan === "premium"
              ? "Demande de devis – Formule Premium Groupe"
              : "Demande d'accès – Abonnement Standard Entreprise"}
          </h1>
          <p className="text-slate-200 text-lg max-w-2xl mx-auto">
            Remplissez le formulaire ci-dessous, nous reviendrons vers vous rapidement pour finaliser votre souscription.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Building2 className="inline h-4 w-4 mr-1 text-[#0A2942]" />
                Nom de l’entreprise
              </label>
              <input
                required
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2942]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <User className="inline h-4 w-4 mr-1 text-[#0A2942]" />
                Nom et prénom
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2942]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Mail className="inline h-4 w-4 mr-1 text-[#0A2942]" />
                Email professionnel
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2942]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2942]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <FileText className="inline h-4 w-4 mr-1 text-[#0A2942]" />
              Votre message
            </label>
            <textarea
              rows={5}
              required
              value={formData.message || defaultMessage}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2942]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0A2942] text-white rounded-xl py-3 text-base font-medium hover:bg-[#062032]"
          >
            <Send className="inline h-4 w-4 mr-2" /> Envoyer la demande
          </button>
        </form>
      </section>

      <footer className="border-t py-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} ITERIUM PARTNERS — Intervention Express des Cadres Top Level
      </footer>
    </main>
  );
}