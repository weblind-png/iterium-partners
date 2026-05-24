"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ClientContactPage() {
  const router = useRouter();
  const [expert, setExpert] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // Vérifier session client
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Vérifier rôle client
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData?.role !== "client") {
        router.push("/auth/login");
        return;
      }

      setClient(profileData);

      // Récupérer l'ID expert depuis l'URL
      const params = new URLSearchParams(window.location.search);
      const expertId = params.get("expert");

      if (!expertId) {
        router.push("/client/dashboard");
        return;
      }

      // Charger les données de l'expert
      const { data: expertData } = await supabase
        .from("experts")
        .select("*")
        .eq("id", expertId)
        .single();

      if (!expertData) {
        router.push("/client/dashboard");
        return;
      }

      setExpert(expertData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError("Veuillez décrire votre besoin.");
      return;
    }

    setSending(true);
    setError("");

    // Créer la demande dans Supabase
    const { error: demandeError } = await supabase
      .from("demandes")
      .insert([{
        expert_id: expert.id,
        client_id: client.id,
        message: message,
        statut: "en_attente",
      }]);

    if (demandeError) {
      setError("Erreur lors de l'envoi de la demande.");
      setSending(false);
      return;
    }

    setSuccess(true);
    setSending(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A2942] flex items-center justify-center">
        <p className="text-white">Chargement...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A2942] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <p className="text-5xl mb-4">🎉</p>
          <h2 className="text-2xl font-bold text-[#0A2942] mb-3">
            Demande envoyée !
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Votre demande de mise en relation avec{" "}
            <strong>{expert.prenom} {expert.nom?.charAt(0)}.</strong> a bien été
            transmise. L'expert vous répondra dans les meilleurs délais.
          </p>
          <button
            onClick={() => router.push("/client/dashboard")}
            className="w-full bg-[#F8B400] text-[#0A2942] font-bold py-3 rounded-2xl hover:bg-yellow-400 transition"
          >
            Retour à mon espace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A2942] px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/client/dashboard")}
            className="text-slate-400 hover:text-white transition text-sm"
          >
            ← Retour
          </button>
          <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-8 w-auto" />
        </div>

        {/* Card expert */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">

          <h1 className="text-2xl font-bold text-[#0A2942] mb-6">
            Demande de mise en relation
          </h1>

          {/* Profil expert */}
          <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              {expert.photo_url ? (
                <img src={expert.photo_url} alt={expert.prenom} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>
            <div>
              <p className="font-bold text-[#0A2942]">
                {expert.prenom} {expert.nom?.charAt(0)}.
              </p>
              <p className="text-sm text-slate-500">{expert.metier}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  ✔ Expert Vérifié
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  📍 {expert.localisation}
                </span>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-slate-400">TJM indicatif</p>
              <p className="font-bold text-[#0A2942]">{expert.tjm} €/j</p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">
                Décrivez votre besoin *
              </label>
              <textarea
                rows={6}
                placeholder="Ex: Nous recherchons un expert RSSI pour une mission NIS2 urgente de 3 mois, en hybride, région Île-de-France..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 resize-none"
              />
            </div>

            {/* Infos client */}
            <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-700 mb-2">Vos coordonnées :</p>
              <p>{client.prenom} {client.nom} — {client.email}</p>
              {client.societe && <p>{client.societe}</p>}
            </div>

            {/* Mention confidentialité */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-700">
              🔒 Vos coordonnées complètes et celles de l'expert ne seront échangées
              qu'après signature du contrat de mise en relation et validation du paiement.
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={sending}
              className="w-full bg-[#F8B400] text-[#0A2942] font-bold py-4 rounded-2xl hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {sending ? "Envoi en cours..." : "Envoyer ma demande de mise en relation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
