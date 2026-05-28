"use client";

import React, { useState, useEffect } from "react";
import { Upload, FileText, Clock, Euro, Send } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PropositionExpertPage({ params }) {
  const router = useRouter();
  const [expert, setExpert] = useState<any>(null);
  const [demande, setDemande] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    domaine: "",
    description: "",
    duree: "",
    tjm: "",
    type: "Immédiate",
    commentaire: "",
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Récupérer l'expert connecté
      const { data: expertData } = await supabase
        .from("experts")
        .select("*")
        .eq("email", user.email)
        .single();

      setExpert(expertData);

      // Récupérer la demande
      const { data: demandeData } = await supabase
        .from("demandes")
        .select("*, profiles(prenom, nom, email, societe)")
        .eq("id", params.id)
        .single();

      setDemande(demandeData);

      // Pré-remplir le TJM depuis le profil expert
      if (expertData?.tjm) {
        setFormData(prev => ({ ...prev, tjm: expertData.tjm }));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const { error } = await supabase
        .from("propositions")
        .insert([{
          demande_id: params.id,
          expert_id: expert?.id,
          client_id: demande?.client_id,
          domaine: formData.domaine,
          description: formData.description,
          duree: parseInt(formData.duree),
          tjm: parseFloat(formData.tjm),
          type_intervention: formData.type,
          commentaire: formData.commentaire,
          statut: "en_attente",
        }]);

      if (error) throw new Error(error.message);

      // Mettre à jour le statut de la demande
      await supabase
        .from("demandes")
        .update({ statut: "proposition_envoyee" })
        .eq("id", params.id);

      setStatus({ loading: false, success: true, error: null });

    } catch (err: any) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A2942] flex items-center justify-center">
        <p className="text-white">Chargement...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
      <header className="border-b bg-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-[#0A2942]">Proposition d'intervention</h1>
          <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-8" />
        </div>
      </header>

      <section className="max-w-3xl mx-auto p-6">

        {/* Infos demande client */}
        {demande && (
          <div className="bg-[#0A2942] text-white rounded-2xl p-5 mb-6">
            <p className="text-xs text-slate-400 mb-1">Demande de :</p>
            <p className="font-bold">
              {demande.profiles?.prenom} {demande.profiles?.nom}
              {demande.profiles?.societe && ` — ${demande.profiles.societe}`}
            </p>
            <p className="text-sm text-slate-300 mt-2">{demande.message}</p>
          </div>
        )}

        <h2 className="text-2xl font-semibold text-[#0A2942] mb-6">
          Votre proposition — Mission #{params.id?.slice(0, 8)}
        </h2>

        {status.success ? (
          <div className="p-6 bg-green-50 border border-green-300 text-green-700 rounded-xl text-center">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-bold mb-1">Proposition envoyée avec succès !</p>
            <p className="text-sm mb-4">Le client sera notifié et pourra valider votre proposition.</p>
            <button
              onClick={() => router.push("/expert/dashboard")}
              className="bg-[#0A2942] text-white font-bold py-2 px-6 rounded-xl hover:bg-slate-800 transition"
            >
              Retour à mon espace
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-3xl shadow p-8">

            {/* Infos expert pré-remplies */}
            {expert && (
              <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0A2942] text-white flex items-center justify-center font-bold text-sm">
                  {expert.prenom?.charAt(0)}{expert.nom?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#0A2942]">{expert.prenom} {expert.nom}</p>
                  <p className="text-xs text-slate-500">{expert.metier}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Domaine d'intervention *
              </label>
              <input
                type="text"
                name="domaine"
                placeholder="Ex : Cybersécurité NIS2, Transformation digitale, DAF de transition..."
                value={formData.domaine}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Description de votre approche *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Décrivez comment vous allez répondre au besoin du client..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#F8B400]" /> Durée (jours) *
                </label>
                <input
                  type="number"
                  name="duree"
                  value={formData.duree}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Ex: 10"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Euro className="h-4 w-4 text-[#F8B400]" /> TJM (€/jour) *
                </label>
                <input
                  type="number"
                  name="tjm"
                  value={formData.tjm}
                  onChange={handleChange}
                  required
                  min="100"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Type d'intervention
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 bg-white"
                >
                  <option>Immédiate</option>
                  <option>Programmée</option>
                  <option>Distanciel</option>
                  <option>Hybride</option>
                  <option>Sur site</option>
                </select>
              </div>
            </div>

            {/* Montant total calculé */}
            {formData.duree && formData.tjm && (
              <div className="bg-[#F8B400]/10 border border-[#F8B400] rounded-2xl p-4 text-center">
                <p className="text-sm text-slate-600">Montant total estimé</p>
                <p className="text-2xl font-bold text-[#0A2942]">
                  {(parseInt(formData.duree) * parseFloat(formData.tjm)).toLocaleString("fr-FR")} €
                </p>
                <p className="text-xs text-slate-400">{formData.duree} jour(s) × {formData.tjm} €/jour</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Commentaire (facultatif)
              </label>
              <textarea
                name="commentaire"
                value={formData.commentaire}
                onChange={handleChange}
                rows={2}
                placeholder="Informations complémentaires, disponibilités spécifiques..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400"
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
              className="w-full bg-[#F8B400] text-[#0A2942] font-bold rounded-2xl py-4 hover:bg-yellow-400 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="h-5 w-5" />
              {status.loading ? "Envoi en cours..." : "Envoyer ma proposition au client"}
            </button>

          </form>
        )}
      </section>

      <footer className="border-t text-center py-6 text-slate-500 text-sm mt-10">
        © {new Date().getFullYear()} ITERIUM PARTNERS — Proposition Expert Sécurisée
      </footer>
    </main>
  );
}
